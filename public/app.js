'use strict';

/* ============ 图标 ============ */
const S = (inner, vb) => '<svg viewBox="' + (vb || '0 0 24 24') + '" fill="none">' + inner + '</svg>';

const ICONS = {
  crest: S('<path d="M12 2 L21 5.2 V12 C21 16.9 16.9 20.7 12 22 C7.1 20.7 3 16.9 3 12 V5.2 Z" fill="#2C2015"/>' +
    '<path d="M12 7 L13.5 10.6 L17.3 11 L14.4 13.6 L15.3 17.3 L12 15.2 L8.7 17.3 L9.6 13.6 L6.7 11 L10.5 10.6 Z" fill="#C9A227"/>'),
  calendar: S('<rect x="3.5" y="5" width="17" height="16" rx="3" stroke="#7A6448" stroke-width="1.8"/><path d="M3.5 10 H20.5 M8.5 3 V7 M15.5 3 V7" stroke="#7A6448" stroke-width="1.8" stroke-linecap="round"/>'),
  star: S('<path d="M12 3.5 L14.6 9.4 L21 10.3 L16.3 14.9 L17.5 21.2 L12 18.1 L6.5 21.2 L7.7 14.9 L3 10.3 L9.4 9.4 Z" fill="#C9A227"/>'),
  check: S('<path d="M4 12.5 L9 17.5 L20 6.5" stroke="#7A6448" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  trophy: S('<path d="M7 4 H17 V9 C17 11.8 14.8 14 12 14 C9.2 14 7 11.8 7 9 Z" stroke="#7A6448" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 6 H4.5 V7.5 C4.5 9 5.5 10 7 10.2 M17 6 H19.5 V7.5 C19.5 9 18.5 10 17 10.2" stroke="#7A6448" stroke-width="1.8" stroke-linecap="round"/><path d="M10 14 V17 H14 V14 M8.5 20 H15.5" stroke="#7A6448" stroke-width="1.8" stroke-linecap="round"/>'),
  lock: S('<rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke="#7A6448" stroke-width="1.8"/><path d="M8.5 10.5 V7.8 C8.5 5.9 10.1 4.3 12 4.3 C13.9 4.3 15.5 5.9 15.5 7.8 V10.5" stroke="#7A6448" stroke-width="1.8" stroke-linecap="round"/>'),
  swap: S('<path d="M4.5 8.2 H17.5 M14 4.6 L17.8 8.2 L14 11.8" stroke="#7A6448" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M19.5 15.8 H6.5 M10 12.2 L6.2 15.8 L10 19.4" stroke="#7A6448" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'),
  plus: S('<path d="M12 5 V19 M5 12 H19" stroke="#B49B6C" stroke-width="2" stroke-linecap="round"/>'),
  book: S('<path d="M12 6.5 C10.8 5.4 9 5 6.6 5 C5.7 5 5 5.7 5 6.6 V18 C5 18.6 5.5 19 6.1 19 C8.4 19 10.6 19.4 12 20.4 C13.4 19.4 15.6 19 17.9 19 C18.5 19 19 18.6 19 18 V6.6 C19 5.7 18.3 5 17.4 5 C15 5 13.2 5.4 12 6.5 Z" stroke="#7A6448" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 6.5 V20.4" stroke="#7A6448" stroke-width="1.8" stroke-linecap="round"/>'),
  houseRaven: S('<path d="M12 2 L21 5.2 V12 C21 16.9 16.9 20.7 12 22 C7.1 20.7 3 16.9 3 12 V5.2 Z" fill="#33506F"/><path d="M12 7.4 C10.7 6.5 8.8 6.3 7.7 6.5 V16.6 C8.8 16.4 10.7 16.6 12 17.5 C13.3 16.6 15.2 16.4 16.3 16.6 V6.5 C15.2 6.3 13.3 6.5 12 7.4 Z" fill="#EFE0BC"/><path d="M12 7.4 V17.5" stroke="#33506F" stroke-width="1"/>'),
  houseGryf: S('<path d="M12 2 L21 5.2 V12 C21 16.9 16.9 20.7 12 22 C7.1 20.7 3 16.9 3 12 V5.2 Z" fill="#9A3324"/><path d="M13.6 6.4 L8.6 12.6 H11.6 L10.4 17.6 L15.4 11.4 H12.4 Z" fill="#EFE0BC"/>'),
  houseSlyth: S('<path d="M12 2 L21 5.2 V12 C21 16.9 16.9 20.7 12 22 C7.1 20.7 3 16.9 3 12 V5.2 Z" fill="#2F6B4F"/>' +
    '<path d="M16.4 6.8 C16.4 8.8 13.9 9.4 12.3 9.4 C10.3 9.4 8.7 10.2 8.7 12 C8.7 13.8 10.5 14.4 12.3 14.4 C14.3 14.4 15.5 15.4 15.5 16.9 C15.5 18.3 14.5 19.3 13 19.5" stroke="#EFE0BC" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '<circle cx="16.8" cy="5.6" r="1.7" fill="#EFE0BC"/>'),
  houseHuff: S('<path d="M12 2 L21 5.2 V12 C21 16.9 16.9 20.7 12 22 C7.1 20.7 3 16.9 3 12 V5.2 Z" fill="#B77A12"/>' +
    '<path d="M12 5.6 C8.4 5.6 6.2 8.5 6.2 12.2 C6.2 15.9 8.5 18.5 12 18.5 C15.5 18.5 17.8 15.9 17.8 12.2 C17.8 8.5 15.6 5.6 12 5.6 Z" fill="#EFE0BC"/>' +
    '<path d="M9.5 6.1 C9.5 8.3 9.9 10.6 10.7 12.7 C11.3 14.5 11.7 16.6 11.7 18.4" stroke="#B77A12" stroke-width="1.4" fill="none"/>' +
    '<path d="M14.5 6.1 C14.5 8.3 14.1 10.6 13.3 12.7 C12.7 14.5 12.3 16.6 12.3 18.4" stroke="#B77A12" stroke-width="1.4" fill="none"/>' +
    '<circle cx="12" cy="15.5" r="1.5" fill="#B77A12"/>'),
};

// 任务小图标：34x34 圆角底 + 线稿
const TILE = {
  book: ['#DCE6F0', '#33506F', '<path d="M4 6.2 C4 5.5 4.6 5 5.3 5 H9.6 V19 H5.3 C4.6 19 4 18.5 4 17.8 Z"/><path d="M20 6.2 C20 5.5 19.4 5 18.7 5 H14.4 V19 H18.7 C19.4 19 20 18.5 20 17.8 Z"/>'],
  clarinet: ['#DCE6F0', '#33506F', '<path d="M10 17.5 V6.5 L18.5 4.5 V15"/><ellipse cx="7.4" cy="17.7" rx="2.7" ry="2.3"/><ellipse cx="15.9" cy="15.2" rx="2.7" ry="2.3"/>'],
  brush: ['#E6DCEF', '#5B4A78', '<path d="M5.2 18.8 L6.6 15.2 L16.9 4.9 C17.8 4 19.2 4 20.1 4.9 C21 5.8 21 7.2 20.1 8.1 L9.8 18.4 Z"/><path d="M15.1 6.7 L17.9 9.5"/>'],
  note: ['#D9E6DC', '#2F5D50', '<path d="M5 6.2 C5 5.5 5.6 5 6.3 5 H10.4 V19 H6.3 C5.6 19 5 18.5 5 17.8 Z"/><path d="M19 6.2 C19 5.5 18.4 5 17.7 5 H13.6 V19 H17.7 C18.4 19 19 18.5 19 17.8 Z"/>'],
  bag: ['#F2E5C2', '#8A6A1F', '<path d="M6.5 9.5 C6.5 8 7.6 6.9 9.1 6.9 H14.9 C16.4 6.9 17.5 8 17.5 9.5 V18.5 C17.5 19.1 17 19.6 16.4 19.6 H7.6 C7 19.6 6.5 19.1 6.5 18.5 Z"/><path d="M9.8 6.9 V5.4 C9.8 4.3 10.8 3.4 12 3.4 C13.2 3.4 14.2 4.3 14.2 5.4 V6.9"/>'],
  moon: ['#DEE3EA', '#4A5A6B', '<path d="M19 15.2 C18 16.3 16.6 17 15 17 C11.8 17 9.2 14.4 9.2 11.2 C9.2 9.6 9.8 8.2 10.9 7.2 C7.7 7.4 5.2 10 5.2 13.3 C5.2 16.8 8 19.6 11.5 19.6 C14.8 19.6 17.4 17.1 17.5 13.8 C18 14.4 18.6 14.9 19 15.2 Z"/>'],
  soccer: ['#F5DED8', '#9A3324', '<circle cx="12" cy="12" r="8.6"/><path d="M12 4.9 L15.1 8.3 L13.4 12.9 H10.6 L8.9 8.3 Z"/><path d="M12 20.4 V16 M7.2 14.6 L4.6 16.8 M16.8 14.6 L19.4 16.8"/>'],
  drum: ['#F2E5C2', '#8A6A1F', '<ellipse cx="12" cy="9.5" rx="7" ry="2.9"/><path d="M5 9.5 V15 C5 16.7 8.1 18 12 18 C15.9 18 19 16.7 19 15 V9.5"/><path d="M4.2 5.8 L8.4 8.4 M19.8 5.8 L15.6 8.4"/>'],
  climb: ['#D9E6DC', '#2F5D50', '<path d="M3 19.2 L9.6 7 L13.6 13.6 L16 10 L21 19.2 Z"/>'],
  toybox: ['#E6DCEF', '#5B4A78', '<path d="M3.6 8.6 L12 4.6 L20.4 8.6 V17.4 L12 21.4 L3.6 17.4 Z"/><path d="M3.6 8.6 L12 12.6 L20.4 8.6 M12 12.6 V21.4"/>'],
  star: ['#F0DFB4', '#8A6A1F', '<path d="M12 4 L14.5 9.5 L20.5 10.3 L16 14.3 L17.2 20.2 L12 17.3 L6.8 20.2 L8 14.3 L3.5 10.3 L9.5 9.5 Z"/>'],
  // —— 新增：英语 / AMC 数学 / Scholastic / 收拾桌子 / 网球 ——
  globe: ['#DCE6F0', '#33506F', '<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12 H20.4"/><path d="M12 3.6 C14.8 6.4 16.2 9.2 16.2 12 C16.2 14.8 14.8 17.6 12 20.4 C9.2 17.6 7.8 14.8 7.8 12 C7.8 9.2 9.2 6.4 12 3.6 Z"/>'],
  math: ['#E6DCEF', '#5B4A78', '<rect x="4" y="4" width="16" height="16" rx="2.6"/><path d="M8 9 H16 M8 12.4 H16 M8 15.8 H16 M12.6 9 V15.8"/>'],
  scholastic: ['#D9E6DC', '#2F5D50', '<path d="M6 5.5 H16.5 C17.6 5.5 18.5 6.4 18.5 7.5 V18.5 H7.5 C6.4 18.5 5.5 17.6 5.5 16.5 V5.5 Z"/><path d="M8.5 9 H15 M8.5 12 H13"/>'],
  table: ['#F2E5C2', '#8A6A1F', '<path d="M4 10 H20"/><path d="M5.6 10 V19 M18.4 10 V19"/><path d="M8 6.6 C8 5.4 9 5 10 5 H14 C15 5 16 5.4 16 6.6"/>'],
  tennis: ['#F5DED8', '#9A3324', '<circle cx="12" cy="12" r="8.2"/><path d="M12 3.8 C15.6 6.2 15.6 17.8 12 20.2 M12 3.8 C8.4 6.2 8.4 17.8 12 20.2"/>'],
  // —— 早起三件事：起床 / 朗诵 / 运动 ——
  sunrise: ['#F6E7C4', '#B77A12', '<path d="M3.5 18.8 H20.5"/><path d="M6.6 18.8 C6.6 15.7 9 13.3 12 13.3 C15 13.3 17.4 15.7 17.4 18.8"/><path d="M12 4.4 V7.8"/><path d="M5.4 7.2 L7.8 9.6"/><path d="M18.6 7.2 L16.2 9.6"/>'],
  recite: ['#E6DCEF', '#5B4A78', '<rect x="9.6" y="3.4" width="4.8" height="9.2" rx="2.4"/><path d="M6.4 11.6 C6.4 14.7 8.9 17.2 12 17.2 C15.1 17.2 17.6 14.7 17.6 11.6"/><path d="M12 17.2 V20.6"/><path d="M9.2 20.6 H14.8"/>'],
  exercise: ['#D9E6DC', '#2F5D50', '<path d="M3.8 9.4 V14.6 M6.8 7.2 V16.8 M17.2 7.2 V16.8 M20.2 9.4 V14.6 M6.8 12 H17.2"/>'],
  // —— 爸爸的日程图标 ——
  utensils: ['#D9E6DC', '#2F5D50', '<path d="M7 4 V13 C7 15.2 8.6 17 10.5 17 C12.4 17 14 15.2 14 13 V4"/><path d="M7 4 H9.5 M10.5 4 V9"/><path d="M18 4 V17"/>'],
  bus: ['#F2E5C2', '#8A6A1F', '<rect x="5" y="5" width="14" height="13" rx="2"/><path d="M5 10 H19"/><circle cx="8.5" cy="20" r="1.6"/><circle cx="15.5" cy="20" r="1.6"/>'],
  swim: ['#DCE6F0', '#33506F', '<circle cx="9" cy="8" r="2.2"/><path d="M7 12 C8 10 10 10 11 12 C12 14 14 14 15 12"/><path d="M3.5 17 C5.5 15.5 7 15.5 9 17 C11 18.5 12.5 18.5 14.5 17 C16.5 15.5 18 15.5 20.5 17"/>'],
  apple: ['#F5DED8', '#9A3324', '<path d="M12 7 C10 4.5 6.5 5 6.5 9 C6.5 13 9 19 12 19 C15 19 17.5 13 17.5 9 C17.5 5 14 4.5 12 7 Z"/><path d="M12 7 V4.5 M12 6 C13 4 15 4 15.5 5"/>'],
  briefcase: ['#E6DCEF', '#5B4A78', '<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8 V6.5 C9 5.4 9.8 4.8 10.8 4.8 H13.2 C14.2 4.8 15 5.4 15 6.5 V8"/><path d="M4 12 H20"/>'],
  pencil: ['#F2E5C2', '#8A6A1F', '<path d="M4 20 L5 16 L16 5 L19 8 L8 19 Z"/><path d="M14 7 L17 10"/>'],
  walk: ['#D9E6DC', '#2F5D50', '<circle cx="12" cy="6" r="2.2"/><path d="M12 8.5 V14 M12 14 L8 19 M12 14 L17 17 M9.5 10 L6.5 13 M14.5 10 L18 12.5"/>']
};

function tile(name) {
  const t = TILE[name] || TILE.star;
  return S('<rect x="1" y="1" width="32" height="32" rx="10" fill="' + t[0] + '"/>' +
    '<g transform="translate(5,5)" stroke="' + t[1] + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none">' + t[2] + '</g>', '0 0 34 34');
}

/* ============ 学院 ============ */
// 兜底表：正常情况下用服务端 /api/state 里的 houses，保证两边永远一致
const HOUSE_FALLBACK = {
  gryffindor: { id: 'gryffindor', name: '格兰芬多', en: 'Gryffindor', animal: '狮子', color: '#9A3324', light: '#E07A63', soft: '#F5DED8', motto: '勇气' },
  slytherin: { id: 'slytherin', name: '斯莱特林', en: 'Slytherin', animal: '蛇', color: '#2F6B4F', light: '#6FB894', soft: '#D9E6DC', motto: '野心' },
  ravenclaw: { id: 'ravenclaw', name: '拉文克劳', en: 'Ravenclaw', animal: '鹰', color: '#33506F', light: '#8FA8C9', soft: '#DCE6F0', motto: '智慧' },
  hufflepuff: { id: 'hufflepuff', name: '赫奇帕奇', en: 'Hufflepuff', animal: '獾', color: '#B77A12', light: '#DFB357', soft: '#F6E7C4', motto: '忠诚' }
};
const HOUSE_ORDER = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
const CREST_KEY = { gryffindor: 'houseGryf', slytherin: 'houseSlyth', ravenclaw: 'houseRaven', hufflepuff: 'houseHuff' };

function houseTable() {
  const s = app.state;
  return (s && s.houses) || HOUSE_FALLBACK;
}
function houseInfo(hid) {
  const m = houseTable();
  return m[hid] || m.ravenclaw;
}
function houseOf(kid) { return houseInfo(kid && kid.house); }
function crestOf(hid) { return ICONS[CREST_KEY[hid]] || ICONS.houseRaven; }
// 学院杯数据：按分数从高到低，只保留有人所在的学院
function houseRows(s) {
  const cup = s.houseCup || {};
  return HOUSE_ORDER
    .filter(hid => (cup[hid] || 0) > 0 || s.kids.some(k => k.house === hid))
    .map(hid => ({
      hid, house: houseInfo(hid), val: cup[hid] || 0,
      kids: s.kids.filter(k => k.house === hid).map(k => k.name)
    }))
    .sort((a, b) => b.val - a.val);
}

const BADGE_ART = {
  b_feather: '<path d="M5.5 18.5 C8 12 12 7.5 18.5 5.5 C17.5 12 13.5 16.5 7.5 18.5 Z"/><path d="M5.5 18.5 L11.5 12.5"/>',
  b_timeturner: '<path d="M7 3.5 H17 M7 20.5 H17 M8 3.5 C8 7.5 11.5 9 11.5 12 C11.5 15 8 16.5 8 20.5 M16 3.5 C16 7.5 12.5 9 12.5 12 C12.5 15 16 16.5 16 20.5"/>',
  b_climb: '<path d="M3.5 19 L9.8 7.5 L13.5 13.8 L15.8 10.2 L20.5 19 Z"/>',
  b_drum: '<ellipse cx="12" cy="9.5" rx="7" ry="2.9"/><path d="M5 9.5 V15 C5 16.7 8.1 18 12 18 C15.9 18 19 16.7 19 15 V9.5"/><path d="M4.2 5.8 L8.4 8.4 M19.8 5.8 L15.6 8.4"/>',
  b_snitch: '<circle cx="12" cy="12" r="6"/><path d="M5.5 9.5 C3.5 8 3 5.5 4.5 4.5 M5.5 14.5 C3.5 16 3 18.5 4.5 19.5 M18.5 9.5 C20.5 8 21 5.5 19.5 4.5 M18.5 14.5 C20.5 16 21 18.5 19.5 19.5"/>',
  b_duel: '<path d="M5 19 L18 6 M18 6 H20.5 M18 6 V3.5"/><path d="M19 19 L6 6 M6 6 H3.5 M6 6 V3.5"/>',
  b_potion: '<path d="M9.5 3.5 H14.5 M10.5 3.5 V9 L5.8 17.5 C5.2 18.7 6 20 7.4 20 H16.6 C18 20 18.8 18.7 18.2 17.5 L13.5 9 V3.5"/><path d="M7.6 15 H16.4"/>',
  b_owl: '<rect x="4" y="6" width="16" height="12" rx="2.5"/><path d="M4.8 7.5 L12 13 L19.2 7.5"/>'
};
function badgeArt(id, unlocked) {
  const art = BADGE_ART[id] || BADGE_ART.b_owl;
  const bg = unlocked ? '#F0DFB4' : '#E7DAC0';
  const fg = unlocked ? '#8A6A1F' : '#A8967A';
  return S('<circle cx="12" cy="12" r="10.5" fill="' + bg + '"/><g stroke="' + fg + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none">' + art + '</g>');
}

/* ============ 工具 ============ */
const $ = s => document.querySelector(s);
const view = () => $('#view');
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function pad(n) { return String(n).padStart(2, '0'); }
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
const WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
function prettyDate(s) { const p = s.split('-'); return Number(p[1]) + '月' + Number(p[2]) + '日 · ' + WD[new Date(p[0], p[1] - 1, p[2]).getDay()]; }

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 1800);
}
function flyText(x, y, txt) {
  const el = document.createElement('div');
  el.className = 'fly';
  el.textContent = txt;
  el.style.left = (x - 18) + 'px';
  el.style.top = (y - 24) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ============ 存钱罐：完成一项就把金币存进去 ============ */
const PIGGY_SVG = '<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">' +
  '<rect x="34" y="78" width="13" height="16" rx="4.5" fill="#E4CE9F" stroke="#8A6A1F" stroke-width="2.5"/>' +
  '<rect x="71" y="78" width="13" height="16" rx="4.5" fill="#E4CE9F" stroke="#8A6A1F" stroke-width="2.5"/>' +
  '<path d="M99 54 C111 50 111 65 101 65 C95 65 95 57 100 57" fill="none" stroke="#8A6A1F" stroke-width="2.5" stroke-linecap="round"/>' +
  '<path d="M46 38 L52 21 L67 34 Z" fill="#E4CE9F" stroke="#8A6A1F" stroke-width="2.5" stroke-linejoin="round"/>' +
  '<ellipse cx="60" cy="57" rx="42" ry="28" fill="#F6EAD0" stroke="#8A6A1F" stroke-width="2.5"/>' +
  '<rect x="48" y="32" width="26" height="6" rx="3" fill="#6B5433"/>' +
  '<ellipse cx="21" cy="59" rx="13" ry="10.5" fill="#EAD9B4" stroke="#8A6A1F" stroke-width="2.5"/>' +
  '<circle cx="17" cy="59" r="2" fill="#8A6A1F"/><circle cx="25" cy="59" r="2" fill="#8A6A1F"/>' +
  '<circle cx="45" cy="49" r="2.8" fill="#3A2A16"/>' +
  '<ellipse cx="38" cy="62" rx="6.5" ry="3.6" fill="#E9B7A7" opacity=".65"/>' +
  '<path d="M60 44 C68 44 74 47 76 51" stroke="#D9C39A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
  '</svg>';

const COIN_SVG = '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="20" cy="20" r="17" fill="#C9A227" stroke="#8A6A1F" stroke-width="2"/>' +
  '<circle cx="20" cy="20" r="11.5" fill="none" stroke="#F0DFB4" stroke-width="1.6"/>' +
  '<path d="M20 13 L22.2 18.2 L28 18.6 L23.4 22.4 L25 28 L20 24.8 L15 28 L16.6 22.4 L12 18.6 L17.8 18.2 Z" fill="#F0DFB4"/>' +
  '</svg>';

// 任务类型 → 庆祝动效。没匹配到的都走默认存钱罐。
const TASK_FX = {
  clarinet: 'music', drum: 'music', note: 'music',            // 乐器：音符飘起来
  soccer: 'sport', tennis: 'sport', exercise: 'sport', swim: 'sport', climb: 'sport', // 运动：球弹跳
  book: 'read', scholastic: 'read', recite: 'read',           // 阅读：书页翻飞
  apple: 'food', utensils: 'food',                            // 吃：果香星光
  sunrise: 'sun',                                             // 早起：太阳升起
  moon: 'moon',                                               // 睡觉/午睡：月亮 Zzz
  bus: 'bus'                                                  // 接送：校车驶过
};

// 在点击处弹出庆祝动画：金币掉进存钱罐 / 音符飘 / 球弹跳…… + “+N 分” 冒出来
function piggyPop(kidId, points, x, y, icon) {
  if (!points || points <= 0) return;
  const s = app.state;
  const kid = s && s.kids ? s.kids.find(k => k.id === kidId) : null;
  const now = (s && s.perKid[kidId] ? s.perKid[kidId].weekPoints : 0) + points;
  const fx = TASK_FX[icon] || 'piggy';
  const el = document.createElement('div');
  el.className = 'piggy fx-' + fx;
  el.dataset.kid = kidId;
  const left = Math.max(110, Math.min(window.innerWidth - 110, x || window.innerWidth / 2));
  const top = Math.max(210, y || window.innerHeight / 2);
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  let stage = '';
  if (fx === 'piggy') {
    stage = '<div class="piggy-coin">' + COIN_SVG + '</div>' +
      '<div class="piggy-bank">' + PIGGY_SVG + '</div>';
  } else {
    const deco = {
      music: '<span class="fx-deco d1">♪</span><span class="fx-deco d2">♫</span><span class="fx-deco d3">♪</span>',
      read: '<span class="fx-page p1"></span><span class="fx-page p2"></span>',
      food: '<span class="fx-deco d1">✦</span><span class="fx-deco d2">✦</span><span class="fx-deco d3">✦</span>',
      sun: '<span class="fx-deco d1">✦</span><span class="fx-deco d2">✦</span>',
      moon: '<span class="fx-deco d1">Z</span><span class="fx-deco d2">z</span><span class="fx-deco d3">z</span>',
      sport: '<span class="fx-deco d1">✦</span><span class="fx-deco d2">✦</span>',
      bus: ''
    }[fx] || '';
    stage = '<div class="fx-visual">' + tile(icon) + '</div>' + deco;
  }
  el.innerHTML = stage +
    '<div class="piggy-gain">+' + points + ' 分</div>' +
    '<div class="piggy-total">' + (kid ? esc(kid.name) + ' · ' : '') + '本周已存 ' + now + ' 分</div>';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

// 服务端回传后校准“本周已存”的数字（孩子可能连点好几项）
function refreshPiggyTotals() {
  const s = app.state;
  if (!s) return;
  document.querySelectorAll('.piggy[data-kid]').forEach(el => {
    const k = s.perKid[el.dataset.kid];
    const kid = s.kids.find(x => x.id === el.dataset.kid);
    if (k) el.querySelector('.piggy-total').textContent =
      (kid ? kid.name + ' · ' : '') + '本周已存 ' + k.weekPoints + ' 分';
  });
}

/* ============ 分院帽开场页 ============ */
const HAT_SVG = '<svg viewBox="0 0 240 210" xmlns="http://www.w3.org/2000/svg">' +
  '<defs>' +
  '<linearGradient id="hb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B6542"/><stop offset=".5" stop-color="#6A4A2D"/><stop offset="1" stop-color="#422C1B"/></linearGradient>' +
  '<linearGradient id="hg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A2615"/><stop offset="1" stop-color="#5E4128"/></linearGradient>' +
  '</defs>' +
  '<path d="M10 156 C10 138 58 128 120 128 C182 128 230 138 230 156 C230 174 182 184 120 184 C58 184 10 174 10 156 Z" fill="#4A3220"/>' +
  '<path d="M10 156 C10 143 58 134 120 134 C182 134 230 143 230 156 C230 166 182 174 120 174 C58 174 10 166 10 156 Z" fill="#6B4A2C"/>' +
  '<path d="M70 138 C70 100 80 66 96 46 C106 33 120 26 132 32 C144 38 146 54 138 64 C146 80 158 110 168 134 L170 138 Z" fill="url(#hb)"/>' +
  '<path d="M96 46 C106 33 120 26 132 32 C138 35 141 41 141 47 C128 46 114 58 106 74 C96 92 90 114 88 138 L70 138 C70 100 80 66 96 46 Z" fill="#8B6542" opacity=".5"/>' +
  '<path d="M118 78 L136 84 L133 102 L114 96 Z" fill="#7C5636" opacity=".8"/>' +
  '<path d="M118 78 L136 84 M114 96 L133 102" stroke="#3A2615" stroke-width="1.4" stroke-dasharray="3 3" fill="none"/>' +
  '<path d="M92 82 C98 76 108 76 114 82" stroke="#2E1E10" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<path d="M132 88 C138 82 148 82 154 88" stroke="#2E1E10" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<path d="M84 108 C100 96 124 98 142 112 C130 134 100 136 84 108 Z" fill="url(#hg2)"/>' +
  '<path d="M84 108 C100 96 124 98 142 112" stroke="#2E1E10" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  '<path d="M70 138 C90 130 130 130 174 138 L174 142 C130 136 90 136 70 142 Z" fill="#3A2615" opacity=".7"/>' +
  '<path d="M12 156 C12 174 60 182 120 182 C180 182 228 174 228 156" stroke="#C9A227" stroke-width="2" fill="none" opacity=".55"/>' +
  '</svg>';

const sleep = ms => new Promise(r => setTimeout(r, ms));
let hatChosen = '';    // 开场页里刚选的身份（孩子 id）
let hatHousePick = ''; // 开场页里刚选的学院
let hatMode = '';      // '' 完整流程 ｜ 'switch' 只换人 ｜ 'resort' 只重新分院

/* 这台设备是谁在用：'' 还没选 ｜ 'amelia' / 'aiden' ｜ 'parent'（家长视角，不锁定） */
function whoStored() { try { return localStorage.getItem('hw_who') || ''; } catch (e) { return ''; } }
function whoSave(v) { try { localStorage.setItem('hw_who', v || ''); } catch (e) { /* 忽略 */ } }

/*
 * 开场页三种用法：
 *   showHatIntro()          第一次进来：选人 → 选学院 → 宣布
 *   showHatIntro('switch')  换人：点一下孩子就直接切换，不走分院
 *   showHatIntro('resort')  重新分院：直接跳到当前孩子的选学院一步
 */
function showHatIntro(mode) {
  const s = app.state;
  if (!s) return;
  hatMode = mode || '';
  const wrap = $('#hatIntro');
  $('#hatFigure').innerHTML = HAT_SVG;
  $('#hatResult').hidden = true;
  wrap.classList.remove('is-sorting', 'is-done');

  if (hatMode === 'resort' && myKidId()) {
    const kid = s.kids.find(k => k.id === myKidId());
    if (kid) { wrap.hidden = false; hatPick(kid.id); return; }
  }

  $('#hatPicks').hidden = false;
  $('#hatHouses').hidden = true;
  $('#hatSkip').hidden = false;
  $('#hatSub').textContent = hatMode === 'switch'
    ? '换个人来打卡——今天是谁？'
    : '戴上分院帽——今天是谁来打卡？';
  $('#hatPicks').innerHTML = s.kids.map(k => {
    const h = houseOf(k);
    return '<button class="hat-pick" data-act="hat-pick" data-kid="' + k.id + '" style="--hc:' + (h.light || h.color) + '">' +
      '<span class="hc">' + crestOf(k.house) + '</span><b>' + esc(k.name) + '</b>' +
      '<span class="hg">' + esc(h.name) + (k.grade ? ' · ' + esc(k.grade) : (k.role ? ' · ' + esc(k.role) : '')) + '</span></button>';
  }).join('');
  wrap.hidden = false;
}

async function hatPick(kidId) {
  const s = app.state;
  const kid = s.kids.find(k => k.id === kidId);
  if (!kid) return;
  hatChosen = kid.id;
  hatHousePick = kid.house;
  $('#hatPicks').hidden = true;
  $('#hatSkip').hidden = true;
  $('#hatResult').hidden = true;
  $('#hatSub').textContent = '嗨，' + esc(kid.name) + '！你想去哪个学院？';
  const box = $('#hatHouses');
  box.hidden = false;
  box.innerHTML = HOUSE_ORDER.map(hid => {
    const h = houseInfo(hid);
    const cur = hid === kid.house;
    return '<button class="house-pick' + (cur ? ' is-cur' : '') + '" data-act="hat-house" data-house="' + hid + '"' +
      ' style="--hc:' + (h.light || h.color) + ';--hc-deep:' + h.color + '">' +
      '<span class="hp-crest">' + crestOf(hid) + '</span>' +
      '<span class="hp-txt"><b>' + esc(h.name) + '</b><i>' + esc(h.motto) + ' · ' + esc(h.animal) + ' 院</i></span>' +
      (cur ? '<span class="hp-cur">现在</span>' : '') + '</button>';
  }).join('');
}

async function hatPickHouse(hid) {
  const kid = app.state.kids.find(k => k.id === hatChosen);
  if (!kid) return;
  const wrap = $('#hatIntro');
  const changed = hid !== kid.house;
  hatHousePick = hid;
  $('#hatHouses').hidden = true;
  wrap.classList.add('is-sorting');
  $('#hatSub').textContent = '嗯……让我想想……';
  await sleep(changed ? 1500 : 950);
  if (changed) {
    try {
      await api('POST', '/api/kid', { kid: { id: kid.id, house: hid } });
      await load(true); // 分数挂在孩子身上不会丢，这里只是把新院色同步回来
    } catch (e) { toast('分院没成功：' + (e.message || '网络问题')); }
  }
  const k2 = (app.state.kids.find(k => k.id === kid.id)) || kid;
  const h2 = houseOf(k2);
  const pk = app.state.perKid[k2.id];
  const others = app.state.kids.filter(x => x.id !== k2.id).map(x => x.name).join('、');
  $('#hatSub').textContent = '“——' + h2.name + '！”';
  $('#hatResult').innerHTML =
    '<div class="crest">' + crestOf(k2.house) + '</div>' +
    '<div class="hat-house" style="color:' + (h2.light || h2.color) + '">' + esc(h2.name) + '</div>' +
    '<div class="hat-welcome">欢迎，' + esc(k2.name) + '！' +
    (changed ? '你攒的 ' + (pk ? pk.weekPoints : 0) + ' 分一分没少，一起带到' + esc(h2.name) + '了' : '今天也要为学院加分哦') +
    '</div>' +
    (others ? '<p class="hat-lock">接下来你只能给自己打卡 · ' + esc(others) + ' 的那一列会被锁住</p>' : '') +
    '<button class="btn primary" data-act="hat-enter">开始今日打卡</button>';
  $('#hatResult').hidden = false;
  wrap.classList.remove('is-sorting');
  wrap.classList.add('is-done');
}

function hatDone(v) {
  whoSave(v);
  app.who = v === 'parent' ? 'parent' : (v || '');
  const wrap = $('#hatIntro');
  wrap.classList.remove('is-sorting', 'is-done');
  wrap.hidden = true;
  if (app.state) render();
}

$('#hatIntro').addEventListener('click', (e) => {
  const pick = e.target.closest('[data-act="hat-pick"]');
  if (pick) {
    // 换人模式：点到名字就直接切换，不用再走分院
    if (hatMode === 'switch') { hatDone(pick.dataset.kid); return; }
    hatPick(pick.dataset.kid);
    return;
  }
  const hp = e.target.closest('[data-act="hat-house"]');
  if (hp) { hatPickHouse(hp.dataset.house); return; }
  if (e.target.closest('[data-act="hat-enter"]')) { hatDone(hatChosen); return; }
  if (e.target.closest('#hatSkip')) { openPin('parent'); return; }
});

/* ============ 状态 ============ */
const app = {
  state: null,
  tab: 'today',
  pin: localStorage.getItem('hw_pin') || '',
  form: null,
  // 这台设备是谁：孩子 id 或 'parent'；空表示还没选，会先弹分院帽
  who: whoStored(),
  // 保存 / 取消后置 true：让下一次重绘不要把刚清空的表单内容又抓回来
  ignoreFormCapture: false
};

/* 身份相关：只有自己那列能操作 */
const myKidId = () => (app.who && app.who !== 'parent' ? app.who : '');
const isParentView = () => app.who === 'parent';
// 选了身份之后，别人的那一列锁定（家长视角不锁）
function lockedFor(kidId) { const me = myKidId(); return !!me && me !== kidId; }
function kidName(id) { const s = app.state; const k = s && s.kids.find(x => x.id === id); return k ? k.name : id; }

async function api(method, path, body, withPin) {
  const headers = { 'Content-Type': 'application/json' };
  let url = path;
  if (withPin && app.pin) {
    // 双通道：自定义头 + URL 参数。某些代理/预览层会丢掉自定义头，URL 参数一定到得了。
    headers['x-pin'] = app.pin;
    url += (url.indexOf('?') >= 0 ? '&' : '?') + 'pin=' + encodeURIComponent(app.pin);
  }
  let res;
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch (e) {
    const err = new Error('连不上服务器了');
    err.status = 0;
    throw err;
  }
  let data = null;
  try { data = await res.json(); } catch (e) { data = {}; }
  if (!res.ok) {
    const err = new Error((data && data.error) || ('请求失败 ' + res.status));
    err.status = res.status;
    throw err;
  }
  return data;
}

function setSync(status) {
  const p = $('#syncPill');
  p.classList.toggle('is-syncing', status === 'syncing');
  p.classList.toggle('is-error', status === 'error');
  $('#syncText').textContent = status === 'syncing' ? '同步中' : status === 'error' ? '离线' : '已同步';
}

async function load(quiet) {
  if (!quiet) setSync('syncing');
  let s;
  try {
    s = await api('GET', '/api/state?date=' + todayStr());
    app.state = s;
    setSync('ok');
  } catch (e) {
    setSync('error');
    if (!quiet) toast('连不上服务器了');
    return;
  }
  // 渲染单独包一层：以前它被吞进上面的 catch，页面空白还显示成"已同步"
  try {
    render();
  } catch (e) {
    console.error(e);
    toast('页面渲染出错：' + e.message);
  }
}

/* ============ 渲染 ============ */
function render() {
  const s = app.state;
  if (!s) return;
  $('#dateText').textContent = prettyDate(s.today);
  $('#brandSub').textContent = '每日打卡 · ' + s.week.start.slice(5) + ' – ' + s.week.end.slice(5);
  const total = s.familyWeekPoints || 0;
  $('#weekPointsText').innerHTML = '本周学院分 <b>' + total + '</b>';

  // 顶栏三人名牌：院徽 + 名字，悬停看进度，点一下换人；当前人用学院色高亮
  const chips = $('#whoChips');
  if (chips) {
    const me = myKidId();
    chips.innerHTML = s.kids.map(kid => {
      const h = houseOf(kid);
      const k = s.perKid[kid.id] || {};
      const sel = me === kid.id;
      const info = (kid.grade ? esc(kid.grade) + ' · ' : '') + esc(h.name) +
        (kid.tags && kid.tags.length ? ' · ' + esc(kid.tags.join(' / ')) : '');
      const tip =
        '<span class="ct-name">' + esc(h.name) + (kid.grade ? ' · ' + esc(kid.grade) : ' · ' + esc(kid.role || '家人')) + '</span>' +
        '<span class="ct-row">本周 <b>' + (k.weekPoints || 0) + '</b> 分 · 连续 <b>' + (k.streak || 0) + '</b> 天</span>' +
        (kid.tags && kid.tags.length ? '<span class="ct-row ct-sub">' + esc(kid.tags.join(' / ')) + '</span>' : '') +
        (sel ? '<span class="ct-row ct-go">就是TA在打卡</span>' : '<span class="ct-row ct-go">点一下换 ' + esc(kid.name) + ' 打卡</span>');
      return '<button class="who-chip' + (sel ? ' is-me' : '') + '" data-act="switch-who" data-kid="' + kid.id + '"' +
        ' style="--hc:' + h.color + ';--hsoft:' + h.soft + '">' +
        '<span class="ic">' + crestOf(kid.house) + '</span><span class="nm">' + esc(kid.name) + '</span>' +
        '<span class="chip-tip">' + tip + '</span></button>';
    }).join('');
  }
  const pf = $('#whoParentFlag');
  if (pf) pf.hidden = !isParentView();

  // 家长端表单是每 4 秒后台同步时整体重绘的，重绘前先把用户正在输入的内容收进 app.form，
  // 否则刚敲的字会被旧数据冲回去（"21:45 前上床" 一秒后变回 "21:00 前上床"）
  let keepFocus = null;
  let keepCaret = null;
  if (app.tab === 'parent' && $('#fName')) {
    const ae = document.activeElement;
    if (ae && ae.id) {
      keepFocus = ae.id;
      try { keepCaret = ae.selectionStart; } catch (e) { keepCaret = null; }
    }
    if (!app.ignoreFormCapture) app.form = currentForm();
  }

  if (app.tab === 'today') renderToday(s);
  else if (app.tab === 'schedule') renderSchedule(s);
  else if (app.tab === 'points') renderPoints(s);
  else renderParent(s);

  app.ignoreFormCapture = false;

  // 光标还回原来的输入框，继续打字不被打断
  if (keepFocus) {
    const el = document.getElementById(keepFocus);
    if (el && el.focus) {
      el.focus();
      try { if (keepCaret != null) el.setSelectionRange(keepCaret, keepCaret); } catch (e) { /* 数字框不支持就算了 */ }
    }
  }
}

function houseCard(k, me, locked) {
  const kid = k.kid; // 基础信息在 kid 上，统计值(weekPoints/streak)在 perKid 这层
  const h = houseOf(kid);
  return '<div class="card housecard' + (me ? ' is-me' : '') + (locked ? ' is-locked' : '') + '"' +
    ' style="--hc:' + h.color + ';--hsoft:' + h.soft + '">' +
    '<div class="house-crest">' + crestOf(kid.house) + '</div>' +
    '<div class="house-main">' +
    '<div class="house-name"><h2>' + esc(kid.name) + '</h2>' +
    (kid.grade
      ? '<span class="tag">' + esc(kid.age) + ' 岁 · ' + esc(kid.role) + '</span>'
      : '<span class="tag">' + esc(kid.role || '家人') + '</span>') +
    (me ? '<span class="me-tag">我</span>' : '') + '</div>' +
    '<div class="house-line"><i class="hdot" style="background:' + h.color + '"></i>' +
    esc(h.name) + (kid.grade ? ' · ' + esc(kid.grade) : '') +
    (kid.tags && kid.tags.length ? ' · ' + esc(kid.tags.join(' / ')) : '') + '</div>' +
    '</div>' +
    '<div class="stats">' +
    '<div class="stat"><b>' + (k.weekPoints || 0) + '</b><span>本周学院分</span></div>' +
    '<div class="stat"><b>' + (k.streak || 0) + ' 天</b><span>连续打卡</span></div>' +
    '</div>' +
    (locked ? '<div class="lock-chip">' + ICONS.lock + '<span>' + esc(kid.name) + ' 的打卡 · 已锁定</span></div>' : '') +
    '</div>';
}

function cbSvg(done, color) {
  return done
    ? S('<circle cx="13" cy="13" r="12" fill="' + color + '"/><path d="M8 13.4 L11.5 16.9 L18 10.3" stroke="#FBF3E1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>', '0 0 26 26')
    : S('<circle cx="13" cy="13" r="11.4" stroke="#C3AC81" stroke-width="1.6"/>', '0 0 26 26');
}

function taskRow(k, t, locked) {
  const h = houseOf(k.kid);
  // 按时长计分的任务：显示练习分钟 + 阶梯档位（阅读在上方卡片记分钟，这里只报状态）
  if (t.kind === 'reading' || t.kind === 'practice') {
    const mins = t.practiced || 0;
    const chips = (t.tiers || []).map(tr => {
      const on = mins >= tr[0];
      return '<span class="tier-chip sm' + (on ? ' on' : '') + '"' +
        (on ? ' style="border-color:' + h.color + ';color:' + h.color + ';background:' + h.soft + '"' : '') + '>' +
        tr[0] + '′+' + tr[1] + '</span>';
    }).join('');
    const verb = t.kind === 'reading' ? '已读' : '已练';
    const sub = mins >= (t.tiers && t.tiers.length ? t.tiers[t.tiers.length - 1][0] : 30)
      ? verb + ' ' + mins + ' 分钟 · 满档 +' + t.points + ' 分'
      : verb + ' ' + mins + ' 分钟 · 当前 +' + t.points + ' 分';
    const btn = d => '<button class="mini-btn" data-act="practice" data-kid="' + k.kid.id + '" data-task="' + t.id + '" data-delta="' + d + '">' + (d > 0 ? '+' : '−') + Math.abs(d) + '</button>';
    return '<div class="task practice' + (t.done ? ' done' : '') + (locked ? ' is-locked' : '') + '">' +
      '<span class="cb">' + cbSvg(t.done, h.color) + '</span>' +
      '<span class="tile">' + tile(t.icon) + '</span>' +
      '<span class="mid"><div class="t-name">' + esc(t.name) +
      (locked ? '<span class="row-lock">' + ICONS.lock + '</span>' : '') + '</div>' +
      '<div class="t-sub">' + esc(sub) + '</div>' +
      '<div class="tier-chips">' + chips + '</div></span>' +
      '<span class="pts pstack"><b>+' + t.points + '</b>' + (t.maxPoints && t.points < t.maxPoints ? '<i>最高+' + t.maxPoints + '</i>' : '') + '</span>' +
      (!locked ? '<span class="mini-btns">' + btn(-5) + btn(5) + btn(10) + '</span>' : '') +
      '</div>';
  }
  // 锁定列：照样显示真实完成状态（家人能看到进度），只是点不动
  const sub = (t.time ? t.time + ' · ' : '') + (t.done ? '已完成' : (locked ? '还没打卡' : '点一下完成'));
  return '<div class="task' + (t.done ? ' done' : '') + (locked ? ' is-locked' : '') + '"' +
    (locked ? '' : ' data-act="toggle" data-kid="' + k.kid.id + '" data-task="' + t.id + '"') + '>' +
    '<span class="cb">' + cbSvg(t.done, h.color) + '</span>' +
    '<span class="tile">' + tile(t.icon) + '</span>' +
    '<span class="mid"><div class="t-name">' + esc(t.name) +
    (locked ? '<span class="row-lock">' + ICONS.lock + '</span>' : '') + '</div>' +
    '<div class="t-sub">' + esc(sub) + '</div></span>' +
    '<span class="pts">+' + t.points + '</span></div>';
}

function renderToday(s) {
  const me = myKidId();
  // 选了身份就只看自己的今日任务（不用长长一列拉到底）；家长视角仍看全员
  const shown = me ? s.kids.filter(kid => kid.id === me) : s.kids;
  const cols = shown.map(kid => {
    const k = s.perKid[kid.id];
    if (!k) return '';
    const locked = lockedFor(kid.id);
    // 锁定的一列整体可点：点了给个提示，而不是死掉
    return '<div class="col' + (locked ? ' is-locked' : '') + '"' +
      (locked ? ' data-act="locked-tip" data-kid="' + kid.id + '"' : '') + '>' +
      houseCard(k, me === kid.id, locked) +
      '<div style="height:16px"></div>' +
      '<div class="card' + (locked ? ' is-locked' : '') + '"><div class="card-title"><h3>今日任务</h3>' +
      '<span class="sub">' + k.doneCount + ' / ' + k.totalCount + ' 已完成 · 还剩 +' + k.remainPoints + ' 分</span></div>' +
      (locked ? '<p class="lock-hint">' + ICONS.lock + '这一列只有 ' + esc(kid.name) + ' 能打卡</p>' : '') +
      '<div class="tasks">' + (k.tasks.length ? k.tasks.map(t => taskRow(k, t, locked)).join('') : '<div class="empty">今天没有安排任务</div>') + '</div>' +
      '</div></div>';
  }).join('');
  view().innerHTML = '<div class="grid2' + (me ? ' solo' : '') + '">' + cols + '</div>' + houseCupBar(s);
}

function houseCupBar(s) {
  const rows = houseRows(s);
  if (!rows.length) return '';
  const max = Math.max(1, ...rows.map(r => r.val));
  const top = rows[0], second = rows[1];
  const who = !second
    ? (top.kids.join('、') + ' 独占 ' + top.house.name)
    : (top.val === second.val ? top.house.name + ' 与 ' + second.house.name + ' 打平'
      : top.house.name + '领先 ' + (top.val - second.val) + ' 分');

  const row = r =>
    '<div class="cup-row">' +
    '<div class="cup-name"><span class="cup-crest">' + crestOf(r.hid) + '</span>' +
    '<b style="color:' + r.house.color + '">' + esc(r.house.name) + '</b>' +
    (r.kids.length ? '<span class="cup-who">' + esc(r.kids.join('、')) + '</span>' : '') + '</div>' +
    '<div class="cup-score" style="color:' + r.house.color + '">' + r.val + '<i>分</i></div>' +
    '<div class="bar"><i style="width:' + (r.val / max * 100) + '%;background:' + r.house.color + '"></i></div>' +
    '</div>';

  return '<div class="card" style="margin-top:20px">' +
    '<div class="card-title"><h3 style="display:flex;align-items:center;gap:10px"><span class="ic" style="color:var(--gold-deep)">' + ICONS.trophy + '</span>本周学院杯</h3>' +
    '<span class="sub">距离本周结算还有 ' + s.lockWeekInDays + ' 天 · ' + who + '</span></div>' +
    '<div class="cup-rows">' + rows.map(row).join('') + '</div></div>';
}

function renderSchedule(s) {
  const today = s.weekday;
  const kidOf = id => (s.perKid[id] ? s.perKid[id].kid : null);
  const isMorning = t => t && t.time && t.time < '12:00';
  const evHtml = it => {
    // 单人项目用他「现在所属学院」的颜色，分院换了课表配色也跟着换
    let cls = 'both', style = '';
    if (it.atSchool) cls = 'school';
    else if (it.assignees.length === 1) {
      const k = kidOf(it.assignees[0]);
      const h = k ? houseInfo(k.house) : null;
      cls = 'one';
      if (h) style = ' style="--ev-bg:' + h.soft + ';--ev-fg:' + h.color + '"';
    }
    const who = it.assignees.length > 1 ? '两个人一起'
      : ((kidOf(it.assignees[0]) || {}).name || '—');
    const pt = it.points ? ' · +' + it.points : '';
    return '<div class="ev ' + cls + '"' + style + '><div class="t">' + esc(it.time || '待定') + pt + '</div>' +
      '<div class="n">' + esc(it.name) + '</div><div class="w">' + esc(who) + '</div></div>';
  };
  // 一天分两段：早晨（早起三件事）和放学后（课后课 + 固定流程）
  const days = s.schedule.map(d => {
    const am = d.items.filter(isMorning), pm = d.items.filter(it => !isMorning(it));
    let body = '';
    if (am.length) body += '<div class="ev-group"><span class="ev-group-tag am">早晨</span>' + am.map(evHtml).join('') + '</div>';
    if (pm.length) body += '<div class="ev-group"><span class="ev-group-tag pm">放学后</span>' + pm.map(evHtml).join('') + '</div>';
    const isToday = d.day === today;
    return '<div class="day"><div class="day-head' + (isToday ? ' today' : '') + '">' +
      '<b>周' + d.label + '</b><span>' + (isToday ? '今天' : '') + '</span></div>' +
      '<div class="day-body">' + (body || '<div class="ev-add"><span class="ic">' + ICONS.plus + '</span>还没安排</div>') + '</div></div>';
  }).join('');

  view().innerHTML = '<div class="card"><div class="card-title"><h3>每日课表</h3>' +
    '<span class="sub">' + s.week.start.slice(5) + ' – ' + s.week.end.slice(5) + ' · 06:30 起床 → 22:00 熄灯</span></div>' +
    '<div class="week-scroll"><div class="week">' + days + '</div></div>' +
    '<div class="legend">' +
    s.kids.map(k => {
      const h = houseInfo(k.house);
      return '<div><i style="background:' + h.color + '"></i>' + esc(k.name) + ' · ' + esc(h.name) + '</div>';
    }).join('') +
    '<div><i style="background:#C9A227"></i>两个人一起</div>' +
    '<div><i style="background:#C9BFA3"></i>在校已完成 · 不用再打卡</div>' +
    '</div></div>';
}

function renderPoints(s) {
  const rows = houseRows(s);
  const max = Math.max(1, ...rows.map(r => r.val));
  const total = s.familyWeekPoints || 0;

  const bars = s.weekBars.map(b => {
    const h = Math.max(6, Math.round(b.points / Math.max(1, ...s.weekBars.map(x => x.points || 1)) * 110));
    return '<div class="col' + (b.isToday ? ' today' : '') + '"><i style="height:' + h + 'px"></i></div>';
  }).join('');
  const labels = s.weekBars.map(b =>
    '<span class="' + (b.isToday ? 'today' : '') + '">' + b.label + '</span>').join('');

  const logs = s.recent.length ? s.recent.map(c =>
    '<div class="log-row"><span class="l">' + esc(c.taskName) + ' · ' + esc(c.kidName) + '</span>' +
    '<span class="r">+' + c.points + '</span>' +
    (app.pin ? '<button class="undo" data-act="undo" data-id="' + c.id + '">撤回</button>' : '') +
    '</div>').join('') : '<div class="empty">还没有加分记录</div>';

  const badges = s.kids.map(kid => {
    const k = s.perKid[kid.id];
    return '<h4 style="margin:20px 0 12px;font-size:15px;color:' + kid.color + '">' + esc(kid.name) +
      ' · 已解锁 ' + k.unlockedBadges + ' / ' + k.badges.length + '</h4>' +
      '<div class="badges">' + k.badges.map(b =>
        '<div class="badge' + (b.unlocked ? '' : ' locked') + '">' +
        '<div class="bi">' + badgeArt(b.id, b.unlocked) + '</div>' +
        '<b>' + esc(b.name) + '</b><span>' + esc(b.desc) + '</span>' +
        (b.unlocked ? '' : '<div class="prog"><i style="width:' + b.pct + '%"></i></div>' +
          '<span style="color:#A8967A;font-size:11px">' + b.current + ' / ' + b.target + '</span>') +
        '</div>').join('') + '</div>';
  }).join('');

  const chs = (s.challenges || []).map(c =>
    '<div class="rule"><span class="tile">' + tile(c.icon || 'star') + '</span>' +
    '<span class="mid"><div class="n">' + esc(c.name) + '</div><div class="s">' + esc(c.desc) + '</div></span>' +
    '<span class="pts">' + c.current + ' / ' + c.target + '</span></div>').join('');

  view().innerHTML =
    '<div class="grid2">' +
    '<div>' +
    '<div class="card"><div class="card-title"><h3>本周学院分</h3><span class="sub">' + s.week.start.slice(5) + ' – ' + s.week.end.slice(5) + '</span></div>' +
    '<div style="display:flex;align-items:baseline;gap:8px"><span class="big-num">' + total + '</span><span class="sub">分</span></div>' +
    '<div style="margin-top:18px;display:flex;flex-direction:column;gap:12px">' +
    rows.map(r =>
      '<div class="house-row"><span class="lab" style="color:' + r.house.color + '">' + esc(r.house.name) +
      (r.kids.length ? '<i class="lab-who">' + esc(r.kids.join('、')) + '</i>' : '') + '</span>' +
      '<span class="track"><i style="width:' + (r.val / max * 100) + '%;background:' + r.house.color + '"></i></span>' +
      '<span class="val" style="color:' + r.house.color + '">' + r.val + '</span></div>').join('') +
    '</div><p class="sub" style="margin-top:14px">本周日 21:00 结算学院杯</p></div>' +

    '<div class="card"><div class="card-title"><h3>最近 7 天打卡</h3><span class="sub">全家每天拿到的学院分</span></div>' +
    '<div class="bars">' + bars + '</div><div class="bars-labels">' + labels + '</div></div>' +

    '<div class="card"><div class="card-title"><h3>最近加分记录</h3><span class="sub">家长可撤回</span></div>' +
    '<div class="log">' + logs + '</div></div>' +
    '</div>' +

    '<div>' +
    ((s.challenges && s.challenges.length) ?
      '<div class="card"><div class="card-title"><h3>本周家庭挑战</h3><span class="sub">周日结算</span></div>' + chs + '</div>' : '') +
    '<div class="card" style="margin-top:16px"><div class="card-title"><h3>徽章墙</h3>' +
    '<span class="sub">连续打卡解锁</span></div>' + badges + '</div>' +
    '</div></div>';
}

/* ---------- 家长端 ---------- */
function renderParent(s) {
  if (!app.pin) {
    view().innerHTML = '<div class="card"><div class="card-title"><h3>家长端</h3></div>' +
      '<p class="sub">设置打卡项、分值和周期。改动会立刻同步到两台平板。</p>' +
      '<div style="margin-top:18px"><button class="btn primary" data-act="askpin">输入家长密码</button></div></div>';
    return;
  }

  const editingId = app.form && app.form.id ? app.form.id : null;
  const rules = s.allTasks.map(t => {
    const who = t.assignees.length > 1 ? '两个人' : t.assignees.map(id => (s.perKid[id] ? s.perKid[id].kid.name : id)).join(' / ');
    const days = t.days.length === 7 ? '每天' : t.days.map(d => '一二三四五六日'[d - 1]).join(' / ');
    const ptsText = (t.kind === 'reading' || t.kind === 'practice') && t.tiers
      ? '按时长：' + t.tiers.map(tr => tr[0] + '分钟+' + tr[1]).join(' / ')
      : '+' + t.points + ' 分';
    return '<div class="rule' + (t.id === editingId ? ' is-editing' : '') + '"><span class="tile">' + tile(t.icon) + '</span>' +
      '<span class="mid"><div class="n">' + esc(t.name) + '</div>' +
      '<div class="s">' + esc(who) + ' · ' + esc(days) + (t.time ? ' · ' + esc(t.time) : '') + ' · ' + esc(ptsText) + '</div></span>' +
      '<button class="btn sm" data-act="edit-task" data-id="' + t.id + '">' + (t.id === editingId ? '编辑中' : '编辑') + '</button>' +
      '<button class="switch" data-act="toggle-task" data-id="' + t.id + '" title="启用 / 停用">' +
      (t.active ? S('<rect width="46" height="26" rx="13" fill="#2C2015"/><circle cx="34" cy="13" r="9.5" fill="#F7EEDC"/>', '0 0 46 26')
        : S('<rect width="46" height="26" rx="13" fill="#D9C7A5"/><circle cx="12" cy="13" r="9.5" fill="#FBF3E1"/>', '0 0 46 26')) + '</button>' +
      '<button class="btn sm danger" data-act="del-task" data-id="' + t.id + '">删除</button></div>';
  }).join('');

  const f = app.form || { name: '', points: 10, minutes: 20, time: '17:30', days: [1, 3, 5], assignees: ['amelia'], icon: 'star' };
  const dayChips = [1, 2, 3, 4, 5, 6, 7].map(d =>
    '<button class="chip' + (f.days.includes(d) ? ' on' : '') + '" data-act="day" data-d="' + d + '">' + '一二三四五六日'[d - 1] + '</button>').join('');
  const whoChips = s.kids.map(k =>
    '<button class="chip' + (f.assignees.includes(k.id) ? ' on' : '') + '" data-act="who" data-k="' + k.id + '">' + esc(k.name) + '</button>').join('') +
    '<button class="chip' + (f.assignees.length > 1 ? ' on' : '') + '" data-act="who-both">两个人</button>';

  view().innerHTML =
    '<div class="grid2">' +
    '<div class="card"><div class="card-title"><h3>正在生效的打卡项</h3><span class="sub">共 ' + s.allTasks.length + ' 项</span></div>' +
    rules + '</div>' +

    '<div class="card"><div class="card-title"><h3>' + (editingId ? '编辑打卡项' : '新建一个打卡项') + '</h3>' +
    (editingId ? '<span class="sub">正在修改已有项</span>' : '') + '</div>' +
    '<div class="field"><label>名称</label>' +
    '<input class="input" id="fName" placeholder="例如：围棋复盘 15 分钟" value="' + esc(f.name) + '"></div>' +
    '<div class="field-row" style="margin-top:14px">' +
    '<div class="field"><label>建议时长（分钟）</label><input class="input" id="fMin" type="number" min="0" value="' + f.minutes + '"></div>' +
    '<div class="field"><label>可得学院分</label>' +
    ((f.kind === 'reading' || f.kind === 'practice')
      ? '<input class="input" value="按时长自动算" disabled style="opacity:.6">'
      : '<input class="input" id="fPts" type="number" min="0" value="' + f.points + '">') +
    '</div></div>' +
    ((f.kind === 'reading' || f.kind === 'practice')
      ? '<p class="sub" style="margin-top:8px">这项按练习时长计分：' +
        ((f.tiers || [[10, 5], [20, 10], [30, 20]]).map(tr => tr[0] + ' 分钟 +' + tr[1] + ' 分').join(' · ')) +
        '，孩子自己记分钟数</p>'
      : '') +
    '<div class="field" style="margin-top:14px"><label>时间段</label><input class="input" id="fTime" value="' + esc(f.time) + '" placeholder="17:30"></div>' +
    '<div class="field" style="margin-top:14px"><label>安排在哪几天</label><div class="chips">' + dayChips + '</div></div>' +
    '<div class="field" style="margin-top:14px"><label>谁来完成</label><div class="chips">' + whoChips + '</div></div>' +
    '<div style="margin-top:18px;display:flex;gap:10px">' +
    '<button class="btn primary" style="flex:1" data-act="save-task">' + (editingId ? '保存修改' : '保存并同步') + '</button>' +
    (editingId
      ? '<button class="btn" data-act="cancel-edit">取消</button>'
      : '<button class="btn" data-act="export">导出备份</button>') + '</div>' +
    (editingId
      ? '<p class="sub" style="text-align:center;margin-top:10px">改完保存即可，已经拿到的学院分不会丢</p>'
      : '<p class="sub" style="text-align:center;margin-top:10px">保存后会立刻出现在孩子们的「今日任务」里</p>') +
    '</div></div>';
}

/* ============ 交互 ============ */
document.addEventListener('click', async (e) => {
  const tabs = e.target.closest('.tab');
  if (tabs) {
    app.tab = tabs.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t === tabs));
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const s = app.state;
  if (!s) return;

  try {
    // 点了别人的那一列：给个明确提示，而不是没反应
    if (act === 'locked-tip') {
      toast('这是 ' + kidName(el.dataset.kid) + ' 的打卡，让他自己来 ✓');
      return;
    }

    // 顶栏名牌换人：一键切换，不用再开换人弹层
    if (act === 'switch-who') {
      const kidId = el.dataset.kid;
      if (myKidId() === kidId) return;
      hatDone(kidId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('换到 ' + kidName(kidId) + ' 啦，开始打卡吧');
      return;
    }

    if (act === 'practice') {
      // 阅读 / 练习类统一走这里：改分钟数，服务端按档位同步分数
      const kidId = el.dataset.kid;
      const taskId = el.dataset.task;
      if (lockedFor(kidId)) { toast('这是 ' + kidName(kidId) + ' 的打卡，让他自己来 ✓'); return; }
      const delta = Number(el.dataset.delta);
      const t0 = s.perKid[kidId].tasks.find(x => x.id === taskId);
      const ptsBefore = t0 ? (t0.points || 0) : 0;
      await api('POST', '/api/reading', { kidId, taskId, date: s.today, minutes: delta, mode: 'add' });
      await load(true);
      const t1 = app.state && app.state.perKid[kidId] ? app.state.perKid[kidId].tasks.find(x => x.id === taskId) : null;
      const after = t1 ? (t1.points || 0) : 0;
      if (after > ptsBefore) piggyPop(kidId, after - ptsBefore, e.clientX, e.clientY);
      return;
    }

    if (act === 'toggle') {
      const kidId = el.dataset.kid;
      const taskId = el.dataset.task;
      if (lockedFor(kidId)) { toast('这是 ' + kidName(kidId) + ' 的打卡，让他自己来 ✓'); return; }
      const k = s.perKid[kidId];
      const t = k.tasks.find(x => x.id === taskId);
      if (!t) return;
      if (!t.done) {
        await api('POST', '/api/checkin', { kidId, taskId, date: s.today, done: true });
        piggyPop(kidId, t.points, e.clientX, e.clientY, t.icon);
        el.classList.add('pop');
      } else {
        await api('POST', '/api/checkin', { kidId, taskId, date: s.today, done: false });
      }
      await load(true);
      refreshPiggyTotals();
      return;
    }

    if (act === 'undo') {
      await api('POST', '/api/undo', { id: el.dataset.id }, true);
      toast('已撤回');
      await load(true);
      return;
    }

    if (act === 'askpin') { openPin(); return; }

    if (act === 'edit-task') {
      const t = s.allTasks.find(x => x.id === el.dataset.id);
      if (!t) return;
      // 关键：带上原来的 id，保存时服务端就会更新这一项而不是新建
      app.form = {
        id: t.id, name: t.name, icon: t.icon, kind: t.kind, time: t.time,
        points: t.points, minutes: t.minutes, tiers: t.tiers ? t.tiers.slice() : undefined,
        days: t.days.slice(), assignees: t.assignees.slice()
      };
      render();
      const n = $('#fName');
      if (n) { n.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => n.focus(), 300); }
      return;
    }

    if (act === 'cancel-edit') {
      app.form = null;
      app.ignoreFormCapture = true;
      render();
      return;
    }

    if (act === 'toggle-task') {
      const t = s.allTasks.find(x => x.id === el.dataset.id);
      await api('POST', '/api/tasks', { task: Object.assign({}, t, { active: !t.active }) }, true);
      await load(true);
      return;
    }

    if (act === 'del-task') {
      if (!confirm('删除这个打卡项？已经拿到的分会一起清掉。')) return;
      await api('DELETE', '/api/tasks/' + el.dataset.id, null, true);
      await load(true);
      return;
    }

    if (act === 'day') {
      const f = currentForm();
      const d = Number(el.dataset.d);
      f.days = f.days.includes(d) ? f.days.filter(x => x !== d) : f.days.concat(d).sort();
      app.form = f; render();
      return;
    }

    if (act === 'who') {
      const f = currentForm();
      const k = el.dataset.k;
      if (f.assignees.includes(k) && f.assignees.length > 1) f.assignees = f.assignees.filter(x => x !== k);
      else f.assignees = [k];
      app.form = f; render();
      return;
    }

    if (act === 'who-both') {
      const f = currentForm();
      f.assignees = s.kids.map(k => k.id);
      app.form = f; render();
      return;
    }

    if (act === 'save-task') {
      const f = currentForm();
      if (!f.name.trim()) { toast('先填个名字'); return; }
      const wasEdit = !!f.id;
      await api('POST', '/api/tasks', { task: f }, true);
      app.form = null;
      app.ignoreFormCapture = true;
      toast(wasEdit ? '已更新，平板已同步' : '已保存，平板已同步');
      await load(true);
      return;
    }

    if (act === 'export') {
      window.location.href = '/api/export';
      return;
    }
  } catch (err) {
    toast(err.message || '操作失败');
  }
});

function currentForm() {
  const f = app.form || { name: '', points: 10, minutes: 20, time: '17:30', days: [1, 3, 5], assignees: ['amelia'], icon: 'star' };
  const n = $('#fName'), m = $('#fMin'), p = $('#fPts'), t = $('#fTime');
  if (n) f.name = n.value;
  if (m) f.minutes = Number(m.value) || 0;
  if (p) f.points = Number(p.value) || 0;
  if (t) f.time = t.value;
  return f;
}

/* ---------- 密码弹层 ---------- */
// intent 为空 = 只是要开家长端；intent='parent' = 从分院帽页切到家长视角（不锁定）
let pinIntent = '';
function closePin() { $('#pinMask').hidden = true; pinIntent = ''; }
function openPin(intent) {
  pinIntent = intent || '';
  $('#pinMask').hidden = false;
  $('#pinErr').hidden = true;
  const i = $('#pinInput');
  i.value = '';
  setTimeout(() => i.focus(), 50);
}
$('#pinCancel').addEventListener('click', closePin);
$('#pinMask').addEventListener('click', (e) => { if (e.target.id === 'pinMask') closePin(); });
async function submitPin() {
  const v = $('#pinInput').value.trim();
  if (!v) return;
  const errBox = $('#pinErr');
  app.pin = v; // api() 读的是 app.pin，必须先换成刚输入的，否则会用旧密码去校验
  try {
    // 走 POST + 请求体：密码既能从 body 读，也能从 URL 参数读，头被拦也不影响
    await api('POST', '/api/verify-pin', { pin: v }, true);
  } catch (e) {
    // 只有真正的 401 才算密码错，别把渲染/网络问题赖到密码头上
    app.pin = '';
    try { localStorage.removeItem('hw_pin'); } catch (e) { /* 忽略 */ }
    errBox.textContent = e.status === 401 ? '密码不对' : ('进不去：' + (e.message || '未知错误'));
    errBox.hidden = false;
    return;
  }
  app.pin = v;
  localStorage.setItem('hw_pin', v);
  const intent = pinIntent;
  closePin();
  if (intent === 'parent') { hatDone('parent'); return; }
  render();
}
$('#pinOk').addEventListener('click', submitPin);
$('#pinInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitPin(); });

/* ---------- 启动 ---------- */
$('#crest').innerHTML = ICONS.crest;
$('#hatIc').innerHTML = HAT_SVG;
$('#resortBtn').addEventListener('click', () => showHatIntro('resort'));

/* 顶栏高度会随内容换行变化（比如身份牌文字变长、分数位数变多），
   而标签栏的 sticky 偏移按顶栏高度定位，所以实时把它喂给 CSS 变量。 */
(function trackTopbarHeight() {
  const bar = document.querySelector('.topbar');
  if (!bar) return;
  const apply = () => {
    const h = Math.round(bar.getBoundingClientRect().height);
    if (h) document.documentElement.style.setProperty('--topbar-h', h + 'px');
  };
  apply();
  if (window.ResizeObserver) new ResizeObserver(apply).observe(bar);
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', () => setTimeout(apply, 250));
})();
document.querySelectorAll('[data-icon]').forEach(el => {
  const n = el.dataset.icon;
  if (ICONS[n]) el.innerHTML = ICONS[n];
});

load().then(() => { if (!app.who) showHatIntro(); });
setInterval(() => load(true), 4000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) load(true); });
