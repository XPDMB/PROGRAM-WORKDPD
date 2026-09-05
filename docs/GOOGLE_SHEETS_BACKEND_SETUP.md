# การติดตั้ง Google Sheets Backend สำหรับ DPD Stock

Backend อยู่ใน `google-apps-script/Code.gs` และออกแบบสำหรับผู้ใช้ภายใน 5–6 คน โดย Google Sheets เป็นฐานข้อมูลส่วนกลาง ส่วน GitHub เก็บและตรวจสอบเวอร์ชันโค้ด

> GitHub Pages เป็น Demo เท่านั้น ระบบที่ใช้ข้อมูลจริงให้เปิดผ่าน Apps Script Web App

## ความสามารถ

- ชื่อผู้ใช้ภายใน ไม่ต้องมี Gmail
- 3 บทบาท: user/viewer, staff และ admin โดย admin เป็นผู้อนุมัติ
- รหัสผ่านเก็บแบบ HMAC-SHA256 พร้อม salt และ pepper ไม่เก็บข้อความตรง ๆ
- session อายุสูงสุด 6 ชั่วโมงและ CSRF token ผูกกับ session
- กรอกรหัสผิดครบ 5 ครั้งจะล็อกบัญชีชั่วคราว 15 นาที
- Script Lock, optimistic version, idempotency และ Audit Log
- รับเข้า ตรวจนับ ขอเบิก อนุมัติ ปฏิเสธ ยกเลิก จ่าย คืน และปิดยอด

## 1. เตรียม Google Sheet

1. สร้าง Google Sheet ในบัญชีผู้ดูแลระบบ
2. คัดลอก Spreadsheet ID จาก URL
3. อย่าเผยแพร่ Spreadsheet ID หรือข้อมูลจริงใน GitHub

ฟังก์ชัน `setupDatabase()` จะสร้าง Accounts, Users, Products, Requests, Movements, Personnel, Audit และ Idempotency

## 2. สร้าง Apps Script Project

1. เปิด Apps Script
2. นำ `Code.gs`, `TestApp.html` และ `appsscript.json` จากโฟลเดอร์ `google-apps-script` ไปใช้
3. บันทึกโปรเจกต์

## 3. ตั้งค่า Script Properties

ไปที่ **Project Settings → Script Properties** แล้วเพิ่ม:

| Property | หน้าที่ |
|---|---|
| SPREADSHEET_ID | ID ของ Google Sheet ฐานข้อมูล |
| INITIAL_ADMIN_EMAIL | ค่าเดิมสำหรับชีต Users และความเข้ากันได้ย้อนหลัง |
| AUTH_PEPPER | ระบบสร้างให้อัตโนมัติเมื่อเริ่มใช้งาน ห้ามนำขึ้น GitHub |

## 4. สร้างฐานข้อมูลและบัญชีแรก

1. รัน `setupDatabase()` และอนุญาตสิทธิ์ Google Sheets
2. Deploy Web App ชั่วคราว
3. เปิดหน้า Web App แล้วใช้แบบฟอร์มเริ่มต้นเพื่อสร้างบัญชี admin
4. จากเมนู **สิทธิ์ผู้ใช้** ให้ admin สร้างบัญชี user/viewer หรือ staff ตามต้องการ
5. เพิ่มรายชื่อเจ้าหน้าที่ในเมนู **กำลังพล** เพื่อใช้เลือกผู้ดำเนินการจริง

ห้ามใส่รหัสผ่านหรือค่า AUTH_PEPPER ลงใน source code, commit, issue หรือ Pull Request

## 5. Deploy Web App สำหรับทดสอบ

ตั้งค่า:

- Execute as: **Me / User deploying**
- Who has access: **Anyone**
- ใช้ URL ที่ลงท้ายด้วย `/exec`

การเปิด URL แบบนี้ทำให้หน้าเข้าสู่ระบบเข้าถึงได้ แต่คำสั่งอ่านและเขียนข้อมูลต้องมี sessionToken และ CSRF token ที่ระบบออกให้หลังล็อกอินสำเร็จ ทุกคำสั่งยังตรวจบทบาทฝั่งเซิร์ฟเวอร์

URL `/dev` เหมาะเฉพาะผู้มีสิทธิ์แก้ Apps Script และใช้ทดสอบโค้ดล่าสุด

## 6. ทดสอบสิทธิ์

- viewer: ดูสินค้าและสร้าง/ยกเลิกคำขอของตน
- staff: รับเข้า ตรวจนับ จ่าย และรับคืน
- admin: จัดการทุกส่วนรวมถึงบัญชี และอนุมัติหรือปฏิเสธคำขอ

ทดสอบลำดับอย่างน้อยหนึ่งรอบ: user/viewer สร้างคำขอ → admin อนุมัติ → staff จ่าย → staff รับคืนหรือปิดยอด

## 7. ความปลอดภัยในช่วงทดสอบ

- ใช้เฉพาะข้อมูลทดสอบ
- ไม่ส่งรหัสผ่านผ่านแชตสาธารณะหรือ GitHub
- หากใช้รหัสเดียวกันหลายบัญชี ให้ถือว่าเป็นโหมดทดสอบชั่วคราว
- ก่อนเปิดใช้งานจริง ให้เปลี่ยนเป็นรหัสเฉพาะบุคคลและยาวกว่ารหัสทดสอบ
- ปิดบัญชีที่ไม่ใช้งาน และตรวจ Audit เป็นประจำ
- Preview บน GitHub Pages ต้องคงเป็น Demo และไม่เชื่อมฐานข้อมูลจริง

## Checklist ก่อนเปิดจริง

- [ ] มีบัญชีส่วนกลางเฉพาะ admin, staff และ user ตามที่หน่วยงานกำหนด
- [ ] admin สำรองข้อมูลและทดสอบกู้คืน
- [ ] user/viewer, staff และ admin ถูกจำกัดสิทธิ์ถูกต้อง
- [ ] รายชื่อกำลังพลครบและเลือกผู้ดำเนินการจริงก่อนบันทึก
- [ ] ทดสอบเบิกพร้อมกันจากสองเครื่อง
- [ ] Audit แสดง username, ผู้ดำเนินการจริง, action และ requestId
- [ ] ไม่มีรหัสผ่าน, AUTH_PEPPER หรือ Spreadsheet ID ใน GitHub
- [ ] GitHub Pages ยังเป็น Demo

## เอกสาร Google

- [Web Apps](https://developers.google.com/apps-script/guides/web)
- [Manifest web app](https://developers.google.com/apps-script/manifest/web-app-api-executable)
- [Lock Service](https://developers.google.com/apps-script/reference/lock)
- [Cache Service](https://developers.google.com/apps-script/reference/cache/cache-service)
