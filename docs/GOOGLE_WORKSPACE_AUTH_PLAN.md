# แผนเชื่อม Google Workspace

## เป้าหมาย

ให้หน้าเว็บยังเผยแพร่ผ่าน GitHub Pages ได้ แต่ผู้ใช้ต้องลงชื่อเข้าใช้ด้วยบัญชี Google Workspace ของหน่วยงาน และ Backend ต้องปฏิเสธคำขอที่ไม่มีสิทธิ์

## สถาปัตยกรรมที่แนะนำ

1. GitHub Pages ให้บริการเฉพาะ HTML, CSS และ JavaScript
2. Google Identity Services ออก ID token หลังผู้ใช้ลงชื่อเข้าใช้
3. Frontend ส่ง token ไปกับทุกคำขอ
4. Backend ตรวจลายเซ็น token, `aud`, `iss`, `exp` และโดเมน `hd`
5. Backend อ่านบทบาทของผู้ใช้จากตาราง `Users`
6. Backend อ่าน–เขียนข้อมูลสต็อกและสร้าง Audit Log
7. Frontend เก็บเฉพาะ session ระยะสั้น ไม่เก็บรหัสผ่าน

## บทบาทเริ่มต้น

| บทบาท | สิทธิ์ |
|---|---|
| `admin` | จัดการผู้ใช้ พัสดุ การสำรองข้อมูล และการตั้งค่า |
| `stock` | รับเข้า เบิกออก และแก้รายละเอียดพัสดุ |
| `approver` | อนุมัติหรือปฏิเสธคำขอเบิก |
| `viewer` | ดู Dashboard ประวัติ และรายงาน |

Backend ต้องเป็นผู้ตัดสินสิทธิ์เสมอ การซ่อนเมนูบนหน้าเว็บมีไว้เพื่อประสบการณ์ใช้งานเท่านั้น

## ตารางข้อมูลขั้นต่ำ

- `Users`: email, displayName, role, active
- `Products`: code, name, category, qty, minQty, unit, location, version
- `Transactions`: id, type, productCode, qty, requester, approver, status, createdAt
- `AuditLog`: id, actor, action, target, before, after, timestamp

## ข้อมูลที่เจ้าของระบบต้องเตรียม

- ชื่อโดเมน Google Workspace ที่อนุญาต
- Google OAuth Client ID สำหรับ Web application
- รายชื่อผู้ดูแลระบบเริ่มต้น
- URL GitHub Pages ที่ใช้งานจริง
- บัญชี Google ที่เป็นเจ้าของ Backend และ Google Sheet
- นโยบายอายุ session ที่หน่วยงานต้องการ

## ลำดับการย้ายระบบ

1. สร้าง OAuth Client และ Backend รุ่นใหม่
2. เพิ่มตาราง Users และ AuditLog
3. ทดสอบด้วยบัญชีผู้ดูแลหนึ่งบัญชี
4. ย้ายข้อมูลตัวอย่างและตรวจสิทธิ์ทุกบทบาท
5. ลบระบบรหัสผ่านแบบฝังใน JavaScript
6. หมุนเวียน credential เดิมและทำความสะอาด Git history
7. เปิดใช้กับผู้ใช้กลุ่มเล็กก่อนใช้งานทั้งหน่วยงาน
