# การติดตั้ง Google Sheets Backend สำหรับ DPD Stock

Backend อยู่ใน google-apps-script/Code.gs และออกแบบสำหรับผู้ใช้ภายใน 5–6 คน โดย Google Sheets เป็นฐานข้อมูลส่วนกลาง ส่วน GitHub เป็นที่เก็บและตรวจสอบเวอร์ชันโค้ด

> อย่านำข้อมูลจริงไปใส่ใน Preview และอย่าเปลี่ยน GOOGLE_SCRIPT_URL จนกว่าการตั้งค่าบัญชีและสิทธิ์จะผ่านทั้งหมด

## ความสามารถ

- บทบาท viewer, staff, approver และ admin
- ตรวจอีเมลผู้ใช้จาก Google Workspace ทุกคำสั่ง
- จำกัดโดเมนด้วย ALLOWED_DOMAIN และตาราง Users
- ใช้ Script Lock ป้องกันการแก้ยอดพร้อมกัน
- ใช้ version ป้องกันการเขียนทับข้อมูลใหม่จากอีกอุปกรณ์
- ใช้ requestId ป้องกันคำสั่งเดิมถูกบันทึกซ้ำ
- ใช้ CSRF token อายุ 30 นาที
- บันทึก Audit Log
- รองรับรับเข้า ตรวจนับ ขอเบิก อนุมัติ ปฏิเสธ ยกเลิก จ่าย คืน และปิดบางส่วน

## 1. เตรียม Google Sheet

1. สร้าง Google Sheet ใหม่ในบัญชีหน่วยงาน
2. ตั้งชื่อ เช่น DPD Stock Database
3. คัดลอก Spreadsheet ID จาก URL

~~~text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
~~~

ไม่ต้องสร้างชีตย่อยเอง ฟังก์ชัน setupDatabase() จะสร้าง Users, Products, Requests, Movements, Personnel, Audit และ Idempotency

## 2. สร้าง Apps Script Project

1. ใน Google Sheet เลือก **ส่วนขยาย → Apps Script**
2. คัดลอก google-apps-script/Code.gs ไปใส่ Code.gs
3. เปิด Project Settings และเลือกแสดงไฟล์ manifest
4. คัดลอก google-apps-script/appsscript.json
5. บันทึกโปรเจกต์

ห้ามใส่ Spreadsheet ID, อีเมลจริง หรือ URL Deployment ลงใน GitHub

## 3. ตั้งค่า Script Properties

ไปที่ **Project Settings → Script Properties** แล้วเพิ่ม:

| Property | ตัวอย่าง | หน้าที่ |
|---|---|---|
| SPREADSHEET_ID | ID จาก Google Sheet | ระบุฐานข้อมูล |
| ALLOWED_DOMAIN | youragency.go.th | อนุญาตเฉพาะโดเมนหน่วยงาน |
| INITIAL_ADMIN_EMAIL | อีเมลผู้ดูแล | สร้าง Admin คนแรก |

## 4. สร้างฐานข้อมูล

1. เลือกฟังก์ชัน setupDatabase
2. กด Run
3. อนุญาตสิทธิ์ Google Sheets และการอ่านอีเมลผู้ใช้
4. ตรวจว่า Google Sheet มีครบ 7 แท็บ
5. ตรวจแถวแรกของ Users ว่าเป็น Admin ที่ถูกต้อง

หากหัวตารางเดิมไม่ตรง ฟังก์ชันจะหยุดเพื่อป้องกันการเขียนทับชีตผิดชุด

## 5. เพิ่มผู้ใช้

| email | role | displayName | active |
|---|---|---|---|
| user@domain | viewer | ผู้ขอเบิก | TRUE |
| stock@domain | staff | เจ้าหน้าที่คลัง | TRUE |
| approver@domain | approver | ผู้อนุมัติ | TRUE |
| admin@domain | admin | ผู้ดูแลระบบ | TRUE |

อย่าใช้รหัสผ่านหน้า Demo กับระบบจริง ระบบจริงใช้บัญชี Google Workspace

## 6. Deploy Web App

เลือก **Deploy → New deployment → Web app** และตั้งค่า:

- Execute as: **User accessing the web app**
- Who has access: **เฉพาะผู้ใช้ภายในโดเมน/องค์กร**
- ห้ามเลือก **Anyone, even anonymous**
- คัดลอก URL ที่ลงท้ายด้วย /exec

การ Deploy แบบ Execute as me ไม่เหมาะ เพราะ Backend ต้องระบุผู้ใช้ที่ทำรายการจริง หากอีเมลว่าง Backend จะตอบ IDENTITY_UNAVAILABLE

URL /dev ใช้ได้เฉพาะผู้มีสิทธิ์แก้ Apps Script และเหมาะสำหรับทดสอบโค้ดล่าสุดเท่านั้น

## 7. ทดสอบก่อนเชื่อมหน้าเว็บ

เปิดด้วยบัญชีหน่วยงาน:

~~~text
YOUR_DEPLOYMENT_URL?action=health
YOUR_DEPLOYMENT_URL?action=bootstrap
~~~

ผลที่ต้องได้:

- ok เป็น true
- อีเมลและ role ตรงกับผู้ใช้
- bootstrap มี csrfToken
- ผู้ใช้ที่ไม่อยู่ใน Users ถูกปฏิเสธ
- บัญชีนอกโดเมนถูกปฏิเสธ

## 8. รูปแบบคำสั่งเขียนข้อมูล

ทุก POST ต้องส่ง action, requestId, csrfToken และ payload เช่น:

~~~json
{
  "action": "createRequest",
  "requestId": "UUID-ที่ไม่ซ้ำ",
  "csrfToken": "ค่าจาก bootstrap",
  "payload": {
    "request": {
      "code": "DPD-001",
      "qty": 10,
      "user": "ชื่อผู้รับ",
      "userPosition": "ตำแหน่ง",
      "note": "วัตถุประสงค์"
    }
  }
}
~~~

คำสั่งที่รองรับ:

- upsertProduct, deleteProduct
- receiveStock, stocktake
- createRequest
- approveRequest, rejectRequest, cancelRequest
- dispenseRequest, returnRequest, closeRequest
- upsertPersonnel, deletePersonnel
- setUserRole

คำสั่งแก้ข้อมูลเดิมควรส่ง expectedVersion หากข้อมูลถูกแก้จากอีกเครื่อง Backend จะตอบ VERSION_CONFLICT ให้โหลดข้อมูลใหม่แทนการเขียนทับ

## 9. GitHub Pages และระบบจริง

GitHub Pages เป็น Static Site จึงไม่สามารถเก็บ secret หรือยืนยันสิทธิ์ฝั่งเซิร์ฟเวอร์ได้ การเชื่อมกับ Apps Script ต้องทดสอบการเข้าสู่ระบบและ cross-origin ของโดเมนจริงก่อน

แนวทางที่ปลอดภัยที่สุด:

1. เก็บ source code และ version control ใน GitHub
2. ให้ Apps Script Web App เป็นจุดที่ผู้ใช้เปิดระบบจริง
3. ให้ Preview บน GitHub Pages ใช้ Demo Mode ต่อไป
4. อย่าเปิด Backend แบบ anonymous เพื่อแก้ปัญหา cross-origin

## Checklist ก่อนเปิดจริง

- [ ] ใช้ Google Workspace ของหน่วยงาน
- [ ] ตั้ง ALLOWED_DOMAIN
- [ ] Users มีเฉพาะผู้ได้รับอนุญาต
- [ ] Deploy แบบ User accessing the web app
- [ ] จำกัดการเข้าถึงเฉพาะองค์กร
- [ ] viewer ไม่สามารถอนุมัติหรือแก้สต็อก
- [ ] approver ไม่สามารถจ่ายพัสดุ
- [ ] staff ไม่สามารถอนุมัติ
- [ ] ทดสอบเบิกพร้อมกันจากสองเครื่อง
- [ ] Audit แสดงอีเมล action และ requestId
- [ ] Preview ยังเป็น DEMO และไม่เชื่อมฐานข้อมูลจริง

## เอกสาร Google

- [Web Apps](https://developers.google.com/apps-script/guides/web)
- [Session และ Active User](https://developers.google.com/apps-script/reference/base/session)
- [Lock Service](https://developers.google.com/apps-script/reference/lock)
- [Cache Service](https://developers.google.com/apps-script/reference/cache/cache-service)
