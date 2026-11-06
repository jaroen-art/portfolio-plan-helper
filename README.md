# Portfolio Plan Helper 📈🤖

ระบบช่วยเหลือวางแผนการลงทุนและการประเมินความเสี่ยงด้วย AI & Machine Learning

## 📁 โครงสร้างไฟล์ใน Repository (Modular Structure)

```text
portfolio-plan-helper/
├── index.html          # หน้าเว็บหลัก (3 Tabs: Supervised ML, Unsupervised ML, Simulator)
├── style.css           # สไตล์ชีท CSS (รองรับ Light/Dark Mode และ Responsive Grid)
├── app.js              # สคริปต์ JavaScript ประมวลผลหน้าเว็บ กราฟ Chart.js และ 2 ภาษา
├── data.py             # ฟังก์ชันทำความสะอาดข้อมูล (clean_customers, clean_prices)
├── metrics.py          # ฟังก์ชันคำนวณผลตอบแทนและความเสี่ยง (max_drawdown, Sharpe, ฯลฯ)
├── plans.py            # ฟังก์ชันจำลองพอร์ต (check_plan, portfolio_returns)
├── ml.py               # ฟังก์ชัน Supervised & Unsupervised Machine Learning
└── README.md           # คู่มือโครงการและรายละเอียดการใช้งาน
```

## 🚀 วิธีเปิดใช้งานโปรเจกต์ (Local & GitHub Pages)

### 1. การใช้งานบนเครื่องคอมพิวเตอร์ (Local)
- เปิดไฟล์ `index.html` ผ่าน Web Browser (เช่น Google Chrome, Microsoft Edge) ได้ทันทีโดยไม่ต้องลงเซิร์ฟเวอร์
- หรือรัน Python Scripts (`data.py`, `metrics.py`, `plans.py`, `ml.py`) สำหรับประมวลผลข้อมูลหลังบ้าน

### 2. การ Upload ขึ้น GitHub Pages
1. สร้าง **New Repository** บน GitHub ตั้งชื่อว่า `portfolio-plan-helper`
2. อัปโหลดไฟล์ทั้งหมด 8 ไฟล์นี้เข้าสู่ repository
3. ไปที่ **Settings** -> **Pages** -> ในส่วน Source เลือก branch `main` (หรือ `master`) แล้วกด **Save**
4. รอประมาณ 1-2 นาที คุณจะได้ URL เว็บไซต์ เช่น `https://username.github.io/portfolio-plan-helper/`
