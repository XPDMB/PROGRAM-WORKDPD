/**
 * DPD Stock shared backend for Google Apps Script (V8).
 * Preview/Demo mode does not call this file.
 */
const DPD = Object.freeze({
  sheets: {
    users: ['email', 'role', 'displayName', 'active', 'updatedAt'],
    accounts: ['username', 'role', 'displayName', 'active', 'updatedAt', 'passwordHash', 'passwordSalt', 'mustChangePassword', 'failedAttempts', 'lockUntil', 'passwordVersion', 'lastLoginAt'],
    products: ['id', 'key', 'type', 'status', 'code', 'requestId', 'updatedAt', 'version', 'dataJson'],
    requests: ['id', 'key', 'type', 'status', 'code', 'requestId', 'updatedAt', 'version', 'dataJson'],
    movements: ['id', 'key', 'type', 'status', 'code', 'requestId', 'updatedAt', 'version', 'dataJson'],
    personnel: ['id', 'key', 'type', 'status', 'code', 'requestId', 'updatedAt', 'version', 'dataJson'],
    audit: ['id', 'at', 'email', 'role', 'action', 'entityType', 'entityId', 'requestId', 'detailsJson'],
    idempotency: ['requestId', 'at', 'email', 'action', 'responseJson']
  },
  roles: ['viewer', 'staff', 'approver', 'admin'],
  operatorActions: [
    'upsertProduct', 'deleteProduct', 'receiveStock', 'stocktake', 'createRequest',
    'approveRequest', 'rejectRequest', 'cancelRequest', 'dispenseRequest',
    'returnRequest', 'closeRequest'
  ],
  actionRoles: {
    upsertProduct: ['staff', 'admin'], deleteProduct: ['admin'],
    receiveStock: ['staff', 'admin'], stocktake: ['staff', 'admin'],
    createRequest: ['viewer', 'staff', 'approver', 'admin'],
    approveRequest: ['approver', 'admin'], rejectRequest: ['approver', 'admin'],
    cancelRequest: ['viewer', 'staff', 'approver', 'admin'],
    dispenseRequest: ['staff', 'admin'], returnRequest: ['staff', 'admin'], closeRequest: ['staff', 'admin'],
    upsertPersonnel: ['admin'], deletePersonnel: ['admin'], setUserRole: ['admin']
  },
  auth: { sessionSeconds: 21600, maxFailures: 5, lockMinutes: 15, minNewPassword: 10 },
  maxBodyBytes: 100000,
  maxText: 1000
});

function setupDatabase() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = String(props.getProperty('SPREADSHEET_ID') || '').trim();
  const initialAdmin = String(props.getProperty('INITIAL_ADMIN_EMAIL') || Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (!spreadsheetId) throw new Error('Set SPREADSHEET_ID in Script Properties first.');
  if (!initialAdmin) throw new Error('Set INITIAL_ADMIN_EMAIL in Script Properties first.');

  const ss = SpreadsheetApp.openById(spreadsheetId);
  Object.keys(DPD.sheets).forEach(function(name) {
    ensureSheet_(ss, sheetName_(name), DPD.sheets[name]);
  });

  const users = ss.getSheetByName(sheetName_('users'));
  const existing = findUserRow_(users, initialAdmin);
  const now = new Date().toISOString();
  const row = [safeCell_(initialAdmin), 'admin', safeCell_(initialAdmin), true, now];
  if (existing > 0) users.getRange(existing, 1, 1, row.length).setValues([row]);
  else users.appendRow(row);

  props.setProperty('BACKEND_SCHEMA_VERSION', '1');
  return { ok: true, spreadsheetId: spreadsheetId, initialAdmin: initialAdmin };
}

function doGet(e) {
  const requestedAction = cleanText_((e && e.parameter && e.parameter.action) || '', 40);
  if (!requestedAction) {
    return HtmlService.createHtmlOutputFromFile('TestApp')
      .setTitle('DPD Stock')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
  }
  return respond_(function() {
    if (requestedAction !== 'health') throw appError_('UNKNOWN_ACTION', 'Unknown GET action.');
    return { ok: true, service: 'dpd-stock-backend', schemaVersion: 1, auth: 'password-session' };
  });
}

function doPost(e) {
  return respond_(function() {
    const raw = e && e.postData ? String(e.postData.contents || '') : '';
    if (!raw || raw.length > DPD.maxBodyBytes) throw appError_('INVALID_BODY', 'Request body is missing or too large.');

    let body;
    try { body = JSON.parse(raw); } catch (err) { throw appError_('INVALID_JSON', 'Request body must be valid JSON.'); }

    return processCommand_(body);
  });
}

function uiAuthStatus() {
  return authStatus_();
}

function uiInitializeAdmin(input) {
  return initializeAdmin_(input || {});
}

function uiLogin(input) {
  return login_(input || {});
}

function uiLogout(sessionToken) {
  revokeSession_(sessionToken);
  return { ok: true };
}

function uiChangePassword(input) {
  return changePassword_(input || {});
}

function uiBootstrap(sessionToken) {
  const actor = authenticateSession_(sessionToken, false);
  return bootstrap_(actor);
}

function uiCommand(body) {
  return processCommand_(body || {});
}

function processCommand_(body) {
  const actor = authenticateSession_(body.sessionToken, false);
  verifyCsrf_(body.csrfToken, actor.csrfToken);
  const action = cleanText_(body.action, 50);
  const requestId = cleanText_(body.requestId, 100);
  if (!action || !requestId) throw appError_('INVALID_REQUEST', 'action and requestId are required.');
  requireActionRole_(actor, action);

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw appError_('BUSY', 'The database is busy. Please try again.');
  try {
    const previous = findIdempotent_(requestId, actor.email);
    if (previous) return previous;

    attachOperator_(actor, action, body.operatorId);
    const result = executeCommand_(action, body.payload || {}, actor);
    const response = { ok: true, requestId: requestId, result: result };
    writeIdempotent_(requestId, actor, action, response);
    writeAudit_(actor, action, result.entityType || '', result.entityId || '', requestId, {
      version: result.version || null,
      documentNo: result.documentNo || '',
      operatorId: actor.operatorId || '',
      operatorName: actor.operatorName || ''
    });
    SpreadsheetApp.flush();
    return response;
  } finally {
    lock.releaseLock();
  }
}

function bootstrap_(actor) {
  let requests = listEntities_('requests');
  let movements = listEntities_('movements');
  if (actor.role === 'viewer') {
    requests = requests.filter(function(request) {
      return String(request.requestedByEmail || '').toLowerCase() === actor.email;
    });
    movements = [];
  }
  const history = requests.concat(movements).sort(function(a, b) {
    return String(b.date || b.updatedAt || '').localeCompare(String(a.date || a.updatedAt || ''));
  });
  return {
    ok: true,
    schemaVersion: 1,
    profile: publicActor_(actor),
    csrfToken: actor.csrfToken,
    products: listEntities_('products'),
    history: history,
    personnel: actor.role === 'admin' ? listEntities_('personnel') : [],
    operators: listPublicOperators_(),
    accounts: actor.role === 'admin' ? listPublicAccounts_() : [],
    serverTime: new Date().toISOString()
  };
}

function listPublicOperators_() {
  return listEntities_('personnel').filter(function(person) {
    return person.active !== false;
  }).map(function(person) {
    return {
      id: cleanText_(person.id, 100),
      name: cleanText_(person.name, 200),
      position: cleanText_(person.position, 200)
    };
  }).filter(function(person) {
    return person.id && person.name;
  });
}

function attachOperator_(actor, action, operatorId) {
  if (DPD.operatorActions.indexOf(action) < 0) return actor;
  const id = cleanRequired_(operatorId, 100, 'Actual operator');
  const person = requireEntity_('personnel', id);
  if (person.active === false) throw appError_('OPERATOR_INACTIVE', 'ผู้ดำเนินการนี้ถูกปิดใช้งาน');
  actor.operatorId = id;
  actor.operatorName = cleanRequired_(person.name, 200, 'Actual operator name');
  actor.operatorPosition = cleanText_(person.position, 200);
  return actor;
}

function actionUser_(actor) {
  return actor.operatorName || actor.displayName;
}

function executeCommand_(action, payload, actor) {
  switch (action) {
    case 'upsertProduct': return upsertProduct_(payload, actor);
    case 'deleteProduct': return deleteProduct_(payload, actor);
    case 'receiveStock': return receiveStock_(payload, actor);
    case 'stocktake': return stocktake_(payload, actor);
    case 'createRequest': return createRequest_(payload, actor);
    case 'approveRequest': return approveRequest_(payload, actor);
    case 'rejectRequest': return rejectRequest_(payload, actor);
    case 'cancelRequest': return cancelRequest_(payload, actor);
    case 'dispenseRequest': return dispenseRequest_(payload, actor);
    case 'returnRequest': return returnRequest_(payload, actor);
    case 'closeRequest': return closeRequest_(payload, actor);
    case 'upsertPersonnel': return upsertPersonnel_(payload, actor);
    case 'deletePersonnel': return deletePersonnel_(payload, actor);
    case 'setUserRole': return setUserRole_(payload, actor);
    default: throw appError_('UNKNOWN_ACTION', 'Unknown command action.');
  }
}

function upsertProduct_(payload, actor) {
  requireRole_(actor, ['staff', 'admin']);
  const input = payload.product || {};
  const code = cleanRequired_(input.code, 50, 'Product code');
  const existing = getEntity_('products', code);
  const product = existing || {};
  product.id = code;
  product.code = code;
  product.name = cleanRequired_(input.name, 200, 'Product name');
  product.cat = cleanText_(input.cat || 'อื่นๆ', 100);
  product.qty = existing ? int_(existing.qty, 0, 1000000000, 'qty') : int_(input.qty || 0, 0, 1000000000, 'qty');
  if (existing && input.qty !== undefined && Number(input.qty) !== Number(existing.qty)) {
    throw appError_('USE_STOCK_COMMAND', 'Use receiveStock or stocktake to change quantity.');
  }
  product.min = int_(input.min || 0, 0, 1000000000, 'min');
  product.unit = cleanText_(input.unit || 'ชิ้น', 50);
  product.loc = cleanText_(input.loc, 200);
  product.img = cleanText_(input.img, 1000);
  const saved = saveEntity_('products', product, payload.expectedVersion);
  return entityResult_('product', saved);
}

function deleteProduct_(payload, actor) {
  requireRole_(actor, ['admin']);
  const code = cleanRequired_(payload.code, 50, 'Product code');
  const active = listEntities_('requests').some(function(request) {
    return request.code === code && ['pending', 'approved', 'dispensed'].indexOf(request.status || 'pending') >= 0;
  });
  if (active) throw appError_('ACTIVE_REQUEST', 'Product has an active requisition.');
  deleteEntity_('products', code, payload.expectedVersion);
  return { entityType: 'product', entityId: code, deleted: true };
}

function receiveStock_(payload, actor) {
  requireRole_(actor, ['staff', 'admin']);
  const code = cleanRequired_(payload.code, 50, 'Product code');
  const quantity = int_(payload.qty, 1, 1000000000, 'qty');
  const product = requireEntity_('products', code);
  checkVersion_(product, payload.expectedVersion);
  product.qty = int_(product.qty, 0, 1000000000, 'qty') + quantity;
  const savedProduct = saveEntity_('products', product, product.version);
  const movement = {
    id: Utilities.getUuid(), date: new Date().toISOString(), type: 'รับ', status: 'completed',
    code: code, name: product.name, qty: quantity, user: actionUser_(actor),
    operatorId: actor.operatorId, operatorName: actor.operatorName,
    note: cleanText_(payload.note, DPD.maxText)
  };
  saveEntity_('movements', movement);
  return { entityType: 'product', entityId: code, version: savedProduct.version, qty: savedProduct.qty };
}

function stocktake_(payload, actor) {
  requireRole_(actor, ['staff', 'admin']);
  const code = cleanRequired_(payload.code, 50, 'Product code');
  const actual = int_(payload.actualQty, 0, 1000000000, 'actualQty');
  const reason = cleanRequired_(payload.reason, DPD.maxText, 'Stocktake reason');
  const product = requireEntity_('products', code);
  checkVersion_(product, payload.expectedVersion);
  const before = int_(product.qty, 0, 1000000000, 'qty');
  product.qty = actual;
  const savedProduct = saveEntity_('products', product, product.version);
  const movement = {
    id: Utilities.getUuid(), date: new Date().toISOString(), type: 'ตรวจนับ', status: 'completed',
    code: code, name: product.name, qty: Math.abs(actual - before), beforeQty: before,
    actualQty: actual, difference: actual - before, countedBy: actionUser_(actor),
    operatorId: actor.operatorId, operatorName: actor.operatorName,
    user: actionUser_(actor), note: reason
  };
  saveEntity_('movements', movement);
  return { entityType: 'product', entityId: code, version: savedProduct.version, qty: actual, difference: actual - before };
}

function createRequest_(payload, actor) {
  requireRole_(actor, ['viewer', 'staff', 'approver', 'admin']);
  const input = payload.request || {};
  const code = cleanRequired_(input.code, 50, 'Product code');
  const product = requireEntity_('products', code);
  const quantity = int_(input.qty, 1, 1000000000, 'qty');
  if (quantity > Number(product.qty || 0)) throw appError_('INSUFFICIENT_STOCK', 'Requested quantity exceeds current stock.');

  const now = new Date().toISOString();
  const request = {
    id: Utilities.getUuid(), requestNo: nextDocumentNo_('REQ', 'requests', 'requestNo'),
    date: now, createdAt: now, type: 'ขอเบิก', status: 'pending',
    code: code, name: product.name, qty: quantity,
    approvedQty: 0, dispensedQty: 0, returnedQty: 0, closedQty: 0,
    user: cleanRequired_(input.user, 200, 'Recipient name'),
    userPosition: cleanText_(input.userPosition, 200),
    requestedBy: actionUser_(actor), requestedByEmail: actor.email,
    requestedByAccount: actor.username || actor.email, requestedByOperatorId: actor.operatorId,
    note: cleanText_(input.note, DPD.maxText),
    activityLog: [{ action: 'submitted', label: 'ส่งคำขอ', user: actionUser_(actor), account: actor.username || actor.email, at: now, qty: quantity, documentNo: '' }]
  };
  const saved = saveEntity_('requests', request);
  return { entityType: 'request', entityId: saved.id, version: saved.version, documentNo: saved.requestNo, request: saved };
}

function approveRequest_(payload, actor) {
  requireRole_(actor, ['approver', 'admin']);
  const request = requireEntity_('requests', cleanRequired_(payload.id, 100, 'Request id'));
  checkVersion_(request, payload.expectedVersion);
  if ((request.status || 'pending') !== 'pending') throw appError_('INVALID_STATUS', 'Request is not pending.');
  const quantity = int_(payload.qty, 1, Number(request.qty || 0), 'qty');
  request.approvedQty = quantity;
  request.status = 'approved';
  request.approvedBy = actionUser_(actor);
  request.approvedByEmail = actor.email;
  request.approvedByAccount = actor.username || actor.email;
  request.approvedAt = new Date().toISOString();
  appendActivity_(request, 'approved', 'อนุมัติ', actor, quantity, '');
  const saved = saveEntity_('requests', request, request.version);
  return entityResult_('request', saved);
}

function rejectRequest_(payload, actor) {
  requireRole_(actor, ['approver', 'admin']);
  const request = requireEntity_('requests', cleanRequired_(payload.id, 100, 'Request id'));
  checkVersion_(request, payload.expectedVersion);
  if ((request.status || 'pending') !== 'pending') throw appError_('INVALID_STATUS', 'Request is not pending.');
  request.status = 'rejected';
  request.rejectedBy = actionUser_(actor);
  request.rejectedByEmail = actor.email;
  request.rejectedByAccount = actor.username || actor.email;
  request.rejectedAt = new Date().toISOString();
  request.rejectionReason = cleanRequired_(payload.reason, DPD.maxText, 'Rejection reason');
  appendActivity_(request, 'rejected', 'ปฏิเสธ', actor, 0, '');
  return entityResult_('request', saveEntity_('requests', request, request.version));
}

function cancelRequest_(payload, actor) {
  const request = requireEntity_('requests', cleanRequired_(payload.id, 100, 'Request id'));
  checkVersion_(request, payload.expectedVersion);
  const owner = String(request.requestedByEmail || '').toLowerCase() === actor.email;
  if (!owner && actor.role !== 'admin') throw appError_('FORBIDDEN', 'Only the requester or admin can cancel.');
  if (['pending', 'approved'].indexOf(request.status || 'pending') < 0 || Number(request.dispensedQty || 0) > 0) {
    throw appError_('INVALID_STATUS', 'Request cannot be cancelled after dispensing starts.');
  }
  request.status = 'cancelled';
  request.cancelledBy = actionUser_(actor);
  request.cancelledByAccount = actor.username || actor.email;
  request.cancelledAt = new Date().toISOString();
  appendActivity_(request, 'cancelled', 'ยกเลิก', actor, 0, '');
  return entityResult_('request', saveEntity_('requests', request, request.version));
}

function dispenseRequest_(payload, actor) {
  requireRole_(actor, ['staff', 'admin']);
  const request = requireEntity_('requests', cleanRequired_(payload.id, 100, 'Request id'));
  checkVersion_(request, payload.expectedVersion);
  if (request.status !== 'approved') throw appError_('INVALID_STATUS', 'Request is not approved or has no remaining quantity.');
  const approved = Number(request.approvedQty || request.qty || 0);
  const dispensed = Number(request.dispensedQty || 0);
  const remaining = approved - dispensed;
  const quantity = int_(payload.qty, 1, remaining, 'qty');
  const product = requireEntity_('products', request.code);
  if (Number(product.qty || 0) < quantity) throw appError_('INSUFFICIENT_STOCK', 'Stock is insufficient.');

  product.qty = Number(product.qty) - quantity;
  saveEntity_('products', product, product.version);
  const issueNo = nextDocumentNo_('ISS', 'movements', 'issueNo');
  request.dispensedQty = dispensed + quantity;
  request.status = request.dispensedQty >= approved ? 'dispensed' : 'approved';
  request.issueNo = issueNo;
  request.dispensedBy = actionUser_(actor);
  request.dispensedByAccount = actor.username || actor.email;
  request.dispensedAt = new Date().toISOString();
  appendActivity_(request, 'dispensed', 'จ่ายพัสดุ', actor, quantity, issueNo);
  const savedRequest = saveEntity_('requests', request, request.version);
  saveEntity_('movements', {
    id: Utilities.getUuid(), requestId: request.id, requestNo: request.requestNo, issueNo: issueNo,
    date: request.dispensedAt, type: 'เบิก', status: 'completed', code: request.code,
    name: request.name, qty: quantity, user: request.user, userPosition: request.userPosition,
    dispensedBy: actionUser_(actor), operatorId: actor.operatorId,
    operatorName: actor.operatorName, account: actor.username || actor.email, note: request.note
  });
  return { entityType: 'request', entityId: request.id, version: savedRequest.version, documentNo: issueNo, request: savedRequest, stockQty: product.qty };
}

function returnRequest_(payload, actor) {
  requireRole_(actor, ['staff', 'admin']);
  const request = requireEntity_('requests', cleanRequired_(payload.id, 100, 'Request id'));
  checkVersion_(request, payload.expectedVersion);
  if (request.status !== 'dispensed') throw appError_('INVALID_STATUS', 'Request is not awaiting return or close.');
  const remaining = Number(request.dispensedQty || 0) - Number(request.returnedQty || 0) - Number(request.closedQty || 0);
  const quantity = int_(payload.qty, 1, remaining, 'qty');
  const product = requireEntity_('products', request.code);
  product.qty = Number(product.qty || 0) + quantity;
  saveEntity_('products', product, product.version);

  const returnNo = nextDocumentNo_('RET', 'movements', 'returnNo');
  request.returnedQty = Number(request.returnedQty || 0) + quantity;
  request.returnNo = returnNo;
  request.returnedBy = actionUser_(actor);
  request.returnedByAccount = actor.username || actor.email;
  request.returnedAt = new Date().toISOString();
  const accounted = Number(request.returnedQty) + Number(request.closedQty || 0);
  request.status = accounted >= Number(request.dispensedQty || 0) ? (Number(request.closedQty || 0) > 0 ? 'closed' : 'returned') : 'dispensed';
  appendActivity_(request, 'returned', 'รับคืน', actor, quantity, returnNo);
  const savedRequest = saveEntity_('requests', request, request.version);
  saveEntity_('movements', {
    id: Utilities.getUuid(), requestId: request.id, requestNo: request.requestNo, issueNo: request.issueNo,
    returnNo: returnNo, date: request.returnedAt, type: 'คืน', status: 'completed',
    code: request.code, name: request.name, qty: quantity, user: request.user,
    returnedBy: actionUser_(actor), operatorId: actor.operatorId,
    operatorName: actor.operatorName, account: actor.username || actor.email,
    note: cleanText_(payload.note, DPD.maxText)
  });
  return { entityType: 'request', entityId: request.id, version: savedRequest.version, documentNo: returnNo, request: savedRequest, stockQty: product.qty };
}

function closeRequest_(payload, actor) {
  requireRole_(actor, ['staff', 'admin']);
  const request = requireEntity_('requests', cleanRequired_(payload.id, 100, 'Request id'));
  checkVersion_(request, payload.expectedVersion);
  if (request.status !== 'dispensed') throw appError_('INVALID_STATUS', 'Request is not awaiting close.');
  const remaining = Number(request.dispensedQty || 0) - Number(request.returnedQty || 0) - Number(request.closedQty || 0);
  const quantity = int_(payload.qty, 1, remaining, 'qty');
  request.closedQty = Number(request.closedQty || 0) + quantity;
  request.closedBy = actionUser_(actor);
  request.closedByAccount = actor.username || actor.email;
  request.closedAt = new Date().toISOString();
  request.closeReason = cleanRequired_(payload.reason, DPD.maxText, 'Close reason');
  const accounted = Number(request.returnedQty || 0) + Number(request.closedQty);
  request.status = accounted >= Number(request.dispensedQty || 0) ? 'closed' : 'dispensed';
  appendActivity_(request, 'closed', 'ปิดรายการ', actor, quantity, '');
  return entityResult_('request', saveEntity_('requests', request, request.version));
}

function upsertPersonnel_(payload, actor) {
  requireRole_(actor, ['admin']);
  const input = payload.person || {};
  const id = cleanText_(input.id, 100) || Utilities.getUuid();
  const person = {
    id: id, name: cleanRequired_(input.name, 200, 'Personnel name'),
    position: cleanText_(input.position, 200), phone: cleanText_(input.phone, 40)
  };
  return entityResult_('personnel', saveEntity_('personnel', person, payload.expectedVersion));
}

function deletePersonnel_(payload, actor) {
  requireRole_(actor, ['admin']);
  const id = cleanRequired_(payload.id, 100, 'Personnel id');
  deleteEntity_('personnel', id, payload.expectedVersion);
  return { entityType: 'personnel', entityId: id, deleted: true };
}

function setUserRole_(payload, actor) {
  requireRole_(actor, ['admin']);
  const username = normalizeUsername_(payload.username);
  const role = cleanRequired_(payload.role, 20, 'Role').toLowerCase();
  if (DPD.roles.indexOf(role) < 0) throw appError_('INVALID_ROLE', 'Unknown role.');
  const existing = getAccount_(username);
  if (username === actor.username && (role !== 'admin' || payload.active === false)) {
    throw appError_('SELF_PROTECTION', 'Admin cannot remove or disable their own access.');
  }
  const account = existing || {
    username: username, failedAttempts: 0, lockUntil: '', passwordVersion: 0, lastLoginAt: ''
  };
  account.role = role;
  account.displayName = cleanRequired_(payload.displayName || username, 200, 'Display name');
  account.active = payload.active !== false;
  const initialPassword = String(payload.initialPassword || '');
  if (!existing && !initialPassword) throw appError_('PASSWORD_REQUIRED', 'Temporary password is required for a new account.');
  if (initialPassword) {
    validateInitialPassword_(initialPassword);
    account.passwordSalt = randomSecret_();
    account.passwordHash = passwordHash_(initialPassword, account.passwordSalt);
    account.mustChangePassword = false;
    account.passwordVersion = Number(account.passwordVersion || 0) + 1;
    account.failedAttempts = 0;
    account.lockUntil = '';
  }
  saveAccount_(account);
  return { entityType: 'user', entityId: username, role: role, active: account.active, username: username };
}

function appendActivity_(request, action, label, actor, qty, documentNo) {
  if (!Array.isArray(request.activityLog)) request.activityLog = [];
  request.activityLog.push({
    action: action, label: label, user: actionUser_(actor), email: actor.email,
    operatorId: actor.operatorId || '', account: actor.username || actor.email,
    at: new Date().toISOString(), qty: Number(qty || 0), documentNo: documentNo || ''
  });
  request.activityLog = request.activityLog.slice(-100);
}

function requireRole_(actor, allowed) {
  if (allowed.indexOf(actor.role) < 0) throw appError_('FORBIDDEN', 'This role cannot perform the requested action.');
}

function requireActionRole_(actor, action) {
  const allowed = DPD.actionRoles[action];
  if (!allowed) throw appError_('UNKNOWN_ACTION', 'Unknown command action.');
  requireRole_(actor, allowed);
}

function publicActor_(actor) {
  return { username: actor.username, email: actor.username, role: actor.role, displayName: actor.displayName };
}

function authStatus_() {
  const sheet = accountSheet_();
  const initialized = sheet.getLastRow() >= 2;
  const activeEmail = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  const effectiveEmail = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  return { initialized: initialized, canInitialize: !initialized && !!activeEmail && activeEmail === effectiveEmail };
}

function initializeAdmin_(input) {
  const status = authStatus_();
  if (status.initialized) throw appError_('ALREADY_INITIALIZED', 'Authentication is already initialized.');
  if (!status.canInitialize) throw appError_('FORBIDDEN', 'Only the script owner can initialize authentication.');
  const username = normalizeUsername_(input.username || 'admin');
  const password = String(input.password || '');
  validateInitialPassword_(password);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (accountSheet_().getLastRow() >= 2) throw appError_('ALREADY_INITIALIZED', 'Authentication is already initialized.');
    ensureAuthPepper_();
    const salt = randomSecret_();
    saveAccount_({
      username: username, role: 'admin', displayName: cleanText_(input.displayName || 'ผู้ดูแลระบบ', 200), active: true,
      passwordHash: passwordHash_(password, salt), passwordSalt: salt, mustChangePassword: false,
      failedAttempts: 0, lockUntil: '', passwordVersion: 1, lastLoginAt: ''
    });
    return { ok: true, username: username, mustChangePassword: false };
  } finally {
    lock.releaseLock();
  }
}

function login_(input) {
  const username = normalizeUsername_(input.username);
  const password = String(input.password || '');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const account = getAccount_(username);
    if (!account || account.active === false) {
      Utilities.sleep(350);
      throw appError_('INVALID_CREDENTIALS', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    const lockUntil = account.lockUntil ? new Date(account.lockUntil).getTime() : 0;
    if (lockUntil > Date.now()) throw appError_('ACCOUNT_LOCKED', 'บัญชีถูกล็อกชั่วคราว กรุณาลองใหม่ภายหลัง');
    if (!constantTimeEqual_(passwordHash_(password, account.passwordSalt), account.passwordHash)) {
      account.failedAttempts = Number(account.failedAttempts || 0) + 1;
      if (account.failedAttempts >= DPD.auth.maxFailures) {
        account.failedAttempts = 0;
        account.lockUntil = new Date(Date.now() + DPD.auth.lockMinutes * 60000).toISOString();
      }
      saveAccount_(account);
      Utilities.sleep(350);
      throw appError_('INVALID_CREDENTIALS', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    account.failedAttempts = 0;
    account.lockUntil = '';
    account.lastLoginAt = new Date().toISOString();
    saveAccount_(account);
    return createSession_(account);
  } finally {
    lock.releaseLock();
  }
}

function changePassword_(input) {
  const actor = authenticateSession_(input.sessionToken, true);
  const currentPassword = String(input.currentPassword || '');
  const newPassword = String(input.newPassword || '');
  validateNewPassword_(newPassword);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const account = requireAccount_(actor.username);
    if (!constantTimeEqual_(passwordHash_(currentPassword, account.passwordSalt), account.passwordHash)) {
      throw appError_('INVALID_CREDENTIALS', 'รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }
    if (constantTimeEqual_(passwordHash_(newPassword, account.passwordSalt), account.passwordHash)) {
      throw appError_('PASSWORD_REUSED', 'รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม');
    }
    const salt = randomSecret_();
    account.passwordSalt = salt;
    account.passwordHash = passwordHash_(newPassword, salt);
    account.mustChangePassword = false;
    account.passwordVersion = Number(account.passwordVersion || 0) + 1;
    saveAccount_(account);
    revokeSession_(input.sessionToken);
    return createSession_(account);
  } finally {
    lock.releaseLock();
  }
}

function createSession_(account) {
  const token = randomSecret_();
  const session = {
    username: account.username, role: account.role, displayName: account.displayName,
    passwordVersion: Number(account.passwordVersion || 0), csrfToken: randomSecret_(),
    expiresAt: Date.now() + DPD.auth.sessionSeconds * 1000
  };
  CacheService.getScriptCache().put(sessionCacheKey_(token), JSON.stringify(session), DPD.auth.sessionSeconds);
  return { ok: true, sessionToken: token, csrfToken: session.csrfToken, profile: publicActor_(session), requiresPasswordChange: account.mustChangePassword === true };
}

function authenticateSession_(token, allowPasswordChange) {
  const value = token ? CacheService.getScriptCache().get(sessionCacheKey_(token)) : '';
  if (!value) throw appError_('SESSION_EXPIRED', 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  let session;
  try { session = JSON.parse(value); } catch (err) { throw appError_('SESSION_EXPIRED', 'เซสชันไม่ถูกต้อง'); }
  if (Number(session.expiresAt || 0) <= Date.now()) throw appError_('SESSION_EXPIRED', 'เซสชันหมดอายุ');
  const account = requireAccount_(session.username);
  if (account.active === false || Number(account.passwordVersion || 0) !== Number(session.passwordVersion || 0)) {
    throw appError_('SESSION_REVOKED', 'เซสชันถูกยกเลิก กรุณาเข้าสู่ระบบใหม่');
  }
  if (account.mustChangePassword === true && !allowPasswordChange) throw appError_('PASSWORD_CHANGE_REQUIRED', 'กรุณาเปลี่ยนรหัสผ่านก่อนใช้งาน');
  return { username: account.username, email: account.username, role: account.role, displayName: account.displayName, csrfToken: session.csrfToken, passwordVersion: account.passwordVersion };
}

function revokeSession_(token) {
  if (token) CacheService.getScriptCache().remove(sessionCacheKey_(token));
}

function sessionCacheKey_(token) {
  return 'dpd_session_' + digestText_(String(token || '')).slice(0, 40);
}

function verifyCsrf_(token, expected) {
  if (!expected || !token || String(token) !== String(expected)) throw appError_('INVALID_CSRF', 'Session token is missing or expired.');
}

function database_() {
  const id = String(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '').trim();
  if (!id) throw appError_('NOT_CONFIGURED', 'SPREADSHEET_ID is not configured.');
  return SpreadsheetApp.openById(id);
}

function sheetName_(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  else {
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join('|') !== headers.join('|')) throw new Error('Unexpected headers in sheet ' + name);
  }
  sheet.setFrozenRows(1);
  return sheet;
}

function findUserRow_(sheet, email) {
  if (!sheet || sheet.getLastRow() < 2) return -1;
  const finder = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(email).matchEntireCell(true).findNext();
  return finder ? finder.getRow() : -1;
}

function accountSheet_() {
  const sheet = database_().getSheetByName(sheetName_('accounts'));
  if (!sheet) throw appError_('NOT_CONFIGURED', 'Accounts sheet is missing. Run setupDatabase first.');
  return sheet;
}

function findAccountRow_(sheet, username) {
  if (!sheet || sheet.getLastRow() < 2) return -1;
  const finder = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(username).matchEntireCell(true).findNext();
  return finder ? finder.getRow() : -1;
}

function getAccount_(username) {
  const sheet = accountSheet_();
  const rowIndex = findAccountRow_(sheet, username);
  if (rowIndex < 2) return null;
  const row = sheet.getRange(rowIndex, 1, 1, DPD.sheets.accounts.length).getValues()[0];
  return {
    _row: rowIndex, username: String(row[0] || ''), role: String(row[1] || ''), displayName: String(row[2] || ''),
    active: row[3] !== false && String(row[3]).toLowerCase() !== 'false', updatedAt: String(row[4] || ''),
    passwordHash: String(row[5] || ''), passwordSalt: String(row[6] || ''),
    mustChangePassword: row[7] === true || String(row[7]).toLowerCase() === 'true',
    failedAttempts: Number(row[8] || 0), lockUntil: String(row[9] || ''), passwordVersion: Number(row[10] || 0), lastLoginAt: String(row[11] || '')
  };
}

function requireAccount_(username) {
  const account = getAccount_(username);
  if (!account || DPD.roles.indexOf(account.role) < 0) throw appError_('SESSION_REVOKED', 'บัญชีไม่พร้อมใช้งาน');
  return account;
}

function saveAccount_(account) {
  const sheet = accountSheet_();
  const username = normalizeUsername_(account.username);
  const rowIndex = account._row || findAccountRow_(sheet, username);
  const row = [
    safeCell_(username), safeCell_(account.role), safeCell_(account.displayName || username), account.active !== false,
    new Date().toISOString(), safeCell_(account.passwordHash), safeCell_(account.passwordSalt), account.mustChangePassword === true,
    Number(account.failedAttempts || 0), safeCell_(account.lockUntil || ''), Number(account.passwordVersion || 0), safeCell_(account.lastLoginAt || '')
  ];
  if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  return getAccount_(username);
}

function listPublicAccounts_() {
  const sheet = accountSheet_();
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, DPD.sheets.accounts.length).getValues().map(function(row) {
    return {
      username: String(row[0] || ''), role: String(row[1] || ''), displayName: String(row[2] || ''),
      active: row[3] !== false && String(row[3]).toLowerCase() !== 'false', updatedAt: String(row[4] || ''),
      mustChangePassword: row[7] === true || String(row[7]).toLowerCase() === 'true', lastLoginAt: String(row[11] || '')
    };
  });
}

function normalizeUsername_(value) {
  const username = String(value || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw appError_('INVALID_USERNAME', 'ชื่อผู้ใช้ต้องมี 3–40 ตัว และใช้ a-z, 0-9, จุด, ขีดล่าง หรือขีดกลาง');
  return username;
}

function validateInitialPassword_(password) {
  if (String(password || '').length < 5 || String(password).length > 128) {
    throw appError_('WEAK_PASSWORD', 'รหัสเริ่มต้นต้องมีอย่างน้อย 5 ตัว');
  }
}

function validateNewPassword_(password) {
  const value = String(password || '');
  if (value.length < DPD.auth.minNewPassword || value.length > 128 || !/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    throw appError_('WEAK_PASSWORD', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 10 ตัว และมีทั้งตัวอักษรกับตัวเลข');
  }
}

function ensureAuthPepper_() {
  const props = PropertiesService.getScriptProperties();
  let pepper = String(props.getProperty('AUTH_PEPPER') || '');
  if (!pepper) {
    pepper = randomSecret_();
    props.setProperty('AUTH_PEPPER', pepper);
  }
  return pepper;
}

function passwordHash_(password, salt) {
  const bytes = Utilities.computeHmacSha256Signature(String(password) + '\u0000' + String(salt), ensureAuthPepper_(), Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(bytes);
}

function digestText_(value) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8));
}

function randomSecret_() {
  return Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid();
}

function constantTimeEqual_(left, right) {
  const a = String(left || ''), b = String(right || '');
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i += 1) diff |= (a.charCodeAt(i % Math.max(a.length, 1)) || 0) ^ (b.charCodeAt(i % Math.max(b.length, 1)) || 0);
  return diff === 0;
}

function listEntities_(key) {
  const sheet = database_().getSheetByName(sheetName_(key));
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, DPD.sheets[key].length).getValues().map(function(row) {
    let data;
    try { data = JSON.parse(String(row[8] || '{}')); } catch (err) { data = {}; }
    data.version = Number(row[7] || data.version || 0);
    data.updatedAt = String(row[6] || data.updatedAt || '');
    return data;
  });
}

function getEntity_(key, id) {
  const sheet = database_().getSheetByName(sheetName_(key));
  const found = findEntityRow_(sheet, id);
  if (!found) return null;
  let data;
  try { data = JSON.parse(String(found.values[8] || '{}')); } catch (err) { throw appError_('CORRUPT_DATA', 'Stored entity is invalid.'); }
  data.version = Number(found.values[7] || data.version || 0);
  data.updatedAt = String(found.values[6] || data.updatedAt || '');
  data._row = found.row;
  return data;
}

function requireEntity_(key, id) {
  const entity = getEntity_(key, id);
  if (!entity) throw appError_('NOT_FOUND', key + ' entity was not found.');
  return entity;
}

function saveEntity_(key, entity, expectedVersion) {
  const sheet = database_().getSheetByName(sheetName_(key));
  const id = cleanRequired_(entity.id || entity.code, 100, 'Entity id');
  const found = findEntityRow_(sheet, id);
  const currentVersion = found ? Number(found.values[7] || 0) : 0;
  if (expectedVersion !== undefined && expectedVersion !== null && Number(expectedVersion) !== currentVersion) {
    throw appError_('VERSION_CONFLICT', 'Data changed on another device. Reload and try again.');
  }
  const copy = JSON.parse(JSON.stringify(entity));
  delete copy._row;
  copy.id = id;
  copy.version = currentVersion + 1;
  copy.updatedAt = new Date().toISOString();
  const row = [
    safeCell_(id), safeCell_(copy.requestNo || copy.code || copy.name || id),
    safeCell_(copy.type || ''), safeCell_(copy.status || ''), safeCell_(copy.code || ''),
    safeCell_(copy.requestId || ''), copy.updatedAt, copy.version, JSON.stringify(copy)
  ];
  if (row[8].length > 45000) throw appError_('ENTITY_TOO_LARGE', 'Entity data is too large.');
  if (found) sheet.getRange(found.row, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  return copy;
}

function deleteEntity_(key, id, expectedVersion) {
  const sheet = database_().getSheetByName(sheetName_(key));
  const found = findEntityRow_(sheet, id);
  if (!found) throw appError_('NOT_FOUND', 'Entity was not found.');
  const currentVersion = Number(found.values[7] || 0);
  if (expectedVersion !== undefined && expectedVersion !== null && Number(expectedVersion) !== currentVersion) {
    throw appError_('VERSION_CONFLICT', 'Data changed on another device.');
  }
  sheet.deleteRow(found.row);
}

function findEntityRow_(sheet, id) {
  if (!sheet || sheet.getLastRow() < 2) return null;
  const finder = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  if (!finder) return null;
  const row = finder.getRow();
  return { row: row, values: sheet.getRange(row, 1, 1, 9).getValues()[0] };
}

function checkVersion_(entity, expectedVersion) {
  if (expectedVersion !== undefined && expectedVersion !== null && Number(expectedVersion) !== Number(entity.version || 0)) {
    throw appError_('VERSION_CONFLICT', 'Data changed on another device. Reload and try again.');
  }
}

function nextDocumentNo_(prefix, sheetKey, fieldName) {
  const year = new Date().getFullYear() + 543;
  const base = prefix + '-' + year + '-';
  let max = 0;
  listEntities_(sheetKey).forEach(function(entity) {
    const value = String(entity[fieldName] || '');
    if (value.indexOf(base) === 0) {
      const number = Number(value.slice(base.length));
      if (Number.isInteger(number)) max = Math.max(max, number);
    }
  });
  return base + String(max + 1).padStart(4, '0');
}

function entityResult_(type, entity) {
  return { entityType: type, entityId: entity.id, version: entity.version, documentNo: entity.requestNo || '', entity: entity };
}

function findIdempotent_(requestId, email) {
  const sheet = database_().getSheetByName(sheetName_('idempotency'));
  if (!sheet || sheet.getLastRow() < 2) return null;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  for (let i = values.length - 1; i >= 0; i -= 1) {
    if (String(values[i][0]) === requestId && String(values[i][2]).toLowerCase() === email) {
      try { return JSON.parse(String(values[i][4])); } catch (err) { return null; }
    }
  }
  return null;
}

function writeIdempotent_(requestId, actor, action, response) {
  database_().getSheetByName(sheetName_('idempotency')).appendRow([
    safeCell_(requestId), new Date().toISOString(), safeCell_(actor.email), safeCell_(action), JSON.stringify(response)
  ]);
}

function writeAudit_(actor, action, entityType, entityId, requestId, details) {
  database_().getSheetByName(sheetName_('audit')).appendRow([
    Utilities.getUuid(), new Date().toISOString(), safeCell_(actor.email), safeCell_(actor.role),
    safeCell_(action), safeCell_(entityType), safeCell_(entityId), safeCell_(requestId),
    JSON.stringify(details || {}).slice(0, 45000)
  ]);
}

function respond_(work) {
  try {
    return json_(work());
  } catch (err) {
    const code = err && err.appCode ? err.appCode : 'INTERNAL_ERROR';
    const message = code === 'INTERNAL_ERROR' ? 'Unexpected server error.' : String(err.message || err);
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: { code: code, message: message } });
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function appError_(code, message) {
  const err = new Error(message);
  err.appCode = code;
  return err;
}

function cleanRequired_(value, max, label) {
  const text = cleanText_(value, max).trim();
  if (!text) throw appError_('VALIDATION_ERROR', label + ' is required.');
  return text;
}

function cleanText_(value, max) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, max || DPD.maxText);
}

function int_(value, min, max, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw appError_('VALIDATION_ERROR', label + ' must be an integer from ' + min + ' to ' + max + '.');
  }
  return number;
}

function safeCell_(value) {
  const text = cleanText_(value, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

