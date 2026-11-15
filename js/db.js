/* =====================================================
   T.R.E.E – Database Layer (localStorage)
   File: db.js
   Mô phỏng cơ sở dữ liệu bằng localStorage
   ===================================================== */

const DB = {
  key: 'tree_goc_sach_v1',

  /** Dữ liệu mặc định khi lần đầu mở app */
  default() {
    return {
      users: [
        {
          id: 1,
          name: 'Admin Hệ thống',
          email: 'admin@toantin.edu.vn',
          studentId: 'ADMIN001',
          phone: '0900000000',
          password: 'admin123',
          role: 'admin',
          status: 'active',
          createdAt: '2025-01-01'
        },
        {
          id: 2,
          name: 'Tô Nhật Minh',
          email: 'minh@toantin.edu.vn',
          studentId: 'SV001',
          phone: '0911111111',
          password: '123456',
          role: 'student',
          status: 'active',
          createdAt: '2025-02-01'
        },
        {
          id: 3,
          name: 'Nguyễn Văn Ngọc Hảo',
          email: 'hao@toantin.edu.vn',
          studentId: 'SV002',
          phone: '0922222222',
          password: '123456',
          role: 'student',
          status: 'active',
          createdAt: '2025-02-01'
        },
        {
          id: 4,
          name: 'Nguyễn Trung Hiếu',
          email: 'hieu@toantin.edu.vn',
          studentId: 'SV003',
          phone: '0933333333',
          password: '123456',
          role: 'volunteer',
          status: 'active',
          createdAt: '2025-02-15'
        }
      ],

      categories: [
        { id: 1, name: 'Toán học', description: 'Giải tích, Đại số, Xác suất...' },
        { id: 2, name: 'Tin học', description: 'Lập trình, Cấu trúc dữ liệu, Cơ sở dữ liệu...' },
        { id: 3, name: 'Vật lý', description: 'Cơ học, Điện từ, Quang học...' },
        { id: 4, name: 'Ngoại ngữ', description: 'Tiếng Anh chuyên ngành...' },
        { id: 5, name: 'Khác', description: 'Sách tham khảo khác' }
      ],

      books: [
        {
          id: 1,
          title: 'Giải tích 1',
          author: 'Nguyễn Đình Trí',
          categoryId: 1,
          description: 'Sách giáo trình giải tích 1, còn rất mới, có ghi chú nhẹ.',
          condition: 'Tốt',
          quantity: 1,
          image: '',
          ownerId: 2,
          status: 'active',
          handover: 'Trực tiếp tại trường',
          createdAt: '2025-09-10'
        },
        {
          id: 2,
          title: 'Cấu trúc dữ liệu & Giải thuật',
          author: 'Đỗ Xuân Lôi',
          categoryId: 2,
          description: 'Sách CSDL & GT, dùng 1 học kỳ, còn đẹp.',
          condition: 'Khá',
          quantity: 1,
          image: '',
          ownerId: 3,
          status: 'active',
          handover: 'Giao tận nơi trong khu A',
          createdAt: '2025-09-15'
        },
        {
          id: 3,
          title: 'Lập trình Python cơ bản',
          author: 'John Zelle',
          categoryId: 2,
          description: 'Sách tiếng Anh, bản dịch, rất hữu ích cho người mới.',
          condition: 'Mới',
          quantity: 2,
          image: '',
          ownerId: 2,
          status: 'active',
          handover: 'Trực tiếp',
          createdAt: '2025-09-20'
        },
        {
          id: 4,
          title: 'Xác suất thống kê',
          author: 'Đào Hữu Hồ',
          categoryId: 1,
          description: 'Sách XSTK, có bài tập giải sẵn.',
          condition: 'Trung bình',
          quantity: 1,
          image: '',
          ownerId: 3,
          status: 'pending',
          handover: 'Trực tiếp',
          createdAt: '2025-10-01'
        }
      ],

      requests: [
        {
          id: 1,
          bookId: 1,
          requesterId: 3,
          message: 'Em cần sách này cho học kỳ tới ạ',
          status: 'pending',
          note: '',
          createdAt: '2025-10-05',
          updatedAt: '2025-10-05'
        }
      ],

      notifications: [],

      nextIds: {
        user: 5,
        book: 5,
        request: 2,
        category: 6
      }
    };
  },

  /** Load dữ liệu từ localStorage */
  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) {
      const data = this.default();
      this.save(data);
      return data;
    }
    return JSON.parse(raw);
  },

  /** Lưu dữ liệu vào localStorage */
  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  /** Lấy dữ liệu hiện tại */
  get() {
    return this.load();
  },

  /** Cập nhật dữ liệu qua hàm callback */
  update(fn) {
    const data = this.load();
    fn(data);
    this.save(data);
    return data;
  }
};
