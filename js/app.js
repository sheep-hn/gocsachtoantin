/* =====================================================
   T.R.E.E – Main Application
   File: app.js
   Điều hướng, render trang, xử lý sự kiện
   ===================================================== */

// ==================== STATE ====================
let state = {
  user: null,
  page: 'dashboard',
  filters: { q: '', category: '', status: '' },
  modal: null,
  editingBook: null,
  viewingBook: null
};

// ==================== RENDER ROOT ====================
function render() {
  // Khôi phục session nếu có
  const session = localStorage.getItem('tree_session');
  if (session && !state.user) {
    try {
      state.user = JSON.parse(session);
    } catch (e) {}
  }

  if (!state.user) {
    renderAuth();
    return;
  }
  renderApp();
}

// ==================== AUTH PAGE ====================
function renderAuth() {
  $('#app').innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">T</div>
          <div class="logo-text" style="font-size:1.3rem;font-weight:700">
            T.R.E.E <span style="color:#14b8a6">Góc Sách</span>
          </div>
          <p style="color:var(--muted);font-size:0.9rem;margin-top:6px">
            Hệ thống chia sẻ sách Khoa Toán–Tin
          </p>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Đăng nhập</button>
          <button class="auth-tab" data-tab="register">Đăng ký</button>
        </div>
        <div id="authForm"></div>
        <div style="margin-top:20px;padding:12px;background:#f8fafc;border-radius:8px;font-size:0.8rem;color:var(--muted)">
          <strong>Tài khoản demo:</strong><br>
          Admin: admin@toantin.edu.vn / admin123<br>
          Sinh viên: minh@toantin.edu.vn / 123456<br>
          TNV: hieu@toantin.edu.vn / 123456
        </div>
      </div>
    </div>
  `;

  renderAuthForm('login');

  $$('.auth-tab').forEach(t => {
    t.addEventListener('click', () => {
      $$('.auth-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      renderAuthForm(t.dataset.tab);
    });
  });
}

function renderAuthForm(tab) {
  if (tab === 'login') {
    $('#authForm').innerHTML = `
      <form id="loginForm">
        <div class="form-group">
          <label class="form-label">Email hoặc Mã sinh viên</label>
          <input class="form-control" name="email" required placeholder="vd: minh@toantin.edu.vn" />
        </div>
        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <input class="form-control" type="password" name="password" required placeholder="••••••" />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:12px">
          Đăng nhập
        </button>
      </form>
    `;

    $('#loginForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = login(fd.get('email'), fd.get('password'));
      if (res.ok) {
        toast('Đăng nhập thành công!', 'success');
        state.page = 'dashboard';
        render();
      } else {
        toast(res.msg, 'error');
      }
    };
  } else {
    $('#authForm').innerHTML = `
      <form id="registerForm">
        <div class="form-group">
          <label class="form-label">Họ và tên</label>
          <input class="form-control" name="name" required />
        </div>
        <div class="form-group">
          <label class="form-label">Mã sinh viên</label>
          <input class="form-control" name="studentId" required placeholder="SVxxx" />
        </div>
        <div class="form-group">
          <label class="form-label">Email trường</label>
          <input class="form-control" type="email" name="email" required />
        </div>
        <div class="form-group">
          <label class="form-label">Số điện thoại</label>
          <input class="form-control" name="phone" />
        </div>
        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <input class="form-control" type="password" name="password" required minlength="6" />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:12px">
          Đăng ký
        </button>
      </form>
    `;

    $('#registerForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = register(Object.fromEntries(fd));
      if (res.ok) {
        toast(res.msg, 'success');
        $$('.auth-tab')[0].click();
      } else {
        toast(res.msg, 'error');
      }
    };
  }
}

// ==================== APP SHELL ====================
function renderApp() {
  const page = state.page;

  $('#app').innerHTML = `
    <div class="app">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <a class="logo" href="#" onclick="nav('dashboard');return false">
            <div class="logo-icon">T</div>
            <div class="logo-text">T.R.E.E <span>Góc Sách</span></div>
          </a>
        </div>
        <nav class="nav-menu">
          <div class="nav-section">
            <div class="nav-section-title">Chính</div>
            <button class="nav-item ${page === 'dashboard' ? 'active' : ''}" onclick="nav('dashboard')">
              <span class="icon">📊</span> Tổng quan
            </button>
            <button class="nav-item ${page === 'books' ? 'active' : ''}" onclick="nav('books')">
              <span class="icon">📚</span> Kho sách
            </button>
            <button class="nav-item ${page === 'post' ? 'active' : ''}" onclick="nav('post')">
              <span class="icon">➕</span> Đăng sách
            </button>
            <button class="nav-item ${page === 'my-books' ? 'active' : ''}" onclick="nav('my-books')">
              <span class="icon">📖</span> Sách của tôi
            </button>
            <button class="nav-item ${page === 'requests' ? 'active' : ''}" onclick="nav('requests')">
              <span class="icon">📩</span> Yêu cầu nhận
            </button>
          </div>

          ${isVolunteer() ? `
          <div class="nav-section">
            <div class="nav-section-title">Tình nguyện</div>
            <button class="nav-item ${page === 'volunteer' ? 'active' : ''}" onclick="nav('volunteer')">
              <span class="icon">🤝</span> Hỗ trợ bàn giao
            </button>
          </div>` : ''}

          ${isAdmin() ? `
          <div class="nav-section">
            <div class="nav-section-title">Quản trị</div>
            <button class="nav-item ${page === 'admin-books' ? 'active' : ''}" onclick="nav('admin-books')">
              <span class="icon">✅</span> Duyệt sách
            </button>
            <button class="nav-item ${page === 'admin-users' ? 'active' : ''}" onclick="nav('admin-users')">
              <span class="icon">👥</span> Tài khoản
            </button>
            <button class="nav-item ${page === 'admin-categories' ? 'active' : ''}" onclick="nav('admin-categories')">
              <span class="icon">🗂️</span> Danh mục
            </button>
            <button class="nav-item ${page === 'admin-stats' ? 'active' : ''}" onclick="nav('admin-stats')">
              <span class="icon">📈</span> Thống kê
            </button>
          </div>` : ''}

          <div class="nav-section">
            <div class="nav-section-title">Cá nhân</div>
            <button class="nav-item ${page === 'profile' ? 'active' : ''}" onclick="nav('profile')">
              <span class="icon">👤</span> Hồ sơ
            </button>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">${state.user.name.charAt(0)}</div>
            <div class="user-meta">
              <div class="user-name">${state.user.name}</div>
              <div class="user-role">${roleLabel(state.user.role)}</div>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="logout()" title="Đăng xuất">⏻</button>
          </div>
        </div>
      </aside>

      <div class="main">
        <div class="topbar">
          <div class="topbar-left">
            <button class="mobile-menu-btn" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button>
            <h1 class="page-title">${pageTitle(page)}</h1>
          </div>
          <div class="topbar-right">
            <span class="badge badge-primary">${roleLabel(state.user.role)}</span>
          </div>
        </div>
        <div class="content" id="pageContent"></div>
      </div>
    </div>

    <div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
      <div class="modal" id="modal"></div>
    </div>
  `;

  renderPage(page);
}

function pageTitle(p) {
  const map = {
    dashboard:          'Tổng quan hệ thống',
    books:              'Kho sách chia sẻ',
    post:               'Đăng sách mới',
    'my-books':         'Sách của tôi',
    requests:           'Yêu cầu nhận sách',
    volunteer:          'Hỗ trợ bàn giao',
    'admin-books':      'Duyệt bài đăng sách',
    'admin-users':      'Quản lý tài khoản',
    'admin-categories': 'Quản lý danh mục',
    'admin-stats':      'Thống kê & Báo cáo',
    profile:            'Hồ sơ cá nhân'
  };
  return map[p] || 'T.R.E.E';
}

function nav(page) {
  state.page = page;
  state.filters = { q: '', category: '', status: '' };
  document.getElementById('sidebar')?.classList.remove('open');
  render();
}

function renderPage(page) {
  const el = $('#pageContent');
  const pages = {
    dashboard:          renderDashboard,
    books:              renderBooks,
    post:               renderPostBook,
    'my-books':         renderMyBooks,
    requests:           renderRequests,
    volunteer:          renderVolunteer,
    'admin-books':      renderAdminBooks,
    'admin-users':      renderAdminUsers,
    'admin-categories': renderAdminCategories,
    'admin-stats':      renderAdminStats,
    profile:            renderProfile
  };
  (pages[page] || renderDashboard)(el);
}

// ==================== DASHBOARD ====================
function renderDashboard(el) {
  const data = DB.get();
  const myBooks = data.books.filter(b => b.ownerId === state.user.id);
  const myRequests = data.requests.filter(r => r.requesterId === state.user.id);
  const pendingBooks = data.books.filter(b => b.status === 'pending').length;
  const activeBooks = data.books.filter(b => b.status === 'active').length;
  const pendingReqs = data.requests.filter(r => r.status === 'pending').length;

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background:#ccfbf1">📚</div>
        <div><div class="stat-value">${activeBooks}</div><div class="stat-label">Sách đang chia sẻ</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#fef3c7">⏳</div>
        <div><div class="stat-value">${pendingBooks}</div><div class="stat-label">Chờ duyệt</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#dbeafe">📩</div>
        <div><div class="stat-value">${pendingReqs}</div><div class="stat-label">Yêu cầu chờ xử lý</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#e0e7ff">👥</div>
        <div><div class="stat-value">${data.users.filter(u => u.status === 'active').length}</div><div class="stat-label">Người dùng hoạt động</div></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px" class="dash-grid">
      <div class="card">
        <div class="card-header"><div class="card-title">Sách mới đăng gần đây</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Tên sách</th><th>Danh mục</th><th>Trạng thái</th><th>Ngày</th></tr>
              </thead>
              <tbody>
                ${data.books.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map(b => `
                  <tr>
                    <td><strong>${b.title}</strong><br><small style="color:var(--muted)">${b.author}</small></td>
                    <td>${getCategory(b.categoryId)?.name || '—'}</td>
                    <td>${statusBadge(b.status)}</td>
                    <td>${formatDate(b.createdAt)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted)">Chưa có sách</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Hoạt động của bạn</div></div>
        <div class="card-body">
          <p style="margin-bottom:12px"><strong>${myBooks.length}</strong> sách bạn đã đăng</p>
          <p style="margin-bottom:12px"><strong>${myRequests.length}</strong> yêu cầu bạn đã gửi</p>
          <p style="margin-bottom:16px">
            <strong>${data.requests.filter(r => getBook(r.bookId)?.ownerId === state.user.id).length}</strong>
            yêu cầu đến sách của bạn
          </p>
          <button class="btn btn-primary btn-sm" onclick="nav('post')">➕ Đăng sách mới</button>
          <button class="btn btn-secondary btn-sm" onclick="nav('books')" style="margin-left:8px">📚 Xem kho sách</button>
        </div>
      </div>
    </div>
  `;
}

// ==================== BOOKS LIST ====================
function renderBooks(el) {
  const data = DB.get();
  let books = data.books.filter(b => b.status === 'active' || (isAdmin() && b.status !== 'hidden'));

  if (state.filters.q) {
    const q = state.filters.q.toLowerCase();
    books = books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q)
    );
  }
  if (state.filters.category) {
    books = books.filter(b => b.categoryId == state.filters.category);
  }

  el.innerHTML = `
    <div class="search-bar">
      <input class="form-control" id="searchQ" placeholder="🔍 Tìm tên sách, tác giả..." value="${state.filters.q}" />
      <select class="form-control" id="filterCat" style="max-width:180px">
        <option value="">Tất cả danh mục</option>
        ${data.categories.map(c => `
          <option value="${c.id}" ${state.filters.category == c.id ? 'selected' : ''}>${c.name}</option>
        `).join('')}
      </select>
      <button class="btn btn-primary" onclick="applyBookFilters()">Lọc</button>
      <button class="btn btn-secondary" onclick="state.filters={q:'',category:'',status:''};nav('books')">Xóa lọc</button>
    </div>

    <div class="books-grid">
      ${books.length ? books.map(b => {
        const owner = getUser(b.ownerId);
        const cat = getCategory(b.categoryId);
        return `
          <div class="book-card" onclick="viewBook(${b.id})">
            <div class="book-cover">
              📘
              <div class="status-badge">${statusBadge(b.status)}</div>
            </div>
            <div class="book-body">
              <div class="book-title">${b.title}</div>
              <div class="book-author">${b.author}</div>
              <div class="book-meta">
                <span class="badge badge-primary">${cat?.name || '—'}</span>
                <span class="badge badge-muted">${b.condition}</span>
                <span class="badge badge-info">SL: ${b.quantity}</span>
              </div>
              <div class="book-footer">
                <span>${owner?.name || '—'}</span>
                <span>${formatDate(b.createdAt)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('') : `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="emoji">📭</div>
          <p>Không tìm thấy sách phù hợp</p>
        </div>
      `}
    </div>
  `;
}

function applyBookFilters() {
  state.filters.q = $('#searchQ')?.value || '';
  state.filters.category = $('#filterCat')?.value || '';
  renderPage('books');
}

function viewBook(id) {
  state.viewingBook = id;
  openModal(renderBookDetail(id));
}

function renderBookDetail(id) {
  const b = getBook(id);
  if (!b) return '<p>Không tìm thấy sách</p>';

  const owner = getUser(b.ownerId);
  const cat = getCategory(b.categoryId);
  const isOwner = state.user.id === b.ownerId;
  const canRequest = !isOwner && b.status === 'active' && b.quantity > 0;

  return `
    <div class="modal-header">
      <div class="modal-title">${b.title}</div>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:20px;margin-bottom:20px">
        <div style="width:100px;height:120px;background:linear-gradient(135deg,#ccfbf1,#99f6e4);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;flex-shrink:0">📘</div>
        <div>
          <p style="color:var(--muted);margin-bottom:6px">${b.author}</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
            ${statusBadge(b.status)}
            <span class="badge badge-primary">${cat?.name}</span>
            <span class="badge badge-muted">${b.condition}</span>
          </div>
          <p style="font-size:0.9rem"><strong>Số lượng còn:</strong> ${b.quantity}</p>
          <p style="font-size:0.9rem"><strong>Hình thức bàn giao:</strong> ${b.handover || '—'}</p>
          <p style="font-size:0.9rem"><strong>Người chia sẻ:</strong> ${owner?.name} (${owner?.studentId})</p>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Mô tả</label>
        <p style="font-size:0.95rem;color:var(--muted)">${b.description || 'Không có mô tả'}</p>
      </div>
      ${canRequest ? `
        <div class="form-group">
          <label class="form-label">Lời nhắn khi yêu cầu</label>
          <textarea class="form-control" id="reqMessage" placeholder="Xin chào, mình muốn nhận cuốn sách này..."></textarea>
        </div>
      ` : ''}
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Đóng</button>
      ${canRequest ? `<button class="btn btn-primary" onclick="sendRequest(${b.id})">📩 Gửi yêu cầu nhận sách</button>` : ''}
      ${isOwner ? `<button class="btn btn-secondary" onclick="closeModal();nav('my-books')">Quản lý sách của tôi</button>` : ''}
    </div>
  `;
}

function sendRequest(bookId) {
  const msg = $('#reqMessage')?.value || '';
  const data = DB.get();
  const book = data.books.find(b => b.id === bookId);

  if (!book || book.quantity < 1) {
    toast('Sách đã hết', 'error');
    return;
  }

  if (data.requests.some(r =>
    r.bookId === bookId &&
    r.requesterId === state.user.id &&
    !['cancelled', 'rejected', 'completed'].includes(r.status)
  )) {
    toast('Bạn đã gửi yêu cầu cho sách này rồi', 'error');
    return;
  }

  data.requests.push({
    id: data.nextIds.request++,
    bookId,
    requesterId: state.user.id,
    message: msg,
    status: 'pending',
    note: '',
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10)
  });

  DB.save(data);
  toast('Đã gửi yêu cầu nhận sách!', 'success');
  closeModal();
  if (state.page === 'requests') renderPage('requests');
}

// ==================== POST BOOK ====================
function renderPostBook(el) {
  const data = DB.get();

  el.innerHTML = `
    <div class="card" style="max-width:640px">
      <div class="card-header"><div class="card-title">📝 Đăng sách muốn chia sẻ</div></div>
      <div class="card-body">
        <form id="postBookForm">
          <div class="form-group">
            <label class="form-label">Tên sách *</label>
            <input class="form-control" name="title" required placeholder="Ví dụ: Giải tích 1" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tác giả *</label>
              <input class="form-control" name="author" required />
            </div>
            <div class="form-group">
              <label class="form-label">Danh mục *</label>
              <select class="form-control" name="categoryId" required>
                ${data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" name="description" placeholder="Tình trạng sách, ghi chú thêm..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tình trạng sách</label>
              <select class="form-control" name="condition">
                <option>Mới</option>
                <option>Tốt</option>
                <option selected>Khá</option>
                <option>Trung bình</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Số lượng</label>
              <input class="form-control" type="number" name="quantity" value="1" min="1" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Hình thức bàn giao</label>
            <input class="form-control" name="handover" placeholder="Trực tiếp tại trường / Giao tận nơi..." />
          </div>
          <button type="submit" class="btn btn-primary">Đăng sách (chờ duyệt)</button>
        </form>
      </div>
    </div>
  `;

  $('#postBookForm').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    DB.update(data => {
      data.books.push({
        id: data.nextIds.book++,
        title: fd.get('title'),
        author: fd.get('author'),
        categoryId: +fd.get('categoryId'),
        description: fd.get('description'),
        condition: fd.get('condition'),
        quantity: +fd.get('quantity') || 1,
        handover: fd.get('handover'),
        image: '',
        ownerId: state.user.id,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10)
      });
    });

    toast('Đã đăng sách! Chờ quản trị viên duyệt.', 'success');
    nav('my-books');
  };
}

// ==================== MY BOOKS ====================
function renderMyBooks(el) {
  const data = DB.get();
  const books = data.books.filter(b => b.ownerId === state.user.id);

  el.innerHTML = `
    <div class="card">
      <div class="sql-header">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span style="margin-left:8px">SELECT * FROM books WHERE owner_id = ${state.user.id}</span>
      </div>
      <div class="card-header">
        <div class="card-title">Sách tôi đã đăng (${books.length})</div>
        <button class="btn btn-primary btn-sm" onclick="nav('post')">➕ Đăng mới</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Tên sách</th><th>Danh mục</th><th>SL</th>
              <th>Trạng thái</th><th>Ngày đăng</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${books.length ? books.map(b => `
              <tr>
                <td class="mono">#${b.id}</td>
                <td><strong>${b.title}</strong><br><small style="color:var(--muted)">${b.author}</small></td>
                <td>${getCategory(b.categoryId)?.name || '—'}</td>
                <td>${b.quantity}</td>
                <td>${statusBadge(b.status)}</td>
                <td>${formatDate(b.createdAt)}</td>
                <td>
                  <button class="btn btn-sm btn-secondary" onclick="viewBook(${b.id})">Xem</button>
                  ${b.status !== 'hidden' ? `<button class="btn btn-sm btn-danger" onclick="hideMyBook(${b.id})">Ẩn</button>` : ''}
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7">
                  <div class="empty-state"><div class="emoji">📭</div><p>Bạn chưa đăng sách nào</p></div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function hideMyBook(id) {
  if (!confirm('Ẩn bài đăng này?')) return;
  DB.update(data => {
    const b = data.books.find(x => x.id === id && x.ownerId === state.user.id);
    if (b) b.status = 'hidden';
  });
  toast('Đã ẩn bài đăng', 'success');
  renderPage('my-books');
}

// ==================== REQUESTS ====================
function renderRequests(el) {
  const data = DB.get();
  const sent = data.requests.filter(r => r.requesterId === state.user.id);
  const received = data.requests.filter(r => getBook(r.bookId)?.ownerId === state.user.id);

  el.innerHTML = `
    <div style="display:grid;gap:24px">
      <div class="card">
        <div class="sql-header">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
          <span style="margin-left:8px">SELECT * FROM requests WHERE requester_id = ${state.user.id}</span>
        </div>
        <div class="card-header"><div class="card-title">Yêu cầu tôi đã gửi (${sent.length})</div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>ID</th><th>Sách</th><th>Người chia sẻ</th><th>Trạng thái</th><th>Ngày</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              ${sent.length ? sent.map(r => {
                const b = getBook(r.bookId);
                const owner = getUser(b?.ownerId);
                return `
                  <tr>
                    <td class="mono">#${r.id}</td>
                    <td><strong>${b?.title || '—'}</strong></td>
                    <td>${owner?.name || '—'}</td>
                    <td>${statusBadge(r.status, 'req')}</td>
                    <td>${formatDate(r.createdAt)}</td>
                    <td>
                      ${r.status === 'pending'
                        ? `<button class="btn btn-sm btn-danger" onclick="cancelRequest(${r.id})">Hủy</button>`
                        : '—'}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">Chưa gửi yêu cầu nào</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="sql-header">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
          <span style="margin-left:8px">SELECT * FROM requests JOIN books ON ... WHERE owner_id = ${state.user.id}</span>
        </div>
        <div class="card-header"><div class="card-title">Yêu cầu đến sách của tôi (${received.length})</div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>ID</th><th>Sách</th><th>Người yêu cầu</th><th>Lời nhắn</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              ${received.length ? received.map(r => {
                const b = getBook(r.bookId);
                const requester = getUser(r.requesterId);
                return `
                  <tr>
                    <td class="mono">#${r.id}</td>
                    <td><strong>${b?.title || '—'}</strong></td>
                    <td>${requester?.name || '—'}<br><small>${requester?.studentId || ''}</small></td>
                    <td style="max-width:180px">${r.message || '—'}</td>
                    <td>${statusBadge(r.status, 'req')}</td>
                    <td>
                      ${r.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="respondRequest(${r.id},'confirmed')">Xác nhận</button>
                        <button class="btn btn-sm btn-danger" onclick="respondRequest(${r.id},'rejected')">Từ chối</button>
                      ` : r.status === 'confirmed' ? `
                        <button class="btn btn-sm btn-primary" onclick="respondRequest(${r.id},'completed')">Đã bàn giao</button>
                      ` : '—'}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">Chưa có yêu cầu nào</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function cancelRequest(id) {
  DB.update(data => {
    const r = data.requests.find(x => x.id === id && x.requesterId === state.user.id);
    if (r && r.status === 'pending') {
      r.status = 'cancelled';
      r.updatedAt = new Date().toISOString().slice(0, 10);
    }
  });
  toast('Đã hủy yêu cầu', 'success');
  renderPage('requests');
}

function respondRequest(id, status) {
  DB.update(data => {
    const r = data.requests.find(x => x.id === id);
    if (!r) return;

    const book = data.books.find(b => b.id === r.bookId);
    if (book?.ownerId !== state.user.id && !isAdmin()) return;

    r.status = status;
    r.updatedAt = new Date().toISOString().slice(0, 10);

    if (status === 'completed' && book) {
      book.quantity = Math.max(0, book.quantity - 1);
      if (book.quantity === 0) book.status = 'transferred';
    }
  });

  const msg = status === 'confirmed' ? 'Đã xác nhận yêu cầu'
            : status === 'rejected'  ? 'Đã từ chối'
            : 'Đã ghi nhận bàn giao';
  toast(msg, 'success');
  renderPage(state.page);
}

// ==================== VOLUNTEER ====================
function renderVolunteer(el) {
  const data = DB.get();
  const activeReqs = data.requests.filter(r => ['confirmed', 'arranging'].includes(r.status));

  el.innerHTML = `
    <div class="alert alert-info">
      🤝 Bạn đang ở vai trò Tình nguyện viên / Admin. Hỗ trợ thống nhất lịch và xác nhận bàn giao.
    </div>
    <div class="card">
      <div class="sql-header">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span style="margin-left:8px">SELECT * FROM requests WHERE status IN ('confirmed','arranging')</span>
      </div>
      <div class="card-header"><div class="card-title">Yêu cầu cần hỗ trợ bàn giao</div></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Sách</th><th>Người nhận</th><th>Người chia sẻ</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            ${activeReqs.length ? activeReqs.map(r => {
              const b = getBook(r.bookId);
              const req = getUser(r.requesterId);
              const owner = getUser(b?.ownerId);
              return `
                <tr>
                  <td class="mono">#${r.id}</td>
                  <td>${b?.title || '—'}</td>
                  <td>${req?.name || '—'}</td>
                  <td>${owner?.name || '—'}</td>
                  <td>${statusBadge(r.status, 'req')}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="respondRequest(${r.id},'completed')">
                      Xác nhận đã bàn giao
                    </button>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">Không có yêu cầu cần hỗ trợ</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==================== ADMIN BOOKS ====================
function renderAdminBooks(el) {
  if (!isAdmin()) {
    el.innerHTML = '<div class="alert alert-error">Bạn không có quyền truy cập</div>';
    return;
  }

  const data = DB.get();
  const books = data.books.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  el.innerHTML = `
    <div class="card">
      <div class="sql-header">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span style="margin-left:8px">SELECT * FROM books ORDER BY created_at DESC</span>
      </div>
      <div class="card-header"><div class="card-title">Tất cả bài đăng sách (${books.length})</div></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Tên sách</th><th>Người đăng</th><th>Danh mục</th><th>Trạng thái</th><th>Ngày</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            ${books.map(b => {
              const owner = getUser(b.ownerId);
              return `
                <tr>
                  <td class="mono">#${b.id}</td>
                  <td><strong>${b.title}</strong><br><small>${b.author}</small></td>
                  <td>${owner?.name || '—'}</td>
                  <td>${getCategory(b.categoryId)?.name || '—'}</td>
                  <td>${statusBadge(b.status)}</td>
                  <td>${formatDate(b.createdAt)}</td>
                  <td>
                    ${b.status === 'pending' ? `
                      <button class="btn btn-sm btn-success" onclick="moderateBook(${b.id},'active')">Duyệt</button>
                      <button class="btn btn-sm btn-danger" onclick="moderateBook(${b.id},'rejected')">Từ chối</button>
                    ` : b.status === 'active' ? `
                      <button class="btn btn-sm btn-danger" onclick="moderateBook(${b.id},'hidden')">Ẩn</button>
                    ` : (b.status === 'hidden' || b.status === 'rejected') ? `
                      <button class="btn btn-sm btn-success" onclick="moderateBook(${b.id},'active')">Mở lại</button>
                    ` : '—'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function moderateBook(id, status) {
  DB.update(data => {
    const b = data.books.find(x => x.id === id);
    if (b) b.status = status;
  });
  const msg = status === 'active' ? 'Đã duyệt bài đăng'
            : status === 'rejected' ? 'Đã từ chối'
            : 'Đã ẩn bài';
  toast(msg, 'success');
  renderPage('admin-books');
}

// ==================== ADMIN USERS ====================
function renderAdminUsers(el) {
  if (!isAdmin()) {
    el.innerHTML = '<div class="alert alert-error">Bạn không có quyền</div>';
    return;
  }

  const data = DB.get();

  el.innerHTML = `
    <div class="card">
      <div class="sql-header">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span style="margin-left:8px">SELECT id, name, email, role, status FROM users</span>
      </div>
      <div class="card-header"><div class="card-title">Danh sách tài khoản (${data.users.length})</div></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Họ tên</th><th>Email / Mã SV</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            ${data.users.map(u => `
              <tr>
                <td class="mono">#${u.id}</td>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}<br><small class="mono">${u.studentId}</small></td>
                <td><span class="badge badge-primary">${roleLabel(u.role)}</span></td>
                <td>
                  ${u.status === 'active'
                    ? '<span class="badge badge-success">Hoạt động</span>'
                    : '<span class="badge badge-danger">Đã khóa</span>'}
                </td>
                <td>
                  ${u.id !== state.user.id ? `
                    ${u.status === 'active'
                      ? `<button class="btn btn-sm btn-danger" onclick="toggleUser(${u.id},'locked')">Khóa</button>`
                      : `<button class="btn btn-sm btn-success" onclick="toggleUser(${u.id},'active')">Mở khóa</button>`}
                    <select class="form-control" style="width:auto;display:inline-block;padding:4px 8px;font-size:0.8rem"
                            onchange="changeRole(${u.id}, this.value)">
                      <option value="student" ${u.role === 'student' ? 'selected' : ''}>Sinh viên</option>
                      <option value="volunteer" ${u.role === 'volunteer' ? 'selected' : ''}>TNV</option>
                      <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                  ` : '<span class="badge badge-muted">Bạn</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function toggleUser(id, status) {
  DB.update(data => {
    const u = data.users.find(x => x.id === id);
    if (u) u.status = status;
  });
  toast(status === 'locked' ? 'Đã khóa tài khoản' : 'Đã mở khóa', 'success');
  renderPage('admin-users');
}

function changeRole(id, role) {
  DB.update(data => {
    const u = data.users.find(x => x.id === id);
    if (u) u.role = role;
  });
  toast('Đã cập nhật vai trò', 'success');
  renderPage('admin-users');
}

// ==================== ADMIN CATEGORIES ====================
function renderAdminCategories(el) {
  if (!isAdmin()) {
    el.innerHTML = '<div class="alert alert-error">Bạn không có quyền</div>';
    return;
  }

  const data = DB.get();

  el.innerHTML = `
    <div class="card" style="margin-bottom:20px;max-width:480px">
      <div class="card-header"><div class="card-title">Thêm danh mục mới</div></div>
      <div class="card-body">
        <form id="addCatForm" style="display:flex;gap:10px;flex-wrap:wrap">
          <input class="form-control" name="name" required placeholder="Tên danh mục" style="flex:1;min-width:160px" />
          <input class="form-control" name="description" placeholder="Mô tả" style="flex:1;min-width:160px" />
          <button type="submit" class="btn btn-primary">Thêm</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="sql-header">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span style="margin-left:8px">SELECT * FROM categories</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Tên</th><th>Mô tả</th><th>Số sách</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            ${data.categories.map(c => {
              const count = data.books.filter(b => b.categoryId === c.id).length;
              return `
                <tr>
                  <td class="mono">#${c.id}</td>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.description || '—'}</td>
                  <td>${count}</td>
                  <td>
                    ${count === 0
                      ? `<button class="btn btn-sm btn-danger" onclick="deleteCategory(${c.id})">Xóa</button>`
                      : '<span class="badge badge-muted">Đang dùng</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  $('#addCatForm').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    DB.update(data => {
      if (data.categories.some(c => c.name.toLowerCase() === fd.get('name').toLowerCase())) {
        toast('Tên danh mục đã tồn tại', 'error');
        return;
      }
      data.categories.push({
        id: data.nextIds.category++,
        name: fd.get('name'),
        description: fd.get('description')
      });
      toast('Đã thêm danh mục', 'success');
    });

    renderPage('admin-categories');
  };
}

function deleteCategory(id) {
  if (!confirm('Xóa danh mục này?')) return;
  DB.update(data => {
    data.categories = data.categories.filter(c => c.id !== id);
  });
  toast('Đã xóa danh mục', 'success');
  renderPage('admin-categories');
}

// ==================== ADMIN STATS ====================
function renderAdminStats(el) {
  if (!isAdmin()) {
    el.innerHTML = '<div class="alert alert-error">Bạn không có quyền</div>';
    return;
  }

  const data = DB.get();
  const byCat = data.categories.map(c => ({
    name: c.name,
    count: data.books.filter(b => b.categoryId === c.id).length
  }));

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background:#ccfbf1">📚</div>
        <div><div class="stat-value">${data.books.length}</div><div class="stat-label">Tổng bài đăng</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#d1fae5">✅</div>
        <div><div class="stat-value">${data.books.filter(b => b.status === 'active').length}</div><div class="stat-label">Đang chia sẻ</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#dbeafe">📩</div>
        <div><div class="stat-value">${data.requests.length}</div><div class="stat-label">Tổng yêu cầu</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#e0e7ff">👥</div>
        <div><div class="stat-value">${data.users.length}</div><div class="stat-label">Tài khoản</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#fef3c7">🤝</div>
        <div><div class="stat-value">${data.users.filter(u => u.role === 'volunteer').length}</div><div class="stat-label">Tình nguyện viên</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#fce7f3">🔄</div>
        <div><div class="stat-value">${data.requests.filter(r => r.status === 'completed').length}</div><div class="stat-label">Đã bàn giao</div></div>
      </div>
    </div>

    <div class="card">
      <div class="sql-header">
        <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        <span style="margin-left:8px">SELECT category, COUNT(*) FROM books GROUP BY category</span>
      </div>
      <div class="card-header"><div class="card-title">Thống kê theo danh mục</div></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Danh mục</th><th>Số lượng sách</th><th>Tỷ lệ</th></tr></thead>
          <tbody>
            ${byCat.map(c => {
              const pct = data.books.length ? Math.round(c.count / data.books.length * 100) : 0;
              return `
                <tr>
                  <td>${c.name}</td>
                  <td>${c.count}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="flex:1;height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden">
                        <div style="width:${pct}%;height:100%;background:var(--primary)"></div>
                      </div>
                      <span style="font-size:0.8rem;color:var(--muted)">${pct}%</span>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==================== PROFILE ====================
function renderProfile(el) {
  const u = state.user;

  el.innerHTML = `
    <div class="card" style="max-width:520px">
      <div class="card-header"><div class="card-title">👤 Hồ sơ cá nhân</div></div>
      <div class="card-body">
        <form id="profileForm">
          <div class="form-group">
            <label class="form-label">Họ và tên</label>
            <input class="form-control" name="name" value="${u.name}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-control" value="${u.email}" disabled />
            <div class="form-hint">Email không thể thay đổi</div>
          </div>
          <div class="form-group">
            <label class="form-label">Mã sinh viên</label>
            <input class="form-control" value="${u.studentId}" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Số điện thoại</label>
            <input class="form-control" name="phone" value="${u.phone || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Vai trò</label>
            <input class="form-control" value="${roleLabel(u.role)}" disabled />
          </div>
          <button type="submit" class="btn btn-primary">Cập nhật hồ sơ</button>
        </form>

        <hr style="margin:24px 0;border:none;border-top:1px solid var(--border)" />

        <h4 style="margin-bottom:12px">Đổi mật khẩu</h4>
        <form id="passForm">
          <div class="form-group">
            <label class="form-label">Mật khẩu hiện tại</label>
            <input class="form-control" type="password" name="current" required />
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu mới</label>
            <input class="form-control" type="password" name="newpass" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-secondary">Đổi mật khẩu</button>
        </form>
      </div>
    </div>
  `;

  $('#profileForm').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    DB.update(data => {
      const user = data.users.find(x => x.id === state.user.id);
      if (user) {
        user.name = fd.get('name');
        user.phone = fd.get('phone');
      }
    });

    state.user.name = fd.get('name');
    state.user.phone = fd.get('phone');
    localStorage.setItem('tree_session', JSON.stringify(state.user));
    toast('Đã cập nhật hồ sơ', 'success');
    render();
  };

  $('#passForm').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = DB.get();
    const user = data.users.find(x => x.id === state.user.id);

    if (!user || user.password !== fd.get('current')) {
      toast('Mật khẩu hiện tại không đúng', 'error');
      return;
    }

    user.password = fd.get('newpass');
    DB.save(data);
    toast('Đã đổi mật khẩu thành công', 'success');
    e.target.reset();
  };
}

// ==================== MODAL ====================
function openModal(html) {
  $('#modal').innerHTML = html;
  $('#modalOverlay').classList.add('show');
}

function closeModal() {
  $('#modalOverlay').classList.remove('show');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', render);
