# T.R.E.E – Hệ thống Quản lý Góc sách Khoa Toán–Tin

**Transfer – Retain – Evolve – Education**

---

## Cấu trúc thư mục (Code chi tiết)

```
TREE-ChiTiet/
├── index.html              ← Trang chính (entry point)
├── css/
│   └── style.css           ← Toàn bộ CSS (layout, component, responsive)
├── js/
│   ├── db.js               ← Database layer (localStorage)
│   ├── helpers.js          ← Hàm tiện ích (toast, badge, format...)
│   ├── auth.js             ← Đăng ký / Đăng nhập / Session / Phân quyền
│   └── app.js              ← Logic chính + render tất cả trang
└── README.md               ← File này
```

---

## Chức năng đã triển khai

| Phân hệ | Chức năng |
|---------|-----------|
| **1. Quản lý tài khoản** | Đăng ký, Đăng nhập, Đăng xuất, Hồ sơ, Đổi mật khẩu |
| **2. Quản lý sách** | Đăng sách, Xem kho, Tìm kiếm/lọc, Chi tiết, Ẩn bài |
| **3. Yêu cầu nhận sách** | Gửi yêu cầu, Hủy, Xác nhận/Từ chối, Bàn giao |
| **4. Tình nguyện viên** | Xem yêu cầu cần hỗ trợ, Xác nhận bàn giao |
| **5. Quản trị** | Duyệt sách, Quản lý tài khoản (khóa/mở, đổi role), Danh mục, Thống kê |
| **Giao diện SQL-like** | Header bảng dạng `SELECT * FROM ...` |

---

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| **Admin** | `admin@toantin.edu.vn` | `admin123` |
| **Sinh viên** | `minh@toantin.edu.vn` | `123456` |
| **Tình nguyện viên** | `hieu@toantin.edu.vn` | `123456` |

---

## Cách chạy

1. Giải nén thư mục
2. Mở file `index.html` bằng trình duyệt (Chrome / Edge / Firefox)
3. Không cần cài đặt server – chạy hoàn toàn phía client
4. Dữ liệu lưu trong **localStorage** của trình duyệt

---

## Công nghệ sử dụng

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid, Responsive)
- JavaScript (ES6+) – Vanilla JS, không dùng framework
- localStorage mô phỏng database

---

## Nhóm thực hiện

- **Tô Nhật Minh** (Leader)
- Nguyễn Văn Ngọc Hảo
- Nguyễn Trung Hiếu
- Nguyễn Tiến Hùng
- Phạm Đỗ Thi Khánh
