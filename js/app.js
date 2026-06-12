// Authentic user database
    const USERS = {
      admin: '36335',
      dpd: '36335',
      stock: '36335'
    };
    
    let currentUser = '';
    let products = [];
    let history = [];
    let PERSONNEL = [];

    // --- i18n Translation Dictionary ---
    const i18n = {
      "ภาพรวม": "Overview",
      "สต็อกสินค้า": "Stock",
      "ประวัติการเบิก-รับ": "History",
      "รายชื่อบุคลากร": "Personnel",
      "ผู้ดูแลระบบ": "Administrator",
      "ออกจากระบบ": "Logout",
      "ภาพรวมสต็อกวันนี้": "Stock Overview Today",
      "แสดงข้อมูลเชิงสรุปและการแจ้งเตือนของสินค้าคงเหลือในระบบ": "Summary and alerts of remaining stock in the system",
      "สินค้าใกล้หมดสต็อก (ต่ำกว่าจุดสั่งซื้อขั้นต่ำ / Min Stock)": "Low Stock Items (Below Min Stock)",
      "รหัสสินค้า": "Product Code",
      "ชื่อ": "Name",
      "คงเหลือ": "Remaining",
      "ขั้นต่ำ": "Min",
      "รายการสต็อกสินค้า": "Stock List",
      "ค้นหา จัดการ และลงทะเบียนพัสดุในคลังสินค้า": "Search, manage, and register items in warehouse",
      "เพิ่มสินค้าใหม่": "Add New Product",
      "รับสินค้าเข้า": "Receive Stock",
      "เบิกสินค้าออก": "Issue Stock",
      "ประวัติการเคลื่อนไหวสต็อก": "Stock Movement History",
      "แสดงรายการประวัติรับเข้า เบิกจ่าย และการลงทะเบียนสินค้าทั้งหมดในระบบ": "History of receiving, issuing, and registration",
      "ประเภทกิจกรรม:": "Activity Type:",
      "ทั้งหมด": "All",
      "รับ": "Receive",
      "เบิก": "Issue",
      "เพิ่ม": "Add",
      "แก้ไข": "Edit",
      "ปรับปรุง": "Update",
      "ลบ": "Delete",
      "รับเข้า": "Received",
      "เบิกออก": "Issued",
      "รายชื่อบุคลากร (ผู้เบิกพัสดุ)": "Personnel List (Borrowers)",
      "รายชื่อข้าราชการและเจ้าหน้าที่ เรียงลำดับตามชั้นยศและตำแหน่งในการเบิกจ่ายพัสดุ": "List of officials and staff ordered by rank and position",
      "ค้นหาด้วยชื่อ หรือ ตำแหน่ง...": "Search by name or position...",
      "ค้นหาด้วยรหัสสินค้า หรือ ชื่อสินค้า...": "Search by code or name...",
      "เพิ่มบุคลากรใหม่": "Add New Personnel",
      "ยศ-ชื่อ-สกุล": "Rank-Name-Surname",
      "ตำแหน่ง": "Position",
      "เบอร์ติดต่อ": "Phone Number",
      "จัดการ": "Action",
      "ลงทะเบียนเพิ่มสินค้าใหม่": "Register New Product",
      "หมวดหมู่สินค้า": "Category",
      "อุปกรณ์สำนักงาน": "Office Supplies",
      "วัสดุสิ้นเปลือง": "Consumables",
      "อะไหล่": "Spare Parts",
      "อื่นๆ": "Others",
      "ชื่อสินค้า": "Product Name",
      "จำนวนสินค้า": "Quantity",
      "หน่วยนับ": "Unit",
      "ตำแหน่งจัดเก็บ (Location)": "Storage Location",
      "ยกเลิก": "Cancel",
      "บันทึกข้อมูลสินค้า": "Save Product Info",
      "แก้ไขข้อมูลสินค้า": "Edit Product",
      "บันทึกการแก้ไข": "Save Changes",
      "บันทึกรับสินค้าเข้าคลัง": "Receive Product to Stock",
      "เลือกสินค้า": "Select Product",
      "จำนวนรับเข้า": "Quantity to Receive",
      "เลขครุภัณฑ์ / Serial Number": "Asset / Serial Number",
      "วันหมดอายุสินค้า (ถ้ามี)": "Exp. Date (if any)",
      "รายละเอียด / หมายเหตุ": "Details / Note",
      "บันทึกรับสินค้า": "Save Received",
      "บันทึกเบิกพัสดุออกจากสต็อก": "Issue Product from Stock",
      "เลือกสินค้าที่ต้องการเบิก": "Select Product to Issue",
      "จำนวนที่ต้องการเบิก": "Quantity to Issue",
      "ชื่อผู้เบิก / ผู้รับมอบพัสดุ": "Borrower / Receiver Name",
      "วัตถุประสงค์การใช้งาน": "Purpose of Use",
      "ใช้งานในออฟฟิศ": "Office Use",
      "ส่งมอบลูกค้า": "Deliver to Customer",
      "งานซ่อมบำรุง": "Maintenance Work",
      "ทดสอบระบบ": "System Testing",
      "บันทึกเบิกสินค้า": "Save Issued",
      "ลงทะเบียนเพิ่มบุคลากร": "Register New Personnel",
      "ยศ - ชื่อ - นามสกุล": "Rank - Name - Surname",
      "บันทึกข้อมูล": "Save Data",
      "รหัสสินค้า (แก้ไขไม่ได้)": "Product Code (Read-only)",
      "-- กรุณาเลือกสินค้า --": "-- Select Product --",
      "-- กรุณาเลือกผู้เบิก --": "-- Select Borrower --",
      "-- กรุณาเลือกวัตถุประสงค์ --": "-- Select Purpose --",
      "รายการทั้งหมด": "All Items",
      "สินค้าใกล้หมด": "Low Stock",
      "สต็อกรวม": "Total Stock",
      "รายการวันนี้": "Today's Activity",
      "ผู้ใช้: ": "User: ",
      "จำนวน": "Quantity",
      "หน่วย": "Unit",
      "วันที่ทำรายการ": "Transaction Date",
      "ประเภท": "Type",
      "ผู้ดำเนินการ/ผู้เบิก": "Operator/Borrower",
      "บันทึกช่วยจำ/วัตถุประสงค์": "Note/Purpose",
      "ใบเบิก": "Slip",
      "ปกติทุกรายการ": "All Items Normal",
      "รายการ": "Items",
      "ชิ้น": "Pcs",
      "ยังไม่มีรายการประวัติความเคลื่อนไหวในระบบ": "No movement history in the system yet",
      "ไม่พบรายชื่อบุคลากรที่ตรงกับการค้นหา": "No personnel found matching the search",
      "ไม่ระบุชื่อ": "Unnamed",
      "แก้ไขข้อมูล": "Edit Data",
      "ลบรายชื่อ": "Delete Name",
      "พิมพ์ใบเบิก": "Print Slip",
      "📊 ภาพรวม": "📊 Overview",
      "📦 สต็อกสินค้า": "📦 Stock",
      "📜 ประวัติการเบิก-รับ": "📜 History",
      "👥 รายชื่อบุคลากร": "👥 Personnel",
      "📋 รายงานราชการ": "📋 Gov Reports",
      "รายงานสรุปพัสดุราชการ": "Gov Requisition & Stock Report",
      "จัดทำรายงานความเคลื่อนไหวและพัสดุคงเหลือเพื่อเสนอผู้บังคับบัญชา": "Generate reports of movement and stock balance for commanders",
      "ประเภทรายงาน": "Report Type",
      "รายงานสรุปรายเดือน": "Monthly Summary Report",
      "รายงานสรุปรายปีงบประมาณ": "Fiscal Year Summary Report",
      "เลือกเดือน": "Select Month",
      "เลือกปี ค.ศ. (Calendar Year)": "Select Calendar Year",
      "เลือกปีงบประมาณ (Fiscal Year B.E.)": "Select Fiscal Year (B.E.)",
      "พิมพ์รายงาน (Print PDF)": "Print Report (PDF)",
      "ส่งออก Excel (CSV)": "Export Excel (CSV)",
      "ชื่อพัสดุ": "Item Name",
      "หมวดหมู่": "Category",
      "สถานที่เก็บ": "Location",
      "จำนวนที่รับเข้า": "Received Qty",
      "จำนวนที่เบิกออก": "Issued Qty",
      "คงเหลือปัจจุบัน": "Current Qty",
      "ปีงบประมาณ:": "Fiscal Year:",
      "ปีงบประมาณ": "Fiscal Year",
      "ล้างประวัติทั้งหมด": "Clear All History",
      "คุณแน่ใจหรือไม่ที่จะล้างข้อมูลประวัติความเคลื่อนไหวทั้งหมด?\n*การกระทำนี้จะลบข้อมูลประวัติทั้งหมดอย่างถาวรและไม่สามารถกู้คืนได้*": "Are you sure you want to clear all movement history?\n*This action will permanently delete all history logs and cannot be undone.*",
      "ล้างข้อมูลประวัติสำเร็จ": "History cleared successfully",
      "จำนวนพัสดุที่เบิก": "Quantity Issued",
      "ไม่มีข้อมูลการเบิก": "No Requisitions"
    };

    let currentLang = 'th';

    function walkDOM(node) {
      if (node.nodeType === 3) {
        let text = node.textContent.trim();
        if (text) {
          if (!node._originalText) node._originalText = node.textContent;
          let key = node._originalText.trim();
          if (i18n[key]) {
            let prefix = node._originalText.substring(0, node._originalText.indexOf(key));
            let suffix = node._originalText.substring(node._originalText.indexOf(key) + key.length);
            node.textContent = prefix + (currentLang === 'en' ? i18n[key] : key) + suffix;
          }
        }
      } else if (node.nodeType === 1) {
        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
        if (node.hasAttribute('placeholder')) {
          if (!node._originalPlaceholder) node._originalPlaceholder = node.getAttribute('placeholder');
          let key = node._originalPlaceholder;
          if (i18n[key]) {
            node.setAttribute('placeholder', currentLang === 'en' ? i18n[key] : key);
          }
        }
        Array.from(node.childNodes).forEach(walkDOM);
      }
    }

    function setLang(lang) {
      currentLang = lang;
      
      // Update buttons
      document.querySelectorAll('.btn-lang').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`.btn-lang[onclick="setLang('${lang}')"]`);
      if (activeBtn) activeBtn.classList.add('active');

      // Update static UI
      walkDOM(document.body);
      
      // Update dynamic UI
      renderDashboard();
      renderStock();
      renderHistory();
      renderPersonnel();
      if (typeof renderReport === 'function') renderReport();
      updateClock();
    }

    function t(text) {
      return (currentLang === 'en' && i18n[text]) ? i18n[text] : text;
    }

    // --- Real-time Clock ---
    function updateClock() {
      const now = new Date();
      const optionsTH = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const optionsEN = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const locale = currentLang === 'th' ? 'th-TH' : 'en-GB';
      const timeStr = now.toLocaleDateString(locale, currentLang === 'th' ? optionsTH : optionsEN);
      
      const clockSpan = document.querySelector('#realtimeClock span');
      if(clockSpan) clockSpan.textContent = timeStr;
    }
    setInterval(updateClock, 1000);

    // Personnel list defaults
    const DEFAULT_PERSONNEL = [
      {name: 'น.อ.บุญทวี ช่วยเนียม', position: 'หก.กกม.บก.ซอ.', phone: '081-9129091'},
      {name: 'น.ท.หญิง รวีวรรณ กิตติศักดิ์กุล', position: 'รอง หก.กกม.บก.ขอ.', phone: '094-5481842'},
      {name: 'ร.อ.นที กล้าแข็ง', position: 'นปก.ฝปก.กกม.บก.ขอ.', phone: '064-8320092'},
      {name: 'ร.ท.ธนรัตน์ อดิศัยสกุลชัย', position: 'นวพ.ผวพ.กกม.บก.ขอ.', phone: '094-7565591'},
      {name: 'ร.ต.จิรภัทร จำปางาม', position: 'น.โปรแกรม ผวพ.กกม.บก.ซอ.', phone: '095-5251415'},
      {name: 'พ.อ.อ.สุภัค อัมพิลาศัย', position: 'จนท.พัสดุอาวุโสฯ ช่วยราชการ กกม.บก.ซอ.', phone: '062-4248596'},
      {name: 'พ.อ.ท.ชนินทร์ พรมฤทธิ์', position: 'จนท.ทดสอบ ผวพ.กกม.บก.ซอ.', phone: '099-7359773'},
      {name: 'จ.อ.ณธัชพงศ์ ภู่ขันเงิน', position: 'จนท.ข้อมูล ฝบม.กกม.บก.ขอ.', phone: '062-3902690'},
      {name: 'จ.ท.ภูมิดล บุโรดม', position: 'จนท.ข้อมูล ฝบม.กกม.บก.ขอ.', phone: '094-1135337'},
      {name: 'จ.ต.ภัทร พายุหะ', position: 'จนท.ปฏิบัติการ ผปก.กกม.บก.ขอ.', phone: '098-0167567'},
      {name: 'นางพัสวีพิชญ์ หีบจินดา', position: 'พนักงานรวบรวมและเตรียมข้อมูล', phone: '095-6041354'},
      {name: 'นายภูรินทร์ อินทร์บุญช่วย', position: 'ช่างโครงสร้างฯ ช่วยราชการ กกม.บก.ซอ.', phone: '095-4048230'}
    ];

    const fallbackProducts = [
      {code:'DPD-001',name:'กระดาษ A4',cat:'วัสดุสิ้นเปลือง',qty:150,min:50,unit:'รีม',loc:'A1-01'},
      {code:'DPD-002',name:'หมึกพิมพ์ดำ HP',cat:'วัสดุสิ้นเปลือง',qty:12,min:20,unit:'ตลับ',loc:'A1-02'},
      {code:'DPD-003',name:'แบตเตอรี่ AA',cat:'อะไหล่',qty:80,min:30,unit:'ก้อน',loc:'B2-01'},
      {code:'DPD-004',name:'สายไฟ USB-C',cat:'อุปกรณ์สำนักงาน',qty:5,min:10,unit:'เส้น',loc:'B2-03'},
      {code:'DPD-005',name:'กล่องพัสดุ M',cat:'วัสดุสิ้นเปลือง',qty:200,min:100,unit:'ใบ',loc:'C3-01'},
    ];

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const fallbackHistory = [
      {date: yesterdayStr,type:'รับ',code:'DPD-001',name:'กระดาษ A4',qty:50,user:'น.อ.บุญทวี ช่วยเนียม',note:'รับเข้าสต็อกแรกเข้า'},
      {date: todayStr,type:'เบิก',code:'DPD-002',name:'หมึกพิมพ์ดำ HP',qty:3,user:'ร.อ.นที กล้าแข็ง',userPosition:'นปก.ฝปก.กกม.บก.ขอ.',note:'ใช้งานในออฟฟิศ แผนกบัญชี'},
    ];

    // Initialization
    window.addEventListener('DOMContentLoaded', () => {
      const loginPassEl = document.getElementById('loginPass');
      if (loginPassEl) {
        loginPassEl.addEventListener('keydown', e => { if(e.key === 'Enter') doLogin() });
      }
      
      loadDatabase();

      currentUser = 'admin';
      document.getElementById('userBadge').textContent = 'admin';
      document.getElementById('userAvatar').textContent = 'A';
      
      populatePersonnelSelect();
      renderPersonnel();
      populateFiscalYears();
      
      setLang('th');

      // Check persisted session login state on page refresh
      const isLoggedIn = localStorage.getItem('dpd_logged_in') === 'true';
      if (isLoggedIn) {
        currentUser = localStorage.getItem('dpd_current_user') || 'admin';
        document.getElementById('userBadge').textContent = currentUser;
        document.getElementById('userAvatar').textContent = currentUser.slice(0, 1).toUpperCase();
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
        
        const activeTab = localStorage.getItem('dpd_active_tab') || 'dashboard';
        showTab(activeTab);
      }
    });

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTZIaVyt-aEuvHO7ckjqJJVhJYNP2vWXb1956nTnI5VCZ7HOu24DSOF4es4ubFbLxH/exec';

    // Loading indicator helpers for Google Sheets sync
    function showSyncLoading(message) {
      let loader = document.getElementById('apiSyncLoader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'apiSyncLoader';
        loader.style = `
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 99999;
          font-family: 'Sarabun', sans-serif;
          color: #f8fafc;
        `;
        loader.innerHTML = `
          <div style="
            border: 4px solid rgba(255,255,255,0.05);
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            width: 44px; height: 44px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          "></div>
          <p id="apiSyncLoaderText" style="font-weight: 500; font-size: 15px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);"></p>
        `;
        document.body.appendChild(loader);
      }
      document.getElementById('apiSyncLoaderText').textContent = message;
      loader.style.display = 'flex';
    }

    function hideSyncLoading() {
      const loader = document.getElementById('apiSyncLoader');
      if (loader) loader.style.display = 'none';
    }

    async function loadDatabase() {
      // 1. Initial local cache load to show UI instantly
      let storedProducts, storedHistory, storedPersonnel;
      try { storedProducts = localStorage.getItem('dpd_products'); } catch (e) {}
      try { storedHistory = localStorage.getItem('dpd_history'); } catch (e) {}
      try { storedPersonnel = localStorage.getItem('dpd_personnel'); } catch (e) {}

      if (storedProducts) {
        try { products = JSON.parse(storedProducts); } catch (e) { products = fallbackProducts; }
      } else { products = fallbackProducts; }

      if (storedHistory) {
        try { history = JSON.parse(storedHistory); } catch (e) { history = fallbackHistory; }
      } else { history = fallbackHistory; }

      if (storedPersonnel) {
        try { PERSONNEL = JSON.parse(storedPersonnel); } catch (e) { PERSONNEL = DEFAULT_PERSONNEL; }
      } else { PERSONNEL = DEFAULT_PERSONNEL; }

      // Re-render views immediately with cached/default data so user can login/interact instantly
      renderDashboard();
      renderStock();
      renderHistory();
      renderPersonnel();
      populateFiscalYears();

      // 2. Fetch fresh data from Google Sheets Cloud Database silently in the background
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          products = data.products.map(p => ({
            code: p.code || '',
            name: p.name || '',
            cat: p.cat || 'อื่นๆ',
            qty: parseInt(p.qty) || 0,
            min: parseInt(p.min) || 0,
            unit: p.unit || 'ชิ้น',
            loc: p.loc || ''
          }));
        }
        if (data.history && Array.isArray(data.history) && data.history.length > 0) {
          history = data.history.map(h => ({
            date: h.date || '',
            type: h.type || 'ปรับปรุง',
            code: h.code || '',
            name: h.name || '',
            qty: parseInt(h.qty) || 0,
            user: h.user || 'system',
            userPosition: h.userPosition || '',
            note: h.note || ''
          }));
        }
        if (data.personnel && Array.isArray(data.personnel) && data.personnel.length > 0) {
          PERSONNEL = data.personnel.map(p => ({
            name: p.name || '',
            position: p.position || '',
            phone: p.phone || ''
          }));
        }

        // Cache loaded data locally
        localStorage.setItem('dpd_products', JSON.stringify(products));
        localStorage.setItem('dpd_history', JSON.stringify(history));
        localStorage.setItem('dpd_personnel', JSON.stringify(PERSONNEL));
      } catch (err) {
        console.error('Cloud Sync failed, using offline fallback cache:', err);
      } finally {
        hideSyncLoading();
        // Re-render UI views with loaded data
        renderDashboard();
        renderStock();
        renderHistory();
        renderPersonnel();
        populateFiscalYears();
      }
    }

    async function saveDatabase() {
      // 1. Instantly save to local cache
      localStorage.setItem('dpd_products', JSON.stringify(products));
      localStorage.setItem('dpd_history', JSON.stringify(history));
      localStorage.setItem('dpd_personnel', JSON.stringify(PERSONNEL));

      // 2. POST updates to Google Sheets in the background with a screen lock overlay
      showSyncLoading('กำลังบันทึกข้อมูลลง Google Sheets...');
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            products: products,
            history: history,
            personnel: PERSONNEL
          })
        });
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Brief pause for UX feel
        showToast('บันทึกข้อมูลลง Google Sheets สำเร็จ', 'success');
      } catch (err) {
        console.error('Failed to sync changes with cloud:', err);
        showToast('บันทึกลงคลาวด์ไม่สำเร็จ (บันทึกลงเครื่องคอมพิวเตอร์แทนแล้ว)', 'danger');
      } finally {
        hideSyncLoading();
      }
    }

    function getRankWeight(name) {
      if (!name) return 0;
      if (name.startsWith('น.อ.')) return 100;
      if (name.startsWith('น.ท.')) return 90;
      if (name.startsWith('ร.อ.')) return 80;
      if (name.startsWith('ร.ท.')) return 70;
      if (name.startsWith('ร.ต.')) return 60;
      if (name.startsWith('พ.อ.อ.')) return 55;
      if (name.startsWith('พ.อ.ท.')) return 50;
      if (name.startsWith('พ.อ.ต.')) return 45;
      if (name.startsWith('จ.อ.')) return 40;
      if (name.startsWith('จ.ท.')) return 35;
      if (name.startsWith('จ.ต.')) return 30;
      return 0;
    }

    function sortPersonnelList() {
      PERSONNEL.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        const wA = getRankWeight(nameA);
        const wB = getRankWeight(nameB);
        if (wB !== wA) return wB - wA;
        return nameA.localeCompare(nameB, 'th');
      });
    }

    function savePersonnelData() {
      sortPersonnelList();
      saveDatabase();
      populatePersonnelSelect();
    }

    function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      
      // Clear any existing toasts to prevent duplicates and stacking
      container.innerHTML = '';
      
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      let icon = type === 'danger' ? 'ti-circle-x' : (type === 'warning' ? 'ti-alert-circle' : 'ti-circle-check');
      toast.innerHTML = `<i class="ti ${icon}"></i><span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 15);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    function doLogin() {
      const p = document.getElementById('loginPass').value;
      const errEl = document.getElementById('loginErr');
      
      if (p === '36335') {
        currentUser = 'admin';
        // Persist session state
        localStorage.setItem('dpd_logged_in', 'true');
        localStorage.setItem('dpd_current_user', 'admin');
        
        errEl.style.display = 'none';
        document.getElementById('userBadge').textContent = 'admin';
        document.getElementById('userAvatar').textContent = 'A';
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
        
        const activeTab = localStorage.getItem('dpd_active_tab') || 'dashboard';
        showTab(activeTab);
        showToast('ยินดีต้อนรับเข้าสู่ระบบ', 'success');
      } else {
        errEl.style.display = 'block';
        showToast('รหัสผ่านไม่ถูกต้อง', 'danger');
      }
    }

    function doLogout() {
      currentUser = '';
      // Clear session state
      localStorage.removeItem('dpd_logged_in');
      localStorage.removeItem('dpd_current_user');
      localStorage.removeItem('dpd_active_tab');
      
      const loginPassEl = document.getElementById('loginPass');
      if (loginPassEl) {
        loginPassEl.value = '';
      }
      document.getElementById('mainApp').classList.remove('active');
      document.getElementById('loginScreen').classList.add('active');
      showToast('ออกจากระบบเรียบร้อย', 'warning');
    }

    function showTab(name, element) {
      localStorage.setItem('dpd_active_tab', name);
      document.querySelectorAll('.nav-link').forEach(lnk => lnk.classList.remove('active'));
      const activeEl = element || document.getElementById('nav-' + name);
      if (activeEl) {
        activeEl.classList.add('active');
      }
      document.querySelectorAll('.view-container').forEach(v => v.style.display = 'none');
      const targetView = document.getElementById('tab-' + name);
      if (targetView) {
        targetView.style.display = 'block';
      }
      if (name === 'dashboard') renderDashboard();
      if (name === 'stock') renderStock();
      if (name === 'history') renderHistory();
      if (name === 'personnel') renderPersonnel();
      if (name === 'reports') renderReport();
    }

    function renderDashboard() {
      const total = products.length;
      const lowList = products.filter(p => p.qty < p.min);
      const totalQty = products.reduce((a, p) => a + p.qty, 0);
      const txToday = history.filter(h => h.date === new Date().toISOString().slice(0, 10)).length;
      document.getElementById('dashCards').innerHTML = [
        {label: t('รายการทั้งหมด'), val: total + ' ' + t('รายการ'), icon: 'ti-boxes', color: 'var(--color-primary)'},
        {label: t('สินค้าใกล้หมด'), val: lowList.length + ' ' + t('รายการ'), icon: 'ti-alert-triangle', color: 'var(--color-warning)'},
        {label: t('สต็อกรวม'), val: totalQty.toLocaleString() + ' ' + t('ชิ้น'), icon: 'ti-stack-2', color: 'var(--color-success)'},
        {label: t('รายการวันนี้'), val: txToday + ' ' + t('รายการ'), icon: 'ti-activity', color: '#6366f1'}
      ].map(c => `<div class="dash-card"><div class="dash-card-icon" style="color: ${c.color}"><i class="ti ${c.icon}"></i></div><div class="dash-card-details"><h3>${c.label}</h3><div class="value">${c.val}</div></div></div>`).join('');
      
      const lowTableEl = document.getElementById('lowStockTable');
      if (lowList.length === 0) {
        lowTableEl.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-muted);">${t('ปกติทุกรายการ')}</div>`;
      } else {
        lowTableEl.innerHTML = `<table><thead><tr><th>${t('รหัสสินค้า')}</th><th>${t('ชื่อ')}</th><th>${t('คงเหลือ')}</th><th>${t('ขั้นต่ำ')}</th></tr></thead><tbody>${lowList.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.qty}</td><td>${p.min}</td></tr>`).join('')}</tbody></table>`;
      }
      
      // Update interactive analytics charts
      renderCharts();
    }

    function renderStock() {
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      const list = products.filter(p => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
      document.getElementById('stockTable').innerHTML = `<table><thead><tr><th>${t('รหัสสินค้า')}</th><th>${t('ชื่อ')}</th><th>${t('จำนวน')}</th><th>${t('หน่วย')}</th><th>${t('จัดการ')}</th></tr></thead><tbody>${list.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.qty}</td><td>${p.unit}</td><td><button class="btn-action btn-action-edit" onclick="openEditModal('${p.code}')"><i class="ti ti-edit"></i></button><button class="btn-action btn-action-delete" onclick="deleteProduct('${p.code}')"><i class="ti ti-trash"></i></button></td></tr>`).join('')}</tbody></table>`;
    }

    function populateSelects() {
      ['recvItem', 'issueItem'].forEach(id => {
        const s = document.getElementById(id);
        if (s) s.innerHTML = '<option value="">-- เลือกสินค้า --</option>' + products.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('');
      });
    }

    function openRecvModal() { 
      document.getElementById('recvItemSearch').value = '';
      document.getElementById('recvItem').value = '';
      if (document.getElementById('clearRecvItemBtn')) document.getElementById('clearRecvItemBtn').style.display = 'none';
      document.getElementById('recvQty').value = '';
      document.getElementById('recvLot').value = '';
      document.getElementById('recvExp').value = '';
      document.getElementById('recvSource').value = '';
      document.getElementById('recvNote').value = '';
      document.getElementById('recvModal').classList.add('open'); 
    }
    function closeRecvModal() { document.getElementById('recvModal').classList.remove('open'); }

    function doReceive() {
      const code = document.getElementById('recvItem').value;
      const qty = parseInt(document.getElementById('recvQty').value);
      const source = document.getElementById('recvSource').value.trim();
      const lot = document.getElementById('recvLot').value.trim();
      const exp = document.getElementById('recvExp').value;
      const note = document.getElementById('recvNote').value.trim();

      const p = products.find(x => x.code === code);
      if (!code) {
        showToast('กรุณาเลือกสินค้า', 'danger');
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        showToast('กรุณาระบุจำนวนรับเข้าให้ถูกต้อง', 'danger');
        return;
      }

      if (p) {
        const oldQty = p.qty;
        p.qty = qty; // เปลี่ยนจาก += เป็นการตรวจสอบ/กำหนดค่าตัวเลขที่นับได้จริงโดยตรง (Stock Check/Audit)
        
        // Formulate a clean description for receipt
        let details = [];
        if (source) details.push(`ที่มา: ${source}`);
        if (lot) details.push(`ครุภัณฑ์/SN: ${lot}`);
        if (exp) details.push(`EXP: ${formatThaiDate(exp)}`);
        if (note) details.push(`หมายเหตุ: ${note}`);
        
        const combinedNote = details.join(' | ') || 'ตรวจสอบ/อัปเดตยอดสินค้าคงคลัง';

        history.unshift({
          date: new Date().toISOString().slice(0, 10), 
          type: 'ปรับปรุง', // เปลี่ยนประเภทจาก 'รับ' เป็น 'ปรับปรุง' เพื่อสะท้อนการตรวจสอบ/ปรับยอดจริง
          code: p.code, 
          name: p.name, 
          qty: qty, // บันทึกยอด ณ ปัจจุบันที่นับได้จริง
          user: currentUser || 'admin', 
          note: `ตรวจสอบยอดสินค้าคงคลัง (ยอดเดิม: ${oldQty} -> ยอดที่ถูกต้อง: ${qty}) ${combinedNote ? `| ${combinedNote}` : ''}`
        });
        
        saveDatabase();
        renderStock();
        closeRecvModal();
        showToast('ตรวจสอบและปรับปรุงยอดสินค้าคงคลังสำเร็จ', 'success');
      }
    }

    function openIssueModal() { 
      document.getElementById('issueItemSearch').value = '';
      document.getElementById('issueItem').value = '';
      if (document.getElementById('clearIssueItemBtn')) document.getElementById('clearIssueItemBtn').style.display = 'none';
      document.getElementById('issueQty').value = '';
      if (document.getElementById('issuePerson')) document.getElementById('issuePerson').value = '';
      if (document.getElementById('clearIssuePersonBtn')) document.getElementById('clearIssuePersonBtn').style.display = 'none';
      if (document.getElementById('issuePurpose')) document.getElementById('issuePurpose').selectedIndex = 0;
      if (document.getElementById('issueNote')) document.getElementById('issueNote').value = '';
      document.getElementById('issueModal').classList.add('open'); 
    }
    function closeIssueModal() { document.getElementById('issueModal').classList.remove('open'); }

    function doIssue() {
      const code = document.getElementById('issueItem').value;
      const qty = parseInt(document.getElementById('issueQty').value);
      const person = document.getElementById('issuePerson').value.trim();
      const purpose = document.getElementById('issuePurpose').value || 'เบิกใช้งาน';
      const note = document.getElementById('issueNote').value.trim();
      const combinedNote = note ? `${purpose} (${note})` : purpose;

      const p = products.find(x => x.code === code);
      if (p && qty > 0 && qty <= p.qty && person) {
        let personName = person;
        let personPosition = '';
        
        // Find position from PERSONNEL dynamically if it matches
        const found = PERSONNEL.find(x => (x.name || '').trim() === personName);
        if (found) {
          personPosition = found.position || '';
        }

        p.qty -= qty;
        history.unshift({
          date: new Date().toISOString().slice(0, 10),
          type: 'เบิก',
          code: p.code,
          name: p.name,
          qty: qty,
          user: personName,
          userPosition: personPosition,
          note: combinedNote
        });
        saveDatabase();
        renderStock();
        closeIssueModal();
        showToast('เบิกสินค้าสำเร็จ');
      } else { showToast('ข้อมูลไม่ถูกต้องหรือสินค้าไม่พอ', 'danger'); }
    }

    function formatUser(userStr, posStr) {
      if (!userStr) return '-';
      const name = userStr;
      const pos = posStr || '';
      if (pos) {
        return `<strong>${name}</strong><br><span style="font-size: 11px; color: var(--color-text-muted);">${pos}</span>`;
      }
      return `<strong>${name}</strong>`;
    }

    function renderHistory() {
      const container = document.getElementById('historyTable');
      if (!container) return;

      const filter = document.getElementById('histFilter').value;
      const fyFilter = document.getElementById('histFiscalFilter') ? document.getElementById('histFiscalFilter').value : '';
      const searchEl = document.getElementById('historySearchInput');
      const searchQ = searchEl ? searchEl.value.trim().toLowerCase() : '';

      let list = history;
      if (filter) {
        list = list.filter(h => h.type === filter);
      }
      if (fyFilter) {
        list = list.filter(h => String(getFiscalYear(h.date)) === String(fyFilter));
      }
      if (searchQ) {
        list = list.filter(h => 
          (h.code || '').toLowerCase().includes(searchQ) ||
          (h.name || '').toLowerCase().includes(searchQ) ||
          (h.user || '').toLowerCase().includes(searchQ) ||
          (h.userPosition || '').toLowerCase().includes(searchQ) ||
          (h.note || '').toLowerCase().includes(searchQ)
        );
      }

      if (list.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 48px; color: var(--color-text-muted);"><i class="ti ti-notes-off" style="font-size: 40px; display: block; margin-bottom: 12px;"></i>${t('ยังไม่มีรายการประวัติความเคลื่อนไหวในระบบ')}</div>`;
        return;
      }

      container.innerHTML = `<table><thead><tr><th>${t('วันที่ทำรายการ')}</th><th>${t('ประเภท')}</th><th>${t('รหัสสินค้า')}</th><th>${t('ชื่อสินค้า')}</th><th style="text-align: right;">${t('จำนวน')}</th><th>${t('ผู้ดำเนินการ/ผู้เบิก')}</th><th>${t('บันทึกช่วยจำ/วัตถุประสงค์')}</th><th style="text-align: center; width: 100px;">${t('ใบเบิก')}</th></tr></thead><tbody>${list.map(h => {
        let badgeClass = 'badge-primary';
        if (h.type === 'รับ') badgeClass = 'badge-success';
        if (h.type === 'เบิก') badgeClass = 'badge-danger';
        if (h.type === 'เพิ่ม') badgeClass = 'badge-primary';
        if (h.type === 'แก้ไข') badgeClass = 'badge-warning';
        if (h.type === 'ปรับปรุง') badgeClass = 'badge-warning';
        if (h.type === 'ลบ') badgeClass = 'badge-danger';

        let printBtn = '';
        if (h.type === 'เบิก') {
          const origIndex = history.indexOf(h);
          printBtn = `<button class="btn-action btn-action-print" onclick="printIssueSlip(${origIndex})" title="${t('พิมพ์ใบเบิก')}"><i class="ti ti-printer"></i></button>`;
        } else {
          printBtn = '<span style="color:var(--color-text-muted); font-size:12px;">-</span>';
        }

        return `<tr><td><i class="ti ti-calendar-event" style="color: var(--color-text-muted);"></i> ${h.date}</td><td><span class="badge ${badgeClass}">${h.type === 'เบิก' ? t('เบิกออก') : (h.type === 'รับ' ? t('รับเข้า') : t(h.type))}</span></td><td><strong>${h.code}</strong></td><td>${h.name}</td><td style="text-align: right; font-weight: 600; ${h.type === 'เบิก' ? 'color: var(--color-danger)' : (h.type === 'รับ' ? 'color: var(--color-success)' : '')}">${h.type === 'เบิก' ? '-' : '+'}${h.qty.toLocaleString()}</td><td>${formatUser(h.user, h.userPosition)}</td><td><span style="font-size: 13px; color: var(--color-text-secondary);">${h.note || '-'}</span></td><td style="text-align: center;">${printBtn}</td></tr>`;
      }).join('')}</tbody></table>`;
    }

    function formatThaiDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const y = parseInt(parts[0]) + 543;
      const m = parseInt(parts[1]);
      const d = parseInt(parts[2]);
      const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      return `${d} ${months[m - 1]} ${y}`;
    }

    function printIssueSlip(index) {
      const h = history[index];
      if (!h) return;
      
      const p = products.find(x => x.code === h.code);
      const unit = p ? p.unit : 'ชิ้น';
      
      const printWindow = window.open('', '_blank', 'width=800,height=700');
      if (!printWindow) return;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>&nbsp;</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
             body {
              font-family: 'Sarabun', sans-serif;
              padding: 40px;
              color: #1e293b;
              background: #ffffff;
              font-size: 15px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px double #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 22px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 6px;
            }
            .subtitle {
              font-size: 14px;
              color: #64748b;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .details-table th, .details-table td {
              padding: 12px 16px;
              border: 1px solid #cbd5e1;
              text-align: left;
            }
            .details-table th {
              background-color: #f8fafc;
              color: #334155;
              font-weight: 600;
              width: 30%;
            }
            .details-table td {
              color: #0f172a;
            }
            .signatures-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              margin-top: 60px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px dotted #94a3b8;
              width: 90%;
              margin: 0 auto 12px auto;
              height: 40px;
            }
            .signature-box p {
              margin: 4px 0;
              font-size: 14px;
            }
            .signature-box .role {
              font-weight: 500;
              color: #475569;
            }
            .signature-box .name {
              font-weight: 600;
              color: #0f172a;
            }
            
            /* Screen view styles (clean loading card behind Chrome print dialog) */
            @media screen {
              body {
                background: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 24px;
              }
              .print-content {
                display: none !important;
              }
              .screen-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
                text-align: center;
                max-width: 450px;
                width: 100%;
                box-sizing: border-box;
              }
              .spinner {
                border: 4px solid #f1f5f9;
                border-top: 4px solid #6366f1;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            }
            
            /* Print view styles */
            @media print {
              .screen-preview {
                display: none !important;
              }
              .print-content {
                display: block !important;
              }
              body {
                padding: 1.6cm 1.5cm 1.5cm 1.5cm;
                margin: 0;
                background: #ffffff;
              }
              @page {
                size: portrait;
                margin: 0; /* Force hide default browser headers and footers */
              }
            }
          </style>
        </head>
        <body>
          <div class="screen-preview">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0; color: #0f172a;">กำลังเรียกใช้หน้าต่างพิมพ์ใบเบิกพัสดุ</p>
            <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">ระบบกำลังเปิดกล่องพิมพ์ของเบราว์เซอร์ หน้าต่างนี้จะปิดตัวเองโดยอัตโนมัติเมื่อพิมพ์เสร็จหรือยกเลิก</p>
          </div>
          
          <div class="print-content">
            <div class="header">
              <div class="title">ใบเบิกจ่ายพัสดุ</div>
              <div class="subtitle">กองกรรมวิธีข้อมูล</div>
            </div>
          
          <table class="details-table">
            <tr>
              <th>รหัสใบเบิก</th>
              <td>TR-${h.date.replace(/-/g, '')}-${String(index + 1).padStart(4, '0')}</td>
            </tr>
            <tr>
              <th>วันที่ทำรายการ</th>
              <td>${formatThaiDate(h.date)}</td>
            </tr>
            <tr>
              <th>รหัสพัสดุ</th>
              <td><strong>${h.code}</strong></td>
            </tr>
            <tr>
              <th>รายการสินค้า/พัสดุ</th>
              <td>${h.name}</td>
            </tr>
            <tr>
              <th>จำนวนที่เบิก</th>
              <td style="font-size: 16px; font-weight: 700; color: #e11d48;">
                ${h.qty.toLocaleString()} ${unit}
              </td>
            </tr>
            <tr>
              <th>ผู้ขอเบิกพัสดุ</th>
              <td><strong>${h.user}</strong> ${h.userPosition ? `(${h.userPosition})` : ''}</td>
            </tr>
            <tr>
              <th>วัตถุประสงค์ / หมายเหตุ</th>
              <td>${h.note || '-'}</td>
            </tr>
          </table>
          
          <div class="signatures-grid">
            <div class="signature-box">
              <p class="role">ผู้ขอเบิกพัสดุ</p>
              <div class="signature-line"></div>
              <p class="name">( ${h.user} )</p>
              <p style="font-size: 13px; color: #64748b;">${h.userPosition ? `ตำแหน่ง ${h.userPosition}` : '&nbsp;'}</p>
              <p>วันที่ ........../........../..........</p>
            </div>
            <div class="signature-box">
              <p class="role">ผู้จ่ายพัสดุ</p>
              <div class="signature-line"></div>
              <p class="name">( พ.อ.อ. สุภัค อัมพิลาศัย )</p>
              <p style="font-size: 13px; color: #64748b;">ตำแหน่ง จนท.พัสดุ กกม.บก.ซอ.</p>
              <p>วันที่ ........../........../..........</p>
            </div>
            <div class="signature-box">
              <p class="role">ผู้อนุมัติพัสดุ</p>
              <div class="signature-line"></div>
              <p class="name">( น.อ. บุญทวี ช่วยเนียม )</p>
              <p style="font-size: 13px; color: #64748b;">ตำแหน่ง หก.กกม.บก.ซอ.</p>
              <p>วันที่ ........../........../..........</p>
            </div>
            </div>
          </div>
          
          <scr` + `ipt>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </scr` + `ipt>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    function generateNextCode() {
      let maxNum = 0;
      products.forEach(p => {
        const match = p.code.match(/^DPD-(\d+)$/i);
        if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
      });
      return 'DPD-' + String(maxNum + 1).padStart(3, '0');
    }

    function openAddModal() {
      document.getElementById('newCode').value = generateNextCode();
      document.getElementById('newName').value = '';
      document.getElementById('newQty').value = 0;
      document.getElementById('newUnit').value = '';
      document.getElementById('newLoc').value = '';
      document.getElementById('newCat').selectedIndex = 0;
      document.getElementById('newExp').value = '';
      document.getElementById('newSource').value = '';
      document.getElementById('newNote').value = '';
      document.getElementById('addModal').classList.add('open');
    }
    function closeAddModal() { document.getElementById('addModal').classList.remove('open'); }

    function addProduct() {
      const code = document.getElementById('newCode').value.trim();
      const name = document.getElementById('newName').value.trim();
      const cat = document.getElementById('newCat').value;
      const qty = parseInt(document.getElementById('newQty').value) || 0;
      const min = Math.max(1, Math.floor(qty * 0.2)) || 10;
      const unit = document.getElementById('newUnit').value.trim() || 'ชิ้น';
      const loc = document.getElementById('newLoc').value.trim();
      const exp = document.getElementById('newExp').value;
      const source = document.getElementById('newSource').value.trim();
      const note = document.getElementById('newNote').value.trim();
      
      const codeEl = document.getElementById('newCode');
      const nameEl = document.getElementById('newName');
      
      codeEl.style.borderColor = '';
      nameEl.style.borderColor = '';
      
      if (!code) {
        codeEl.style.borderColor = 'var(--color-danger)';
        showToast('กรุณาระบุรหัสสินค้า', 'danger');
        return;
      }
      if (!name) {
        nameEl.style.borderColor = 'var(--color-danger)';
        showToast('กรุณาระบุชื่อสินค้า', 'danger');
        return;
      }
      if (products.find(p => p.code.toLowerCase() === code.toLowerCase())) {
        codeEl.style.borderColor = 'var(--color-danger)';
        showToast('รหัสสินค้านี้ซ้ำและถูกใช้งานอยู่ในระบบแล้ว', 'danger');
        return;
      }
      
      products.push({ code, name, cat, qty, min, unit, loc });

      // Build historical combined note
      let details = [];
      if (source) details.push(`ที่มา: ${source}`);
      if (exp) details.push(`EXP: ${formatThaiDate(exp)}`);
      if (note) details.push(`หมายเหตุ: ${note}`);
      const combinedNote = details.join(' | ') || 'จดทะเบียนพัสดุรายการใหม่เข้าสต็อกคลังสินค้า';

      history.unshift({
        date: new Date().toISOString().slice(0, 10),
        type: 'เพิ่ม',
        code,
        name,
        qty,
        user: currentUser || 'admin',
        note: combinedNote
      });
      saveDatabase();
      showToast(`จดทะเบียนสินค้า "${name}" สำเร็จ`, 'success');
      closeAddModal();
      renderStock();
      renderDashboard();
    }

    function openEditModal(code) {
      const p = products.find(x => x.code === code);
      if (!p) return;
      document.getElementById('editCode').value = p.code;
      document.getElementById('editCat').value = p.cat;
      document.getElementById('editName').value = p.name;
      document.getElementById('editQty').value = p.qty;
      document.getElementById('editUnit').value = p.unit;
      document.getElementById('editLoc').value = p.loc || '';
      document.getElementById('editModal').classList.add('open');
    }

    function closeEditModal() { document.getElementById('editModal').classList.remove('open'); }

    function saveEditProduct() {
      const code = document.getElementById('editCode').value;
      const cat = document.getElementById('editCat').value;
      const name = document.getElementById('editName').value.trim();
      const qty = parseInt(document.getElementById('editQty').value) || 0;
      const min = Math.max(1, Math.floor(qty * 0.2)) || 10;
      const unit = document.getElementById('editUnit').value.trim() || 'ชิ้น';
      const loc = document.getElementById('editLoc').value.trim();
      
      const nameEl = document.getElementById('editName');
      nameEl.style.borderColor = '';
      
      if (!name) {
        nameEl.style.borderColor = 'var(--color-danger)';
        showToast('กรุณาระบุชื่อสินค้า', 'danger');
        return;
      }
      
      const p = products.find(x => x.code === code);
      if (!p) return;
      const oldQty = p.qty;
      
      p.cat = cat;
      p.name = name;
      p.qty = qty;
      p.min = min;
      p.unit = unit;
      p.loc = loc;
      
      if (oldQty !== qty) {
        history.unshift({
          date: new Date().toISOString().slice(0, 10),
          type: 'ปรับปรุง',
          code: p.code,
          name: p.name,
          qty: Math.abs(qty - oldQty),
          user: currentUser || 'admin',
          note: `ปรับยอดสต็อกโดยตรง: ${oldQty} -> ${qty} ${unit}`
        });
      } else {
        history.unshift({
          date: new Date().toISOString().slice(0, 10),
          type: 'แก้ไข',
          code: p.code,
          name: p.name,
          qty: 0,
          user: currentUser || 'admin',
          note: 'แก้ไขข้อมูลรายละเอียดสินค้า'
        });
      }
      
      saveDatabase();
      showToast(`ปรับปรุงข้อมูลสินค้า "${name}" สำเร็จ`, 'success');
      closeEditModal();
      renderStock();
      renderDashboard();
    }

    function deleteProduct(code) {
      const p = products.find(x => x.code === code);
      if (!p) return;
      const confirmDelete = confirm(`คุณแน่ใจหรือไม่ที่จะลบสินค้า "${p.name}" (${p.code}) ออกจากระบบ?\n*คำเตือน: ข้อมูลสินค้าชิ้นนี้จะถูกนำออกอย่างถาวร*`);
      if (!confirmDelete) return;
      
      history.unshift({
        date: new Date().toISOString().slice(0, 10),
        type: 'ลบ',
        code: p.code,
        name: p.name,
        qty: p.qty,
        user: currentUser || 'admin',
        note: `ลบสินค้าออกจากระบบ (ยอดคงเหลือเดิม: ${p.qty} ${p.unit})`
      });
      
      products = products.filter(x => x.code !== code);
      saveDatabase();
      showToast(`ลบสินค้า "${p.name}" ออกจากระบบสำเร็จ`, 'success');
      renderStock();
      renderDashboard();
    }

    function populatePersonnelSelect() {
      // Handled dynamically by autocomplete drop list
    }

    function renderPersonnel() {
      const tbody = document.getElementById('personnelTableBody');
      if (!tbody) return;
      
      const searchEl = document.getElementById('searchPersonnelInput');
      const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
      
      const filtered = PERSONNEL.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.position || '').toLowerCase().includes(q)
      );
      
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 48px; color: var(--color-text-muted);"><i class="ti ti-users" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>${t('ไม่พบรายชื่อบุคลากรที่ตรงกับการค้นหา')}</td></tr>`;
        return;
      }
      
      tbody.innerHTML = filtered.map(p => {
        const origIndex = PERSONNEL.indexOf(p);
        const name = p.name || t('ไม่ระบุชื่อ');
        const position = p.position || '';
        const phone = p.phone || '-';
        return `<tr><td><strong>${name}</strong></td><td><span class="badge badge-primary">${position}</span></td><td><i class="ti ti-phone" style="color: var(--color-text-muted); margin-right: 6px;"></i>${phone}</td><td style="text-align: center;"><div style="display: flex; gap: 6px; justify-content: center;"><button class="btn-action btn-action-edit" onclick="openPersonnelModal(${origIndex})" title="${t('แก้ไขข้อมูล')}"><i class="ti ti-edit"></i></button><button class="btn-action btn-action-delete" onclick="deletePersonnel(${origIndex})" title="${t('ลบรายชื่อ')}"><i class="ti ti-trash"></i></button></div></td></tr>`;
      }).join('');
    }

    function openPersonnelModal(index = null) {
      const modal = document.getElementById('personnelModal');
      const titleEl = document.getElementById('personnelModalTitle');
      const indexInput = document.getElementById('personnelIndex');
      const nameInput = document.getElementById('personnelName');
      const posInput = document.getElementById('personnelPosition');
      const phoneInput = document.getElementById('personnelPhone');
      
      nameInput.style.borderColor = '';
      posInput.style.borderColor = '';
      
      if (index !== null && index >= 0) {
        titleEl.textContent = 'แก้ไขข้อมูลบุคลากร';
        indexInput.value = index;
        nameInput.value = PERSONNEL[index].name;
        posInput.value = PERSONNEL[index].position;
        phoneInput.value = PERSONNEL[index].phone || '';
      } else {
        titleEl.textContent = 'ลงทะเบียนเพิ่มบุคลากร';
        indexInput.value = '';
        nameInput.value = '';
        posInput.value = '';
        phoneInput.value = '';
      }
      modal.classList.add('open');
    }

    function closePersonnelModal() { document.getElementById('personnelModal').classList.remove('open'); }

    function savePersonnel() {
      const idxVal = document.getElementById('personnelIndex').value;
      const nameVal = document.getElementById('personnelName').value.trim();
      const posVal = document.getElementById('personnelPosition').value.trim();
      const phoneVal = document.getElementById('personnelPhone').value.trim();
      
      const nameInput = document.getElementById('personnelName');
      const posInput = document.getElementById('personnelPosition');
      
      nameInput.style.borderColor = '';
      posInput.style.borderColor = '';
      
      if (!nameVal) {
        nameInput.style.borderColor = 'var(--color-danger)';
        showToast('กรุณาระบุยศและชื่อ-นามสกุล', 'danger');
        return;
      }
      if (!posVal) {
        posInput.style.borderColor = 'var(--color-danger)';
        showToast('กรุณาระบุตำแหน่ง', 'danger');
        return;
      }

      if (idxVal !== '') {
        const idx = parseInt(idxVal);
        PERSONNEL[idx] = { name: nameVal, position: posVal, phone: phoneVal };
        showToast('แก้ไขข้อมูลบุคลากรสำเร็จ', 'success');
      } else {
        if (PERSONNEL.find(p => p.name.toLowerCase() === nameVal.toLowerCase())) {
          nameInput.style.borderColor = 'var(--color-danger)';
          showToast('รายชื่อบุคลากรนี้ซ้ำและมีอยู่แล้วในระบบ', 'danger');
          return;
        }
        PERSONNEL.push({ name: nameVal, position: posVal, phone: phoneVal });
        showToast('เพิ่มรายชื่อบุคลากรใหม่สำเร็จ', 'success');
      }
      savePersonnelData();
      closePersonnelModal();
      renderPersonnel();
    }

    function deletePersonnel(index) {
      const p = PERSONNEL[index];
      if (!p) return;
      const confirmDelete = confirm(`คุณแน่ใจที่จะลบ "${p.name}" (${p.position}) ออกจากรายชื่อบุคลากรหรือไม่?`);
      if (!confirmDelete) return;
      
      PERSONNEL.splice(index, 1);
      savePersonnelData();
      showToast('ลบรายชื่อบุคลากรสำเร็จ', 'success');
      renderPersonnel();
    }

    // --- Government Reports & Fiscal Year Logic ---

    function getFiscalYear(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return '';
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const fyAD = month >= 10 ? year + 1 : year;
      return fyAD + 543;
    }

    function populateFiscalYears() {
      const years = new Set();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentFY = (currentMonth >= 10 ? currentYear + 1 : currentYear) + 543;
      years.add(currentFY);
      years.add(currentFY - 1);
      years.add(currentFY - 2);

      history.forEach(h => {
        const fy = getFiscalYear(h.date);
        if (fy) years.add(fy);
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);

      const histSelect = document.getElementById('histFiscalFilter');
      if (histSelect) {
        histSelect.innerHTML = '<option value="">' + t('ทั้งหมด') + '</option>' +
          sortedYears.map(y => `<option value="${y}">ปีงบประมาณ ${y}</option>`).join('');
      }

      const reportFiscalSelect = document.getElementById('reportFiscalYear');
      if (reportFiscalSelect) {
        reportFiscalSelect.innerHTML = sortedYears.map(y => `<option value="${y}">ปีงบประมาณ ${y}</option>`).join('');
        reportFiscalSelect.value = String(currentFY);
      }

      const reportYearSelect = document.getElementById('reportYear');
      if (reportYearSelect) {
        const calendarYears = new Set();
        calendarYears.add(currentYear);
        calendarYears.add(currentYear - 1);
        calendarYears.add(currentYear - 2);
        history.forEach(h => {
          if (h.date) {
            const y = parseInt(h.date.split('-')[0]);
            if (y) calendarYears.add(y);
          }
        });
        const sortedCalYears = Array.from(calendarYears).sort((a, b) => b - a);
        reportYearSelect.innerHTML = sortedCalYears.map(y => `<option value="${y}">${y + 543} (ค.ศ. ${y})</option>`).join('');
        reportYearSelect.value = String(currentYear);
      }

      const reportMonthSelect = document.getElementById('reportMonth');
      if (reportMonthSelect) {
        reportMonthSelect.value = String(currentMonth);
      }
    }

    function onReportFilterChange() {
      const reportType = document.getElementById('reportType').value;
      if (reportType === 'monthly') {
        document.getElementById('reportMonthGroup').style.display = 'block';
        document.getElementById('reportYearGroup').style.display = 'block';
        document.getElementById('reportFiscalGroup').style.display = 'none';
      } else {
        document.getElementById('reportMonthGroup').style.display = 'none';
        document.getElementById('reportYearGroup').style.display = 'none';
        document.getElementById('reportFiscalGroup').style.display = 'block';
      }
      renderReport();
    }

    function renderReport() {
      const reportType = document.getElementById('reportType').value;
      const month = parseInt(document.getElementById('reportMonth').value);
      const year = parseInt(document.getElementById('reportYear').value);
      const fy = parseInt(document.getElementById('reportFiscalYear').value);

      let filteredHistory = [];

      if (reportType === 'monthly') {
        filteredHistory = history.filter(h => {
          if (!h.date) return false;
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          return hYear === year && hMonth === month;
        });
      } else {
        filteredHistory = history.filter(h => {
          return getFiscalYear(h.date) === fy;
        });
      }

      const reportData = products.map(p => {
        const recv = filteredHistory
          .filter(h => h.code === p.code && h.type === 'รับ')
          .reduce((sum, h) => sum + h.qty, 0);

        const issue = filteredHistory
          .filter(h => h.code === p.code && h.type === 'เบิก')
          .reduce((sum, h) => sum + h.qty, 0);

        return {
          code: p.code,
          name: p.name,
          cat: p.cat,
          unit: p.unit,
          loc: p.loc || '-',
          received: recv,
          issued: issue,
          currentQty: p.qty
        };
      });

      const container = document.getElementById('reportTableContainer');
      if (!container) return;

      let titleText = '';
      if (reportType === 'monthly') {
        const monthsTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        titleText = currentLang === 'th' 
          ? `รายงานสรุปความเคลื่อนไหวพัสดุ ประจำเดือน ${monthsTH[month - 1]} ปี พ.ศ. ${year + 543}`
          : `Monthly Requisition Summary - ${monthsEN[month - 1]} ${year}`;
      } else {
        titleText = currentLang === 'th'
          ? `รายงานสรุปความเคลื่อนไหวพัสดุ ประจำปีงบประมาณ พ.ศ. ${fy}`
          : `Fiscal Year Requisition Summary - FY ${fy}`;
      }

      container.innerHTML = `
        <div style="margin-bottom: 16px; font-weight: 600; font-size: 15px; color: var(--color-text-primary); text-align: center; border-bottom: 2px solid var(--color-border); padding-bottom: 8px;">
          ${titleText}
        </div>
        <table>
          <thead>
            <tr>
              <th>${t('รหัสสินค้า')}</th>
              <th>${t('ชื่อพัสดุ')}</th>
              <th>${t('หมวดหมู่')}</th>
              <th>${t('สถานที่เก็บ')}</th>
              <th style="text-align: right;">${t('จำนวนที่รับเข้า')}</th>
              <th style="text-align: right;">${t('จำนวนที่เบิกออก')}</th>
              <th style="text-align: right;">${t('คงเหลือปัจจุบัน')}</th>
              <th>${t('หน่วยนับ')}</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map(r => `
              <tr>
                <td><strong>${r.code}</strong></td>
                <td>${r.name}</td>
                <td><span class="badge badge-primary">${t(r.cat)}</span></td>
                <td>${r.loc}</td>
                <td style="text-align: right; font-weight: 500; color: var(--color-success);">${r.received > 0 ? '+' + r.received.toLocaleString() : '0'}</td>
                <td style="text-align: right; font-weight: 500; color: var(--color-danger);">${r.issued > 0 ? '-' + r.issued.toLocaleString() : '0'}</td>
                <td style="text-align: right; font-weight: 600;">${r.currentQty.toLocaleString()}</td>
                <td>${t(r.unit)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    function printReport() {
      const reportType = document.getElementById('reportType').value;
      const month = parseInt(document.getElementById('reportMonth').value);
      const year = parseInt(document.getElementById('reportYear').value);
      const fy = parseInt(document.getElementById('reportFiscalYear').value);

      let filteredHistory = [];
      if (reportType === 'monthly') {
        filteredHistory = history.filter(h => {
          if (!h.date) return false;
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          return hYear === year && hMonth === month;
        });
      } else {
        filteredHistory = history.filter(h => getFiscalYear(h.date) === fy);
      }

      const reportData = products.map(p => {
        const recv = filteredHistory
          .filter(h => h.code === p.code && h.type === 'รับ')
          .reduce((sum, h) => sum + h.qty, 0);

        const issue = filteredHistory
          .filter(h => h.code === p.code && h.type === 'เบิก')
          .reduce((sum, h) => sum + h.qty, 0);

        return {
          code: p.code,
          name: p.name,
          cat: p.cat,
          unit: p.unit,
          loc: p.loc || '-',
          received: recv,
          issued: issue,
          currentQty: p.qty
        };
      });

      let reportTitle = '';
      if (reportType === 'monthly') {
        const monthsTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        reportTitle = `รายงานสรุปความเคลื่อนไหวพัสดุประจำเดือน ${monthsTH[month - 1]} พ.ศ. ${year + 543}`;
      } else {
        reportTitle = `รายงานสรุปความเคลื่อนไหวพัสดุประจำปีงบประมาณ พ.ศ. ${fy}`;
      }

      const printWindow = window.open('', '_blank', 'width=1000,height=800');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>&nbsp;</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Sarabun', sans-serif;
              padding: 30px;
              color: #000000;
              background: #ffffff;
              font-size: 14px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
            }
            .title {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 13px;
              color: #333333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 13px;
            }
            th, td {
              border: 1px solid #000000;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: 600;
              text-align: center;
            }
            td.num {
              text-align: right;
            }
            .footer-section {
              margin-top: 40px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
            }
            .signature-block {
              text-align: center;
            }
            .sig-line {
              border-bottom: 1px dotted #000000;
              width: 70%;
              margin: 40px auto 10px auto;
            }
            
            /* Screen view styles */
            @media screen {
              body {
                background: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 24px;
              }
              .print-content {
                display: none !important;
              }
              .screen-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
                text-align: center;
                max-width: 450px;
                width: 100%;
                box-sizing: border-box;
              }
              .spinner {
                border: 4px solid #f1f5f9;
                border-top: 4px solid #6366f1;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            }
            
            /* Print view styles */
            @media print {
              .screen-preview {
                display: none !important;
              }
              .print-content {
                display: block !important;
              }
              body {
                padding: 1.5cm 2cm;
                margin: 0;
                background: #ffffff;
              }
              @page {
                size: landscape;
                margin: 0; /* Force hide default browser headers and footers */
              }
            }
          </style>
        </head>
        <body>
          <div class="screen-preview">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0; color: #0f172a; font-family: 'Sarabun', sans-serif;">กำลังเรียกใช้หน้าต่างพิมพ์รายงานพัสดุ</p>
            <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; font-family: 'Sarabun', sans-serif;">ระบบกำลังเปิดกล่องพิมพ์ของเบราว์เซอร์ หน้าต่างนี้จะปิดตัวเองโดยอัตโนมัติเมื่อพิมพ์เสร็จหรือยกเลิก</p>
          </div>
          
          <div class="print-content">
            <div class="header">
              <div class="title">${reportTitle}</div>
              <div class="subtitle">กองกรรมวิธีข้อมูล</div>
            </div>
          <table>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>รหัสพัสดุ</th>
                <th>ชื่อรายการพัสดุ</th>
                <th>หมวดหมู่</th>
                <th>สถานที่จัดเก็บ</th>
                <th>จำนวนรับเข้า</th>
                <th>จำนวนเบิกออก</th>
                <th>ยอดคงเหลือปัจจุบัน</th>
                <th>หน่วยนับ</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map((r, i) => `
                <tr>
                  <td style="text-align: center;">${i + 1}</td>
                  <td>${r.code}</td>
                  <td>${r.name}</td>
                  <td>${r.cat}</td>
                  <td>${r.loc}</td>
                  <td class="num">${r.received.toLocaleString()}</td>
                  <td class="num">${r.issued.toLocaleString()}</td>
                  <td class="num" style="font-weight: 600;">${r.currentQty.toLocaleString()}</td>
                  <td style="text-align: center;">${r.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer-section">
            <div class="signature-block">
              <p>เจ้าหน้าที่ผู้จัดทำรายงาน</p>
              <div class="sig-line"></div>
              <p>( ........................................................ )</p>
              <p>ตำแหน่ง เจ้าหน้าที่พัสดุ</p>
              <p>วันที่ ........../........../..........</p>
            </div>
            <div class="signature-block">
              <p>ผู้ตรวจสอบความถูกต้อง</p>
              <div class="sig-line"></div>
              <p>( ........................................................ )</p>
              <p>ตำแหน่ง หัวหน้าหน่วยงาน DPD</p>
              <p>วันที่ ........../........../..........</p>
            </div>
            </div>
          </div>
          
          <scr` + `ipt>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </scr` + `ipt>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    function exportReportCSV() {
      const reportType = document.getElementById('reportType').value;
      const month = parseInt(document.getElementById('reportMonth').value);
      const year = parseInt(document.getElementById('reportYear').value);
      const fy = parseInt(document.getElementById('reportFiscalYear').value);

      let filteredHistory = [];
      if (reportType === 'monthly') {
        filteredHistory = history.filter(h => {
          if (!h.date) return false;
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          return hYear === year && hMonth === month;
        });
      } else {
        filteredHistory = history.filter(h => getFiscalYear(h.date) === fy);
      }

      const reportData = products.map(p => {
        const recv = filteredHistory
          .filter(h => h.code === p.code && h.type === 'รับ')
          .reduce((sum, h) => sum + h.qty, 0);

        const issue = filteredHistory
          .filter(h => h.code === p.code && h.type === 'เบิก')
          .reduce((sum, h) => sum + h.qty, 0);

        return {
          code: p.code,
          name: p.name,
          cat: p.cat,
          unit: p.unit,
          loc: p.loc || '-',
          received: recv,
          issued: issue,
          currentQty: p.qty
        };
      });

      let reportTitle = '';
      if (reportType === 'monthly') {
        const monthsTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        reportTitle = `รายงานสรุปความเคลื่อนไหวพัสดุประจำเดือน ${monthsTH[month - 1]} พ.ศ. ${year + 543}`;
      } else {
        reportTitle = `รายงานสรุปความเคลื่อนไหวพัสดุประจำปีงบประมาณ พ.ศ. ${fy}`;
      }

      let csvRows = [];
      csvRows.push('\ufeff'); 
      csvRows.push(`"${reportTitle}"`);
      csvRows.push(`"สำนักงานพัฒนาและมาตรฐาน (กกม.บก.ซอ.)"`);
      csvRows.push('');
      csvRows.push('"รหัสพัสดุ","ชื่อรายการ","หมวดหมู่","สถานที่เก็บ","จำนวนรับเข้า","จำนวนเบิกออก","คงเหลือปัจจุบัน","หน่วยนับ"');

      reportData.forEach(r => {
        csvRows.push(`"${r.code}","${r.name}","${r.cat}","${r.loc}",${r.received},${r.issued},${r.currentQty},"${r.unit}"`);
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('ส่งออกไฟล์ Excel (CSV) สำเร็จ');
    }

    function clearHistory() {
      const confirmClear = confirm(t('คุณแน่ใจหรือไม่ที่จะล้างข้อมูลประวัติความเคลื่อนไหวทั้งหมด?\n*การกระทำนี้จะลบข้อมูลประวัติทั้งหมดอย่างถาวรและไม่สามารถกู้คืนได้*'));
      if (confirmClear) {
        history = [];
        saveDatabase();
        renderHistory();
        populateFiscalYears();
        showToast(t('ล้างข้อมูลประวัติสำเร็จ'), 'success');
      }
    }

    // --- Search Autocomplete for Personnel ---
    function filterPersonnelDropdown(val) {
      const container = document.getElementById('personnelSuggestions');
      if (!container) return;
      
      const q = val.trim().toLowerCase();
      
      const matches = q.length === 0
        ? PERSONNEL
        : PERSONNEL.filter(p => 
            (p.name || '').toLowerCase().includes(q) || 
            (p.position || '').toLowerCase().includes(q)
          );
      
      if (matches.length === 0) {
        container.style.display = 'none';
        return;
      }
      
      container.innerHTML = matches.map(p => `
        <div class="suggestion-item" onmousedown="selectPersonnelSuggestion('${p.name}')">
          <strong>${p.name}</strong>
        </div>
      `).join('');
      
      container.style.display = 'block';
    }

    function selectPersonnelSuggestion(value) {
      const input = document.getElementById('issuePerson');
      if (input) {
        input.value = value;
        toggleClearBtn(value);
      }
      hidePersonnelDropdown();
    }

    function hidePersonnelDropdown() {
      const container = document.getElementById('personnelSuggestions');
      if (container) {
        setTimeout(() => { container.style.display = 'none'; }, 150);
      }
    }

    // --- Autocomplete Helper functions for Clear Button ---
    function toggleClearBtn(val) {
      const btn = document.getElementById('clearIssuePersonBtn');
      if (btn) {
        btn.style.display = val.length > 0 ? 'block' : 'none';
      }
    }

    function clearIssuePersonInput() {
      const input = document.getElementById('issuePerson');
      if (input) {
        input.value = '';
        input.focus();
        filterPersonnelDropdown('');
        toggleClearBtn('');
      }
    }

    // --- Search Autocomplete for Products (Receive Modal) ---
    function filterRecvProductDropdown(val) {
      const container = document.getElementById('recvProductSuggestions');
      if (!container) return;
      
      const q = val.trim().toLowerCase();
      
      const matches = q.length === 0
        ? products
        : products.filter(p => 
            (p.code || '').toLowerCase().includes(q) || 
            (p.name || '').toLowerCase().includes(q)
          );
      
      const btn = document.getElementById('clearRecvItemBtn');
      if (btn) btn.style.display = val.length > 0 ? 'block' : 'none';

      if (matches.length === 0) {
        container.style.display = 'none';
        return;
      }
      
      container.innerHTML = matches.map(p => `
        <div class="suggestion-item" onmousedown="selectRecvProduct('${p.code}', '${p.code} - ${p.name}')">
          <strong>${p.code}</strong> - <span>${p.name}</span>
        </div>
      `).join('');
      
      container.style.display = 'block';
    }

    function selectRecvProduct(code, displayName) {
      const input = document.getElementById('recvItemSearch');
      const hiddenInput = document.getElementById('recvItem');
      if (input) input.value = displayName;
      if (hiddenInput) hiddenInput.value = code;
      const btn = document.getElementById('clearRecvItemBtn');
      if (btn) btn.style.display = 'block';
      hideRecvProductDropdown();
    }

    function hideRecvProductDropdown() {
      const container = document.getElementById('recvProductSuggestions');
      if (container) {
        setTimeout(() => { container.style.display = 'none'; }, 150);
      }
    }

    function clearRecvItemInput() {
      const input = document.getElementById('recvItemSearch');
      const hiddenInput = document.getElementById('recvItem');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (hiddenInput) hiddenInput.value = '';
      const btn = document.getElementById('clearRecvItemBtn');
      if (btn) btn.style.display = 'none';
      filterRecvProductDropdown('');
    }

    // --- Search Autocomplete for Products (Issue Modal) ---
    function filterIssueProductDropdown(val) {
      const container = document.getElementById('issueProductSuggestions');
      if (!container) return;
      
      const q = val.trim().toLowerCase();
      
      const matches = q.length === 0
        ? products
        : products.filter(p => 
            (p.code || '').toLowerCase().includes(q) || 
            (p.name || '').toLowerCase().includes(q)
          );
      
      const btn = document.getElementById('clearIssueItemBtn');
      if (btn) btn.style.display = val.length > 0 ? 'block' : 'none';

      if (matches.length === 0) {
        container.style.display = 'none';
        return;
      }
      
      container.innerHTML = matches.map(p => `
        <div class="suggestion-item" onmousedown="selectIssueProduct('${p.code}', '${p.code} - ${p.name}')">
          <strong>${p.code}</strong> - <span>${p.name}</span>
        </div>
      `).join('');
      
      container.style.display = 'block';
    }

    function selectIssueProduct(code, displayName) {
      const input = document.getElementById('issueItemSearch');
      const hiddenInput = document.getElementById('issueItem');
      if (input) input.value = displayName;
      if (hiddenInput) hiddenInput.value = code;
      const btn = document.getElementById('clearIssueItemBtn');
      if (btn) btn.style.display = 'block';
      hideIssueProductDropdown();
    }

    function hideIssueProductDropdown() {
      const container = document.getElementById('issueProductSuggestions');
      if (container) {
        setTimeout(() => { container.style.display = 'none'; }, 150);
      }
    }

    function clearIssueItemInput() {
      const input = document.getElementById('issueItemSearch');
      const hiddenInput = document.getElementById('issueItem');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (hiddenInput) hiddenInput.value = '';
      const btn = document.getElementById('clearIssueItemBtn');
      if (btn) btn.style.display = 'none';
      filterIssueProductDropdown('');
    }

    // --- Database Backup & Restore System ---
    function exportBackupData() {
      try {
        const backupObj = {
          products: products,
          history: history,
          personnel: PERSONNEL
        };
        const jsonString = JSON.stringify(backupObj, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '_');
        downloadAnchor.setAttribute("href", url);
        downloadAnchor.setAttribute("download", `dpd_stock_backup_${dateStr}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        URL.revokeObjectURL(url);
        showToast('สำรองข้อมูลเรียบร้อย (Backup JSON Downloaded)', 'success');
      } catch (e) {
        showToast('เกิดข้อผิดพลาดในการสำรองข้อมูล', 'danger');
      }
    }

    function triggerRestoreUpload() {
      const fileInput = document.getElementById('restoreFileInput');
      if (fileInput) fileInput.click();
    }

    function importBackupData(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData && Array.isArray(importedData.products) && Array.isArray(importedData.history) && Array.isArray(importedData.personnel)) {
            const confirmRestore = confirm('คุณต้องการกู้คืนข้อมูลระบบด้วยไฟล์สำรองนี้หรือไม่?\n*คำเตือน: ข้อมูลพัสดุ ประวัติการเบิกจ่าย และบุคลากรทั้งหมดที่มีอยู่ในปัจจุบันจะถูกเขียนทับทันที*');
            if (confirmRestore) {
              products = importedData.products;
              history = importedData.history;
              PERSONNEL = importedData.personnel;
              saveDatabase();
              
              // Refresh views and components
              renderDashboard();
              renderStock();
              renderHistory();
              renderPersonnel();
              populateFiscalYears();
              
              showToast('กู้คืนข้อมูลสำเร็จ (Database Restored)', 'success');
            }
          } else {
            showToast('ไฟล์สำรองไม่ถูกต้อง หรือโครงสร้างข้อมูลผิดพลาด', 'danger');
          }
        } catch (err) {
          showToast('ไม่สามารถอ่านไฟล์ได้ หรือข้อมูลในไฟล์ไม่ใช่ JSON', 'danger');
        }
        event.target.value = '';
      };
      reader.readAsText(file);
    }

    // --- Seamless Video Looping using Double Buffering to Prevent Looping Stutter ---
    window.addEventListener('DOMContentLoaded', () => {
      const v1 = document.getElementById('appBgVideo1');
      const v2 = document.getElementById('appBgVideo2');
      if (!v1 || !v2) return;

      v1.preload = 'auto';
      v2.preload = 'auto';

      let activeVideo = v1;
      let inactiveVideo = v2;
      let crossfading = false;

      // Safe autoplay trigger
      const playActive = () => {
        activeVideo.play().catch(e => {
          // Retry on interaction if blocked by autoplay policies
          document.addEventListener('click', () => {
            activeVideo.play();
          }, { once: true });
        });
      };
      playActive();

      function checkCrossfade() {
        if (crossfading) return;
        
        // Start crossfading 1.2 seconds before the current active video ends
        const crossfadeThreshold = 1.2; 
        if (activeVideo.duration && activeVideo.currentTime > activeVideo.duration - crossfadeThreshold) {
          crossfading = true;
          
          // Prepare the inactive video and start playing
          inactiveVideo.currentTime = 0;
          inactiveVideo.play().then(() => {
            // Fade out the current active video and fade in the inactive video
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');

            // Swap references
            const oldActive = activeVideo;
            activeVideo = inactiveVideo;
            inactiveVideo = oldActive;

            // Wait 1 second (matching CSS transition duration) before pausing the old video
            setTimeout(() => {
              inactiveVideo.pause();
              crossfading = false;
            }, 1000);
          }).catch(e => {
            console.log('Crossfade video play failed:', e);
            crossfading = false;
          });
        }
      }

      v1.addEventListener('timeupdate', checkCrossfade);
      v2.addEventListener('timeupdate', checkCrossfade);
    });

    // --- Dynamic Requisition Trend & Top Products Visualizations using Chart.js ---
    function renderCharts() {
      const monthlyTrendCtx = document.getElementById('monthlyTrendChart');
      if (!monthlyTrendCtx) return;

      const last6Months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push({
          label: d.toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-GB', { month: 'short', year: 'numeric' }),
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          totalQty: 0
        });
      }

      // Sum quantities issued for each of the last 6 months
      history.forEach(h => {
        if (h.type === 'เบิก' && h.date) {
          const parts = h.date.split('-');
          const hYear = parseInt(parts[0]);
          const hMonth = parseInt(parts[1]);
          const target = last6Months.find(m => m.year === hYear && m.month === hMonth);
          if (target) {
            target.totalQty += h.qty;
          }
        }
      });

      // Calculate Top 5 Issued Products
      const productTotals = {};
      history.forEach(h => {
        if (h.type === 'เบิก') {
          const key = h.name || h.code;
          productTotals[key] = (productTotals[key] || 0) + h.qty;
        }
      });

      const topProducts = Object.entries(productTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const topLabels = topProducts.map(x => x[0]);
      const topData = topProducts.map(x => x[1]);

      // Destroy old charts to prevent duplicate instances
      if (window.monthlyTrendChartInstance) window.monthlyTrendChartInstance.destroy();
      if (window.topProductsChartInstance) window.topProductsChartInstance.destroy();

      // Premium styling variables matching cyber dark theme
      const gridColor = 'rgba(255, 255, 255, 0.05)';
      const textColor = '#cbd5e1';
      const font = { family: 'Sarabun, Inter, sans-serif', size: 12 };

      // Render Line Chart (Trend)
      window.monthlyTrendChartInstance = new Chart(monthlyTrendCtx, {
        type: 'line',
        data: {
          labels: last6Months.map(m => m.label),
          datasets: [{
            label: t('จำนวนพัสดุที่เบิก'),
            data: last6Months.map(m => m.totalQty),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) { return ` ${context.parsed.y.toLocaleString()} ${t('ชิ้น')}`; }
              }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: font }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: font, stepSize: 1 }
            }
          }
        }
      });

      // Render Bar Chart (Top 5)
      const topBarCtx = document.getElementById('topProductsChart');
      if (!topBarCtx) return;

      window.topProductsChartInstance = new Chart(topBarCtx, {
        type: 'bar',
        data: {
          labels: topLabels.length > 0 ? topLabels : [t('ไม่มีข้อมูลการเบิก')],
          datasets: [{
            label: t('จำนวนพัสดุที่เบิก'),
            data: topData.length > 0 ? topData : [0],
            backgroundColor: [
              'rgba(99, 102, 241, 0.85)',
              'rgba(16, 185, 129, 0.85)',
              'rgba(244, 63, 94, 0.85)',
              'rgba(245, 158, 11, 0.85)',
              'rgba(59, 130, 246, 0.85)'
            ],
            borderRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) { return ` ${context.parsed.y.toLocaleString()} ${t('ชิ้น')}`; }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: font }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: font, stepSize: 1 }
            }
          }
        }
      });
    }