'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
/* 数据目录可用 DATA_DIR 覆盖。正式部署时指向代码目录之外的绝对路径，
   这样以后更新代码（整目录替换 / rsync --delete）永远碰不到孩子们的记录。 */
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

/* ---------------- 四个学院（唯一真源：前端从 /api/state 拿） ----------------
   color = 羊皮纸底上用的深色；light = 分院帽黑夜底上用的浅色 */
const HOUSES = {
  gryffindor: { id: 'gryffindor', name: '格兰芬多', en: 'Gryffindor', animal: '狮子', color: '#9A3324', light: '#E07A63', soft: '#F5DED8', motto: '勇气' },
  slytherin: { id: 'slytherin', name: '斯莱特林', en: 'Slytherin', animal: '蛇', color: '#2F6B4F', light: '#6FB894', soft: '#D9E6DC', motto: '野心' },
  ravenclaw: { id: 'ravenclaw', name: '拉文克劳', en: 'Ravenclaw', animal: '鹰', color: '#33506F', light: '#8FA8C9', soft: '#DCE6F0', motto: '智慧' },
  hufflepuff: { id: 'hufflepuff', name: '赫奇帕奇', en: 'Hufflepuff', animal: '獾', color: '#B77A12', light: '#DFB357', soft: '#F6E7C4', motto: '忠诚' }
};
const HOUSE_IDS = Object.keys(HOUSES);
function houseOf(id) { return HOUSES[id] || HOUSES.ravenclaw; }

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

/* ---------------- date helpers (all dates are YYYY-MM-DD strings) ---------------- */

function pad(n) { return String(n).padStart(2, '0'); }
function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function parseYmd(s) { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function addDays(s, n) { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); }
function weekdayOf(s) { const w = parseYmd(s).getDay(); return w === 0 ? 7 : w; } // 1=Mon .. 7=Sun
function weekStart(s) { return addDays(s, -(weekdayOf(s) - 1)); }
function todayLocal() { return ymd(new Date()); }
function isValidDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parseYmd(s).getTime()); }

/* ---------------- persistence ---------------- */

function seed() {
  return {
    version: 1,
    pin: '1234',
    kids: [
      {
        id: 'amelia', name: 'Amelia', role: '姐姐', age: 10, grade: 'G5-2',
        house: 'ravenclaw', color: '#33506F', tags: ['单簧管', '攀岩', '画画'], readingGoal: 20
      },
      {
        id: 'aiden', name: 'Aiden', role: '弟弟', age: 7, grade: 'G2-1',
        house: 'gryffindor', color: '#9A3324', tags: ['架子鼓', '足球', '攀岩'], readingGoal: 20
      }
    ],
    tasks: [
      /* —— 每天都要做 · 早起三件事（两个人）—— */
      { id: 't_wake', name: '6:30 按时早起', icon: 'sunrise', kind: 'normal', time: '06:30', points: 5, minutes: 0, days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_recite', name: '在家朗诵 10 分钟', icon: 'recite', kind: 'normal', time: '06:40', points: 10, minutes: 10, days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_exercise', name: '早起运动 20 分钟', icon: 'exercise', kind: 'normal', time: '06:40', points: 10, minutes: 20, days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },

      /* —— 每天都要做（两个人）—— 放学后到睡觉前的固定流程 */
      { id: 't_table', name: '帮忙收拾桌子', icon: 'table', kind: 'normal', time: '18:30', points: 5, minutes: 5, days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_english', name: '英语练习', icon: 'globe', kind: 'practice', time: '19:00', points: 10, minutes: 20, tiers: [[10, 5], [20, 10], [30, 20]], days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_amc', name: 'AMC 数学 20 分钟', icon: 'math', kind: 'normal', time: '19:30', points: 10, minutes: 20, days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_read', name: '中文阅读', icon: 'book', kind: 'reading', time: '20:00', points: 20, minutes: 20, tiers: [[10, 5], [20, 10], [30, 20]], days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_scholastic', name: 'Scholastic 阅读', icon: 'scholastic', kind: 'practice', time: '20:30', points: 10, minutes: 15, tiers: [[15, 10], [30, 20]], days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },
      { id: 't_bed', name: '22:00 前上床', icon: 'moon', kind: 'normal', time: '22:00', points: 5, minutes: 0, days: [1, 2, 3, 4, 5, 6, 7], assignees: ['amelia', 'aiden'], active: true },

      /* —— Amelia（G5-2）的课外课：周一/三攀岩，周二/四/日单簧管，周五网球，周六画画 —— */
      { id: 't_climb', name: '攀岩训练 60 分钟', icon: 'climb', kind: 'normal', time: '17:30', points: 10, minutes: 60, days: [1, 3], assignees: ['amelia'], active: true },
      { id: 't_clarinet', name: '单簧管练习', icon: 'clarinet', kind: 'practice', time: '17:30', points: 20, minutes: 20, tiers: [[10, 5], [20, 10], [30, 20]], days: [2, 4, 7], assignees: ['amelia'], active: true },
      { id: 't_tennis', name: '网球课 60 分钟', icon: 'tennis', kind: 'normal', time: '17:30', points: 10, minutes: 60, days: [5], assignees: ['amelia'], active: true },
      { id: 't_draw', name: '自由画画 30 分钟', icon: 'brush', kind: 'normal', time: '16:00', points: 10, minutes: 30, days: [6], assignees: ['amelia'], active: true },

      /* —— Aiden（G2-1）的课外课：周一/三/五足球，周二/四/日架子鼓 —— */
      { id: 't_soccer', name: '足球训练 45 分钟', icon: 'soccer', kind: 'normal', time: '17:30', points: 10, minutes: 45, days: [1, 3, 5], assignees: ['aiden'], active: true },
      { id: 't_drum', name: '架子鼓练习 15 分钟', icon: 'drum', kind: 'normal', time: '17:30', points: 10, minutes: 15, days: [2, 4, 7], assignees: ['aiden'], active: true }
    ],
    activities: [
      { id: 'a1', name: '攀岩馆长课', day: 6, time: '10:00', assignees: ['amelia', 'aiden'], atSchool: false },
      { id: 'a2', name: '阅读马拉松', day: 6, time: '15:00', assignees: ['amelia', 'aiden'], atSchool: false },
      { id: 'a3', name: '家庭电影夜', day: 5, time: '19:30', assignees: ['amelia', 'aiden'], atSchool: false },
      { id: 'a4', name: '公园写生', day: 7, time: '16:00', assignees: ['amelia'], atSchool: false },
      { id: 'a5', name: '社区足球赛', day: 7, time: '09:00', assignees: ['aiden'], atSchool: false },
      { id: 'a6', name: '在校已完成 · 游泳课', day: 5, time: '在校', assignees: ['amelia', 'aiden'], atSchool: true }
    ],
    checkins: [],   // {id, kidId, taskId, date, points, ts}
    reading: [],    // {kidId, date, minutes}
    manualBadges: {} // "amelia:b_owl" -> true
  };
}

let db = null;

function load() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) { /* ignore */ }
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error('db.json 损坏，已备份并重建:', e.message);
      try { fs.copyFileSync(DB_FILE, DB_FILE + '.broken.' + Date.now()); } catch (e2) { /* ignore */ }
      db = seed();
    }
  } else {
    db = seed();
  }
  migrate();
  save();
}

/* 数据迁移 / 兜底补全：load 与 /api/import 都要走一遍 */
function migrate() {
  const s = seed();
  // 兜底补全字段，防止旧版本数据缺 key
  for (const k of Object.keys(s)) if (db[k] === undefined) db[k] = s[k];

  /* ---- 一次性迁移：补上「早起三件事」----
     只在没有该 id 时补，且只跑一次，这样家长以后手动删掉就不会被反复加回来 */
  if (!db.migratedMorning) {
    const morning = s.tasks.filter(t => ['t_wake', 't_recite', 't_exercise'].includes(t.id));
    for (const t of morning.reverse()) {
      if (!db.tasks.some(x => x.id === t.id)) db.tasks.unshift(t);
    }
    db.migratedMorning = true;
  }
  /* ---- 一次性迁移：阅读/乐器改阶梯计分（10′=5 / 20′=10 / 30′=20），删重复的单簧管练习2 ---- */
  if (!db.migratedTiers) {
    // 删除早期「编辑变新建」bug 产生的重复项（正式项 t_clarinet 同天的打卡保留，
    // 重复项上的打卡属于一次练习重复计分，随任务一起清掉）
    db.tasks = db.tasks.filter(t => t.id !== 't_mu2r7vbpxr65');
    db.checkins = db.checkins.filter(c => c.taskId !== 't_mu2r7vbpxr65');

    const TIERS = [[10, 5], [20, 10], [30, 20]];
    const oldMin = {};
    for (const id of ['t_read', 't_clarinet', 't_drum']) {
      const t = db.tasks.find(x => x.id === id);
      if (!t) continue;
      oldMin[id] = Number(t.minutes) || 20;
      t.tiers = TIERS;
      if (id === 't_read') t.name = '中文阅读';
      if (id === 't_clarinet') t.name = '单簧管练习';
      if (id === 't_drum') t.name = '架子鼓练习';
      if (id !== 't_read') t.kind = 'practice';
    }
    // 旧阅读记录归属阅读任务
    for (const r of db.reading) if (!r.taskId) r.taskId = 't_read';
    // 历史乐器打卡：按旧时长补上练习分钟，保证历史完成状态和已得分不变
    for (const c of db.checkins) {
      if (['t_clarinet', 't_drum'].includes(c.taskId) &&
          !db.reading.some(x => x.kidId === c.kidId && x.date === c.date && x.taskId === c.taskId)) {
        db.reading.push({ kidId: c.kidId, taskId: c.taskId, date: c.date, minutes: oldMin[c.taskId] || 20 });
      }
    }
    db.migratedTiers = true;
  }
  /* ---- 一次性迁移：英语 / Scholastic 也改按时长计分 ----
     英语用标准三档（20 分钟 = 10 分，价值不变）；Scholastic 用 15′=10 / 30′=20，
     保留原来 15 分钟拿 10 分的价值。历史打卡按旧建议时长补分钟，已完成状态和已得分都不变。 */
  if (!db.migratedTimedAll) {
    const eng = db.tasks.find(t => t.id === 't_english');
    if (eng) { eng.kind = 'practice'; eng.tiers = [[10, 5], [20, 10], [30, 20]]; eng.name = '英语练习'; }
    const sch = db.tasks.find(t => t.id === 't_scholastic');
    if (sch) { sch.kind = 'practice'; sch.tiers = [[15, 10], [30, 20]]; sch.name = 'Scholastic 阅读'; }
    for (const c of db.checkins) {
      if (['t_english', 't_scholastic'].includes(c.taskId) &&
          !db.reading.some(x => x.kidId === c.kidId && x.date === c.date && x.taskId === c.taskId)) {
        db.reading.push({ kidId: c.kidId, taskId: c.taskId, date: c.date, minutes: c.taskId === 't_english' ? 20 : 15 });
      }
    }
    db.migratedTimedAll = true;
  }
  /* ---- 学院色以 HOUSES 为准，旧数据里写死的颜色一并纠正 ---- */
  for (const kid of db.kids) {
    if (!HOUSES[kid.house]) kid.house = 'ravenclaw';
    kid.color = houseOf(kid.house).color;
  }
}

let saveTimer = null;
function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const tmp = DB_FILE + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
      fs.renameSync(tmp, DB_FILE); // 原子写入
    } catch (e) {
      console.error('保存失败:', e.message);
    }
  }, 120);
}

function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---------------- derived state ---------------- */

const BADGES = [
  { id: 'b_feather', name: '羽毛笔', desc: '连续阅读 7 天', rule: 'readStreak', target: 7 },
  { id: 'b_timeturner', name: '时间转换器', desc: '5 天全部任务完成', rule: 'perfectDays', target: 5 },
  { id: 'b_climb', name: '岩壁征服者', desc: '攀岩满 5 次', rule: 'taskCount:t_climb', target: 5 },
  { id: 'b_drum', name: '鼓点大师', desc: '架子鼓满 10 次', rule: 'taskCount:t_drum', target: 10 },
  { id: 'b_snitch', name: '金色飞贼', desc: '单周学院分 2 600', rule: 'weekPoints', target: 2600 },
  { id: 'b_duel', name: '决斗俱乐部', desc: '合作任务满 10 次', rule: 'coopCount', target: 10 },
  { id: 'b_potion', name: '魔药课满分', desc: '独立完成一次实验', rule: 'manual', target: 1 },
  { id: 'b_owl', name: '猫头鹰信使', desc: '给老师写一封感谢信', rule: 'manual', target: 1 }
];

function kidById(id) { return db.kids.find(k => k.id === id); }

function checkinsOn(date) { return db.checkins.filter(c => c.date === date); }
function checkinsFor(kidId, date) { return db.checkins.filter(c => c.date === date && c.kidId === kidId); }

function readTaskId() {
  const t = db.tasks.find(x => x.kind === 'reading');
  return t ? t.id : 't_read';
}
// 某个孩子某天在某项「按时长计分」任务上积累的分钟数
function minutesOf(kidId, taskId, date) {
  const r = db.reading.find(x => x.kidId === kidId && x.date === date && (x.taskId || 't_read') === taskId);
  return r ? r.minutes : 0;
}
function readingMinutes(kidId, date) { return minutesOf(kidId, readTaskId(), date); }

// 阶梯计分：tiers = [[10,5],[20,10],[30,20]]，返回当前分钟对应的档位
function tierInfo(task, mins) {
  const tiers = (task.tiers || []).slice().sort((a, b) => a[0] - b[0]);
  let pts = 0, next = null;
  for (const tr of tiers) if (mins >= tr[0]) pts = tr[1];
  for (const tr of tiers) if (tr[0] > mins) { next = tr; break; }
  return { pts, next, max: tiers.length ? tiers[tiers.length - 1] : null };
}
// 分钟数变化后，同步这一天的打卡记录与分数：分 = 当前分钟数所在的档位
function syncMinutesCheckin(kidId, task, date) {
  const mins = minutesOf(kidId, task.id, date);
  const { pts } = tierInfo(task, mins);
  const idx = db.checkins.findIndex(c => c.kidId === kidId && c.taskId === task.id && c.date === date);
  if (pts > 0) {
    if (idx >= 0) db.checkins[idx].points = pts;
    else db.checkins.push({ id: uid('c'), kidId, taskId: task.id, date, points: pts, ts: Date.now() });
  } else if (idx >= 0) {
    db.checkins.splice(idx, 1); // 低于最低档（分钟被减回去），这条自动打卡随之撤掉
  }
}

function tasksForKidOnDate(kidId, date) {
  const wd = weekdayOf(date);
  return db.tasks.filter(t =>
    t.active &&
    Array.isArray(t.assignees) && t.assignees.includes(kidId) &&
    Array.isArray(t.days) && t.days.includes(wd)
  );
}

function isDone(kidId, taskId, date) {
  return db.checkins.some(c => c.kidId === kidId && c.taskId === taskId && c.date === date);
}

function pointsFor(kidId, fromDate, toDate) {
  return db.checkins
    .filter(c => c.kidId === kidId && c.date >= fromDate && c.date <= toDate)
    .reduce((s, c) => s + (c.points || 0), 0);
}

function streakOf(kidId, today) {
  let n = 0;
  let d = today;
  // 今天还没打卡不算断，从昨天起回溯
  if (checkinsFor(kidId, d).length === 0) d = addDays(d, -1);
  while (checkinsFor(kidId, d).length > 0) { n++; d = addDays(d, -1); if (n > 999) break; }
  return n;
}

function readStreakOf(kidId, today) {
  let n = 0;
  let d = today;
  const kid = kidById(kidId);
  if (!kid) return 0;
  if (readingMinutes(kidId, d) < kid.readingGoal) d = addDays(d, -1);
  while (readingMinutes(kidId, d) >= kid.readingGoal) { n++; d = addDays(d, -1); if (n > 999) break; }
  return n;
}

function perfectDaysOf(kidId, today) {
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const d = addDays(today, -i);
    const list = tasksForKidOnDate(kidId, d);
    if (list.length === 0) continue;
    if (list.every(t => isDone(kidId, t.id, d))) n++;
  }
  return n;
}

function taskCountOf(kidId, taskId) {
  return db.checkins.filter(c => c.kidId === kidId && c.taskId === taskId).length;
}

function coopCountOf(kidId) {
  const coopIds = db.tasks.filter(t => Array.isArray(t.assignees) && t.assignees.length > 1).map(t => t.id);
  return db.checkins.filter(c => c.kidId === kidId && coopIds.includes(c.taskId)).length;
}

function badgeProgress(kidId, today) {
  const wkStart = weekStart(today);
  const wkEnd = addDays(wkStart, 6);
  return BADGES.map(b => {
    let current = 0;
    switch (true) {
      case b.rule === 'readStreak': current = readStreakOf(kidId, today); break;
      case b.rule === 'perfectDays': current = perfectDaysOf(kidId, today); break;
      case b.rule === 'weekPoints': current = pointsFor(kidId, wkStart, wkEnd); break;
      case b.rule === 'coopCount': current = coopCountOf(kidId); break;
      case b.rule === 'manual': current = db.manualBadges[kidId + ':' + b.id] ? 1 : 0; break;
      case b.rule.startsWith('taskCount:'): current = taskCountOf(kidId, b.rule.split(':')[1]); break;
      default: current = 0;
    }
    return {
      id: b.id, name: b.name, desc: b.desc, target: b.target,
      current, unlocked: current >= b.target,
      pct: Math.min(100, Math.round((current / b.target) * 100))
    };
  });
}

function buildState(today) {
  const wkStart = weekStart(today);
  const wkEnd = addDays(wkStart, 6);
  const wd = weekdayOf(today);

  const perKid = {};
  for (const kid of db.kids) {
    let remainSum = 0, possibleSum = 0;
    const list = tasksForKidOnDate(kid.id, today).map(t => {
      const c = db.checkins.find(x => x.kidId === kid.id && x.taskId === t.id && x.date === today);
      const isMinutes = t.kind === 'reading' || t.kind === 'practice';
      const tMins = isMinutes ? minutesOf(kid.id, t.id, today) : 0;
      const ti = isMinutes ? tierInfo(t, tMins) : null;
      const firstTier = ti && t.tiers && t.tiers.length ? Math.min(...t.tiers.map(x => x[0])) : kid.readingGoal;
      const maxPts = ti && ti.max ? ti.max[1] : (t.points || 0);
      const curPts = ti ? ti.pts : (t.points || 0);
      const done = isMinutes ? (!!c || tMins >= firstTier) : !!c;
      // 还能再拿的分：按时长任务 = 最高档 - 当前档；普通任务 = 没打就得全分
      remainSum += isMinutes ? Math.max(0, maxPts - curPts) : (done ? 0 : (t.points || 0));
      possibleSum += isMinutes ? maxPts : (t.points || 0);
      return {
        id: t.id, name: t.name, icon: t.icon, kind: t.kind, time: t.time,
        points: curPts, minutes: t.minutes,
        practiced: isMinutes ? tMins : undefined,
        tiers: isMinutes ? (t.tiers || []) : undefined,
        maxPoints: isMinutes ? maxPts : undefined,
        assignees: t.assignees,
        done,
        ts: c ? c.ts : null
      };
    });

    const mins = readingMinutes(kid.id, today);
    const readTask = db.tasks.find(t => t.kind === 'reading' && t.assignees && t.assignees.includes(kid.id));
    const readTi = readTask ? tierInfo(readTask, mins) : null;
    const readGoal = readTi && readTi.max ? readTi.max[0] : kid.readingGoal;
    const badges = badgeProgress(kid.id, today);

    perKid[kid.id] = {
      kid,
      tasks: list,
      doneCount: list.filter(t => t.done).length,
      totalCount: list.length,
      dayPoints: pointsFor(kid.id, today, today),
      weekPoints: pointsFor(kid.id, wkStart, wkEnd),
      possiblePoints: possibleSum,
      remainPoints: remainSum,
      reading: {
        minutes: mins, goal: readGoal,
        pct: Math.min(100, Math.round((mins / Math.max(1, readGoal)) * 100)),
        remain: Math.max(0, readGoal - mins),
        pts: readTi ? readTi.pts : 0,
        tiers: readTask ? (readTask.tiers || []) : [],
        next: readTi ? readTi.next : null
      },
      streak: streakOf(kid.id, today),
      readStreak: readStreakOf(kid.id, today),
      badges,
      unlockedBadges: badges.filter(b => b.unlocked).length,
      nextBadge: badges.filter(b => !b.unlocked).sort((a, b2) => b2.pct - a.pct)[0] || null
    };
  }

  const houseCup = {};
  for (const kid of db.kids) {
    houseCup[kid.house] = (houseCup[kid.house] || 0) + perKid[kid.id].weekPoints;
  }

  // 最近 7 天全家总分（柱状图）
  const weekBars = [];
  for (let i = 0; i <= 6; i++) {
    const d = addDays(wkStart, i);
    const total = db.kids.reduce((s, k) => s + pointsFor(k.id, d, d), 0);
    weekBars.push({ date: d, label: '一二三四五六日'[weekdayOf(d) - 1], points: total, isToday: d === today });
  }

  // 最近记录（可撤回）
  const recent = db.checkins
    .slice()
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 20)
    .map(c => ({
      id: c.id, kidId: c.kidId, kidName: (kidById(c.kidId) || {}).name,
      taskId: c.taskId, taskName: ((db.tasks.find(t => t.id === c.taskId) || {}).name) || '已删除的打卡项',
      date: c.date, points: c.points, ts: c.ts
    }));

  // 课表：任务 + 家庭活动，同一份数据源
  const schedule = [];
  for (let d = 1; d <= 7; d++) {
    const items = [];
    for (const t of db.tasks) {
      if (!t.active) continue;
      if (!Array.isArray(t.days) || !t.days.includes(d)) continue;
      items.push({
        id: t.id, name: t.name, time: t.time || '', icon: t.icon,
        assignees: t.assignees, kind: 'task', atSchool: false, points: t.points
      });
    }
    for (const a of db.activities) {
      if (a.day !== d) continue;
      items.push({
        id: a.id, name: a.name, time: a.time || '', icon: a.icon || 'star',
        assignees: a.assignees, kind: 'activity', atSchool: !!a.atSchool, points: 0
      });
    }
    items.sort((x, y) => String(x.time).localeCompare(String(y.time)));
    schedule.push({ day: d, label: '一二三四五六日'[d - 1], items });
  }

  const familyWeekPoints = db.kids.reduce((s, k) => s + perKid[k.id].weekPoints, 0);

  // 家庭挑战
  // 课外课 = 只派给一个孩子的任务（每天两人共同的那几项是固定流程，不算）。
  // 这样家长增删课外课，目标节数会自动跟着变，不用改代码。
  const extraTasks = db.tasks.filter(t => t.active && Array.isArray(t.assignees) && t.assignees.length === 1);
  const EXTRA_IDS = extraTasks.map(t => t.id);
  const extraTarget = extraTasks.reduce((n, t) => n + (Array.isArray(t.days) ? t.days.length : 0), 0);
  let readBothDays = 0, extraCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(wkStart, i);
    const allRead = db.kids.every(k => readingMinutes(k.id, d) >= k.readingGoal);
    if (allRead) readBothDays++;
    extraCount += db.checkins.filter(c => EXTRA_IDS.includes(c.taskId) && c.date === d).length;
  }
  if (extraTarget > 0) extraCount = Math.min(extraCount, extraTarget);
  const extraKinds = [...new Set(extraTasks.map(t => String(t.name).replace(/[0-9]+|[ 　]*分钟.*$/g, '').trim()))].filter(Boolean);
  const challenges = [
    { id: 'c_read', icon: 'book', name: '一周不漏阅读', desc: '两个人都达标才算一天 · 奖励 +50 学院分', current: readBothDays, target: 7 },
    {
      id: 'c_extra', icon: 'climb', name: '本周课外课全勤',
      desc: (extraKinds.length ? extraKinds.join(' / ') + '，' : '') + '一节课都不落下 · 奖励 +30 学院分',
      current: extraCount, target: Math.max(1, extraTarget)
    }
  ];

  return {
    today, weekday: wd, week: { start: wkStart, end: wkEnd },
    kids: db.kids, perKid, houseCup, weekBars, recent, schedule, challenges,
    houses: HOUSES,
    familyWeekPoints,
    allTasks: db.tasks,
    allActivities: db.activities,
    lockWeekInDays: 7 - wd
  };
}

/* ---------------- http ---------------- */

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', c => {
      buf += c;
      if (buf.length > 2e6) { req.destroy(); reject(new Error('body too large')); }
    });
    req.on('end', () => {
      if (!buf) return resolve({});
      try { resolve(JSON.parse(buf)); } catch (e) { reject(new Error('bad json')); }
    });
    req.on('error', reject);
  });
}

// 密码三种入口都认：自定义头 / query 参数 / 请求体。
// 原因：页面经过某些代理或预览层转发时，自定义请求头会被丢掉，只认 header 会永远 401。
function pinFrom(req, extras) {
  const h = req.headers['x-pin'];
  if (h != null && String(h) !== '') return String(h);
  for (const ex of extras) {
    if (!ex) continue;
    try {
      if (typeof ex.get === 'function') {
        const v = ex.get('pin');
        if (v != null && String(v) !== '') return String(v);
      }
    } catch (e) { /* 不是 URLSearchParams，忽略 */ }
    if (ex.pin != null && String(ex.pin) !== '') return String(ex.pin);
  }
  return '';
}

function needPin(req, res, ...extras) {
  const pin = pinFrom(req, extras);
  if (!pin || pin !== String(db.pin)) {
    sendJson(res, 401, { error: '需要家长密码' });
    return false;
  }
  return true;
}

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  const filePath = path.join(PUBLIC_DIR, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(d2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  const urlPath = url.split('?')[0];

  if (!urlPath.startsWith('/api/')) return serveStatic(req, res, url);

  try {
    const q = new URLSearchParams((url.split('?')[1] || ''));
    // 提前声明，下面的 GET 分支（密码校验）也要用到
    const body = (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')
      ? await readBody(req) : {};

    /* ---- 读 ---- */
    if (req.method === 'GET' && urlPath === '/api/verify-pin') {
      if (!needPin(req, res, q, body)) return;
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,x-pin',
        'Access-Control-Max-Age': '86400'
      });
      return res.end();
    }

    if (req.method === 'GET' && urlPath === '/api/state') {
      const d = q.get('date');
      const today = isValidDate(d) ? d : todayLocal();
      return sendJson(res, 200, buildState(today));
    }

    if (req.method === 'GET' && urlPath === '/api/export') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="hogwarts-backup-' + todayLocal() + '.json"'
      });
      return res.end(JSON.stringify(db, null, 2));
    }

    /* ---- 密码校验（POST 版本，走请求体，最不容易被代理拦） ---- */
    if (req.method === 'POST' && urlPath === '/api/verify-pin') {
      if (!needPin(req, res, q, body)) return;
      return sendJson(res, 200, { ok: true });
    }

    /* ---- 打卡（孩子自己就能做） ---- */
    if (req.method === 'POST' && urlPath === '/api/checkin') {
      const { kidId, taskId, date, done } = body;
      if (!kidById(kidId)) return sendJson(res, 400, { error: '找不到孩子' });
      const task = db.tasks.find(t => t.id === taskId);
      if (!task) return sendJson(res, 400, { error: '找不到打卡项' });
      const day = isValidDate(date) ? date : todayLocal();

      if (done === false) {
        db.checkins = db.checkins.filter(c => !(c.kidId === kidId && c.taskId === taskId && c.date === day));
      } else {
        // 按时长计分的任务不能手动勾：分数由练习/阅读分钟数自动算
        if (task.kind === 'reading' || task.kind === 'practice') {
          return sendJson(res, 400, { error: '这项按时长自动计分，记录分钟数就行' });
        }
        if (!db.checkins.some(c => c.kidId === kidId && c.taskId === taskId && c.date === day)) {
          db.checkins.push({ id: uid('c'), kidId, taskId, date: day, points: task.points || 0, ts: Date.now() });
        }
      }
      save();
      return sendJson(res, 200, { ok: true });
    }

    /* ---- 练习/阅读分钟（孩子自己就能记；按时长任务通用） ---- */
    if (req.method === 'POST' && urlPath === '/api/reading') {
      const { kidId, taskId, date, minutes, mode } = body;
      if (!kidById(kidId)) return sendJson(res, 400, { error: '找不到孩子' });
      const day = isValidDate(date) ? date : todayLocal();
      const delta = Number(minutes);
      if (!isFinite(delta)) return sendJson(res, 400, { error: '分钟数不对' });

      // 不传 taskId = 传统的阅读任务；传了就是对应的练习任务
      let task = null;
      if (taskId) task = db.tasks.find(t => t.id === taskId);
      if (!task) task = db.tasks.find(t => t.kind === 'reading' && t.assignees && t.assignees.includes(kidId));
      if (!task) return sendJson(res, 400, { error: '找不到对应任务' });

      let rec = db.reading.find(x => x.kidId === kidId && x.date === day && (x.taskId || 't_read') === task.id);
      if (!rec) { rec = { kidId, taskId: task.id, date: day, minutes: 0 }; db.reading.push(rec); }

      if (mode === 'set') rec.minutes = Math.max(0, Math.round(delta));
      else rec.minutes = Math.max(0, rec.minutes + Math.round(delta));

      // 按阶梯同步打卡与分数（达到 10/20/30 分钟档自动 +5/+10/+20）
      syncMinutesCheckin(kidId, task, day);
      save();
      return sendJson(res, 200, { ok: true, minutes: rec.minutes });
    }

    /* ---- 家长操作：撤回 ---- */
    if (req.method === 'POST' && urlPath === '/api/undo') {
      if (!needPin(req, res, q, body)) return;
      const id = body.id;
      const before = db.checkins.length;
      db.checkins = db.checkins.filter(c => c.id !== id);
      save();
      return sendJson(res, 200, { ok: true, removed: before - db.checkins.length });
    }

    /* ---- 家长操作：任务 CRUD ---- */
    if (urlPath === '/api/tasks' && (req.method === 'POST' || req.method === 'PUT')) {
      if (!needPin(req, res, q, body)) return;
      const t = body.task || body;
      if (!t || !t.name) return sendJson(res, 400, { error: '缺少名称' });
      // 编辑已有项时先铺底原值：只改传来的字段，没传的保持原样，
      // 否则图标/时间/周期会被这里的默认值冲掉（编辑功能就废了）
      const existT = t.id ? db.tasks.find(x => x.id === t.id) : null;
      const srcT = existT ? Object.assign({}, existT, t) : t;
      const clean = {
        id: srcT.id || uid('t'),
        name: String(srcT.name).slice(0, 40),
        icon: srcT.icon || 'star',
        kind: ['reading', 'practice'].includes(srcT.kind) ? srcT.kind : 'normal',
        time: srcT.time || '',
        points: Math.max(0, Number(srcT.points) || 0),
        minutes: Math.max(0, Number(srcT.minutes) || 0),
        tiers: ['reading', 'practice'].includes(srcT.kind)
          ? (Array.isArray(srcT.tiers) && srcT.tiers.length
              ? srcT.tiers.map(x => [Math.max(0, Number(x[0]) || 0), Math.max(0, Number(x[1]) || 0)])
              : [[10, 5], [20, 10], [30, 20]])
          : undefined,
        days: Array.isArray(srcT.days) ? srcT.days.map(Number).filter(n => n >= 1 && n <= 7) : [1, 2, 3, 4, 5, 6, 7],
        assignees: Array.isArray(srcT.assignees) && srcT.assignees.length ? srcT.assignees : db.kids.map(k => k.id),
        active: srcT.active === false ? false : true
      };
      if (clean.tiers === undefined) delete clean.tiers;
      const idx = db.tasks.findIndex(x => x.id === clean.id);
      if (idx >= 0) db.tasks[idx] = clean;
      else db.tasks.push(clean);
      save();
      return sendJson(res, 200, { ok: true, task: clean });
    }

    if (req.method === 'DELETE' && urlPath.startsWith('/api/tasks/')) {
      if (!needPin(req, res, q, body)) return;
      const id = urlPath.split('/').pop();
      db.tasks = db.tasks.filter(t => t.id !== id);
      db.checkins = db.checkins.filter(c => c.taskId !== id);
      save();
      return sendJson(res, 200, { ok: true });
    }

    /* ---- 家长操作：家庭活动 CRUD（课表上的非任务项） ---- */
    if (urlPath === '/api/activities' && (req.method === 'POST' || req.method === 'PUT')) {
      if (!needPin(req, res, q, body)) return;
      const a = body.activity || body;
      if (!a || !a.name) return sendJson(res, 400, { error: '缺少名称' });
      // 同上：编辑已有活动时按原值铺底，没传的字段不被默认值覆盖
      const existA = a.id ? db.activities.find(x => x.id === a.id) : null;
      const srcA = existA ? Object.assign({}, existA, a) : a;
      const clean = {
        id: srcA.id || uid('a'),
        name: String(srcA.name).slice(0, 40),
        day: Math.min(7, Math.max(1, Number(srcA.day) || 1)),
        time: srcA.time || '',
        assignees: Array.isArray(srcA.assignees) && srcA.assignees.length ? srcA.assignees : db.kids.map(k => k.id),
        atSchool: !!srcA.atSchool
      };
      const idx = db.activities.findIndex(x => x.id === clean.id);
      if (idx >= 0) db.activities[idx] = clean;
      else db.activities.push(clean);
      save();
      return sendJson(res, 200, { ok: true, activity: clean });
    }

    if (req.method === 'DELETE' && urlPath.startsWith('/api/activities/')) {
      if (!needPin(req, res, q, body)) return;
      const id = urlPath.split('/').pop();
      db.activities = db.activities.filter(a => a.id !== id);
      save();
      return sendJson(res, 200, { ok: true });
    }

    /* ---- 重新分院：孩子自己也能改（不带家长密码），分数挂在孩子身上所以原样保留 ---- */
    if (req.method === 'POST' && urlPath === '/api/kid') {
      const k = body.kid || body;
      const kid = db.kids.find(x => x.id === k.id);
      if (!kid) return sendJson(res, 404, { error: '没有这个孩子' });
      if (k.house !== undefined) {
        if (!HOUSES[k.house]) return sendJson(res, 400, { error: '没有这个学院' });
        kid.house = k.house;
        kid.color = houseOf(k.house).color;
      }
      // 其余字段属于家长配置，必须带密码
      const rest = ['name', 'role', 'age', 'grade', 'readingGoal', 'tags'];
      if (rest.some(f => k[f] !== undefined)) {
        if (!needPin(req, res, q, body)) return;
        if (k.name !== undefined) kid.name = String(k.name).slice(0, 20);
        if (k.role !== undefined) kid.role = String(k.role).slice(0, 10);
        if (k.age !== undefined) kid.age = Number(k.age) || kid.age;
        if (k.grade !== undefined) kid.grade = String(k.grade).slice(0, 12);
        if (k.readingGoal !== undefined) kid.readingGoal = Math.max(0, Number(k.readingGoal) || 0);
        if (Array.isArray(k.tags)) kid.tags = k.tags.map(String).slice(0, 8);
      }
      save();
      return sendJson(res, 200, { ok: true, kid });
    }

    /* ---- 家长操作：手动徽章 ---- */
    if (req.method === 'POST' && urlPath === '/api/badge') {
      if (!needPin(req, res, q, body)) return;
      const { kidId, badgeId, unlocked } = body;
      const key = kidId + ':' + badgeId;
      if (unlocked) db.manualBadges[key] = true;
      else delete db.manualBadges[key];
      save();
      return sendJson(res, 200, { ok: true });
    }

    /* ---- 家长操作：导入备份 ---- */
    if (req.method === 'POST' && urlPath === '/api/import') {
      if (!needPin(req, res, q, body)) return;
      const incoming = body.db || body;
      if (!incoming || !Array.isArray(incoming.kids)) return sendJson(res, 400, { error: '备份文件格式不对' });
      db = incoming;
      migrate();
      save();
      return sendJson(res, 200, { ok: true });
    }

    /* ---- 家长操作：改密码 ---- */
    if (req.method === 'POST' && urlPath === '/api/pin') {
      if (!needPin(req, res, q, body)) return;
      const p = String(body.pin || '');
      if (!/^\d{4,6}$/.test(p)) return sendJson(res, 400, { error: '密码要是 4-6 位数字' });
      db.pin = p;
      save();
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { error: 'not found' });
  } catch (e) {
    console.error(e);
    return sendJson(res, 500, { error: e.message || 'server error' });
  }
});

load();
server.listen(PORT, '0.0.0.0', () => {
  console.log('霍格沃茨每日打卡 → http://localhost:' + PORT);
});
