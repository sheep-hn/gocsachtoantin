/* =====================================================
   T.R.E.E – Authentication Module
   File: auth.js
   Chức năng: Đăng ký, Đăng nhập, Đăng xuất, Session
   ===================================================== */

/**
 * Đăng nhập
 * @param {string} emailOrId - Email hoặc mã sinh viên
 * @param {string} password
 * @returns {{ok: boolean, msg?: string}}
 */
function login(emailOrId, password) {
  const data = DB.get();
  const user = data.users.find(u =>
    (u.email === emailOrId || u.studentId === emailOrId) &&
    u.password === password &&
    u.status === 'active'
  );

  if (!user) {
    return {
      ok: false,
      msg: 'Email/mã SV hoặc mật khẩu không đúng, hoặc tài khoản bị khóa.'
    };
  }

  state.user = { ...user };
  delete state.user.password;
  localStorage.setItem('tree_session', JSON.stringify(state.user));
  return { ok: true };
}

/**
 * Đăng ký tài khoản mới (mặc định role = student)
 * @param {object} form - {name, email, studentId, phone, password}
 * @returns {{ok: boolean, msg: string}}
 */
function register(form) {
  const data = DB.get();

  if (data.users.some(u => u.email === form.email || u.studentId === form.studentId)) {
    return { ok: false, msg: 'Email hoặc mã sinh viên đã tồn tại.' };
  }

  const user = {
    id: data.nextIds.user++,
    name: form.name,
    email: form.email,
    studentId: form.studentId,
    phone: form.phone || '',
    password: form.password,
    role: 'student',
    status: 'active',
    createdAt: new Date().toISOString().slice(0, 10)
  };

  data.users.push(user);
  DB.save(data);
  return { ok: true, msg: 'Đăng ký thành công! Hãy đăng nhập.' };
}

/** Đăng xuất */
function logout() {
  state.user = null;
  localStorage.removeItem('tree_session');
  state.page = 'dashboard';
  render();
}

/** Kiểm tra đã đăng nhập chưa */
function requireAuth() {
  if (!state.user) {
    state.page = 'auth';
    return false;
  }
  return true;
}

/** Kiểm tra quyền Admin */
function isAdmin() {
  return state.user?.role === 'admin';
}

/** Kiểm tra quyền Tình nguyện viên hoặc Admin */
function isVolunteer() {
  return state.user?.role === 'volunteer' || isAdmin();
}
