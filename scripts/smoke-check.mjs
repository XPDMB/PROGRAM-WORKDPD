import fs from 'node:fs';

const app = fs.readFileSync('js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const checks = [
  ['JavaScript parses', () => { new Function(app); }],
  ['Demo banner exists', () => {
    if (!html.includes('DEMO MODE — ข้อมูลสาธิตเท่านั้น')) throw new Error('Missing demo banner');
  }],
  ['Production Apps Script is absent', () => {
    if (app.includes('script.google.com/macros')) throw new Error('Production cloud endpoint found');
  }],
  ['Storage is demo namespaced', () => {
    if (/dpd_(?!demo_)/.test(app)) throw new Error('Non-demo storage namespace found');
  }],
  ['Demo reset exists', () => {
    if (!app.includes('function resetDemoData()')) throw new Error('Missing demo reset');
  }],
  ['Backup validation is enforced', () => {
    if (!app.includes('validateBackupData(JSON.parse')) throw new Error('Backup validation is not used');
  }],
  ['Complete requisition lifecycle exists', () => {
    const markers = [
      'window.approveIssue',
      'window.rejectIssue',
      'window.cancelIssue',
      'window.dispenseIssue',
      'window.returnIssue',
      'window.closeIssueRecord',
      "generateDocumentNumber('REQ', 'requestNo')",
      "generateDocumentNumber('ISS', 'issueNo')",
      "generateDocumentNumber('RET', 'returnNo')",
      "type: 'คืน'"
    ];
    for (const marker of markers) {
      if (!app.includes(marker)) throw new Error('Missing requisition marker: ' + marker);
    }

    const approval = app.slice(app.indexOf('window.approveIssue'), app.indexOf('window.rejectIssue'));
    if (approval.includes('product.qty -=')) throw new Error('Approval must not deduct stock');

    const dispense = app.slice(app.indexOf('window.dispenseIssue'), app.indexOf('window.returnIssue'));
    if (!dispense.includes('product.qty -= quantity')) throw new Error('Dispense must deduct the entered quantity');

    const itemReturn = app.slice(app.indexOf('window.returnIssue'), app.indexOf('window.closeIssueRecord'));
    if (!itemReturn.includes('product.qty += quantity')) throw new Error('Return must restore the entered quantity');

    const partialMarkers = [
      'function askQuantity',
      'function appendRequestEvent',
      'function requestProgress',
      'approvedQty',
      'dispensedQty',
      'returnedQty',
      'closedQty',
      'activityLog',
      'remainingQty'
    ];
    for (const marker of partialMarkers) {
      if (!app.includes(marker)) throw new Error('Missing partial transaction marker: ' + marker);
    }

    if (!html.includes('<option value="ขอเบิก">') || !html.includes('<option value="คืน">')) {
      throw new Error('Missing requisition history filters');
    }
  }],
  ['Role-aware dashboard work queue exists', () => {
    const appMarkers = [
      'function getVisibleRequestsForQueue',
      'function renderWorkQueue',
      'window.openWorkQueue',
      "statusFilter",
      "if (document.body.classList.contains('role-viewer'))"
    ];
    for (const marker of appMarkers) {
      if (!app.includes(marker)) throw new Error('Missing work queue marker: ' + marker);
    }
    if (!html.includes('id="workQueueSummary"') || !html.includes('id="workQueueRecent"')) {
      throw new Error('Missing dashboard work queue containers');
    }
    if (!html.includes('id="histStatusFilter"')) throw new Error('Missing history status filter');
  }],
  ['Physical stocktake is complete', () => {
    const required = [
      'function openStocktakeModal',
      'function updateStocktakeDifference',
      'function saveStocktake',
      "type: 'ตรวจนับ'",
      'beforeQty',
      'actualQty',
      'difference'
    ];
    for (const marker of required) {
      if (!app.includes(marker)) throw new Error('Missing stocktake marker: ' + marker);
    }
    if (!html.includes('id="stocktakeModal"')) throw new Error('Missing stocktake modal');
  }],
  ['No real-looking Thai phone number is embedded', () => {
    const numbers = app.match(/0\d{2}-\d{7}/g) || [];
    const realLooking = numbers.filter(number => number !== '000-0000000');
    if (realLooking.length) throw new Error('Real-looking phone number found');
  }]
];

for (const [name, check] of checks) {
  check();
  console.log('PASS:', name);
}
