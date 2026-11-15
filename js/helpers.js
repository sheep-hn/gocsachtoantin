/* =====================================================
   T.R.E.E – Helper Functions
   File: helpers.js
   ===================================================== */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

/** Hiển thị toast thông báo */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/** Định dạng ngày */
function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN');
}

/**
 * Badge trạng thái
 * @param {string} status
 * @param {'book'|'req'} type
 */
function statusBadge(status, type = 'book') {
  const map = type === 'book'
    ? {
        active:      ['Đang chia sẻ', 'badge-success'],
        pending:     ['Chờ duyệt', 'badge-warning'],
        hidden:      ['Tạm ẩn', 'badge-muted'],
        exhausted:   ['Đã hết', 'badge-muted'],
        transferred: ['Đã trao', 'badge-info'],
        rejected:    ['Từ chối', 'badge-danger']
      }
    : {
        pending:    ['Chờ xác nhận', 'badge-warning'],
        confirmed:  ['Đã xác nhận', 'badge-info'],
        arranging:  ['Đang sắp xếp', 'badge-primary'],
        completed:  ['Đã bàn giao', 'badge-success'],
        rejected:   ['Từ chối', 'badge-danger'],
        cancelled:  ['Đã hủy', 'badge-muted'],
        issue:      ['Có sự cố', 'badge-danger']
      };

  const [label, cls] = map[status] || [status, 'badge-muted'];
  return `<span class="badge ${cls}">${label}</span>`;
}

/** Nhãn vai trò */
function roleLabel(role) {
  return {
    student:   'Sinh viên',
    volunteer: 'Tình nguyện viên',
    admin:     'Quản trị viên'
  }[role] || role;
}

/** Lấy user theo id */
function getUser(id) {
  return DB.get().users.find(u => u.id === id);
}

/** Lấy category theo id */
function getCategory(id) {
  return DB.get().categories.find(c => c.id === id);
}

/** Lấy book theo id */
function getBook(id) {
  return DB.get().books.find(b => b.id === id);
}
