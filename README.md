# 霍格沃茨家庭分院 · 每日打卡

> A Hogwarts-themed daily habit check-in web app for two kids and their parents.
> Parent-tap self-reporting, house points, a weekly House Cup, badges, and a
> tablet-first parchment UI. Zero dependencies — a single Node.js file plus a
> vanilla JS front end.

为 Amelia（10 岁，G5-2，拉文克劳）和 Aiden（7 岁，G2-1，格兰芬多）做的家庭打卡网站。
两台平板访问同一个地址，数据实时同步。**零依赖，一个文件的后端，一个端口。**

---

## 跑起来

```bash
node server.js
# 默认 http://localhost:3000；换端口：PORT=4173 node server.js
```

首次运行会自动生成一份初始数据（`data/db.json`），不需要手动建库。

家里用：同一 WiFi 下，平板浏览器打开 `http://<电脑局域网 IP>:3000`，
iPad 上「分享 → 添加到主屏幕」就变成一个全屏 App 图标。

---

## 四屏

| 屏 | 内容 |
|---|---|
| **今日打卡** | 两个孩子各一列：本周分数、连续打卡、晨间/放学后分组任务、阅读卡、乐器练习档位 |
| **课后课表** | 每天分「早晨 / 放学后」两段，课外课按孩子所在学院配色，家庭活动共用同一份数据源 |
| **学院分与徽章** | 学院杯（各院独立配色进度条 + 得分）、最近 7 天柱状图、加分流水（可撤回）、徽章墙、家庭挑战 |
| **家长端** | 打卡项与活动增删改、分值调整、导出/导入备份（**需要家长密码，默认 1234**） |

---

## 核心机制

### 分院帽开场
进入先问「今天是谁」→ 选择四个学院之一（可保持当前）→ 宣布结果。
**换学院分数随身携带**：分数记录挂在孩子 id 上，换院只改配色与徽章，历史分一分不少。

### 身份锁定
`localStorage.hw_who` 记住当前身份（孩子 id 或 `parent`）。
孩子只能给自己的任务打卡，对方的整列灰化只读，点击弹出提示而不是写库。
家长视角入口在密码校验之后，孩子点不进去。

### 阶梯计分
阅读与乐器练习按时长给分，而不是固定值：

| 时长 | 得分 |
|---|---|
| 10 分钟 | 5 分 |
| 20 分钟 | 10 分 |
| 30 分钟 | 20 分 |

行上直接 `−5 / +5 / +10` 加分钟，分值严格跟随当前档位同步（分钟降回去分数也降回去，
低于首档自动撤销该次打卡）。跨档时才触发存钱罐动效。

### 存钱罐动效
每完成一项任务：金币从上方落入投币口 → 小猪被砸压扁回弹 → 金色「+N 分」浮起 →
底部胶囊显示「名字 · 本周已存 X 分」。全部 CSS keyframes，不引第三方动画库。

### 自动计算的挑战
「本周课外课全勤」这类挑战的目标值由排课自动推导
（只派给一个孩子的进行中任务 × 各自开课天数），家长增删课外课无需改代码。

### 数据安全约定
- 每次改动 **原子写入**（先写临时文件再 rename），断电不会写坏。
- 一次性迁移用 `db.migratedXxx` 布尔位守卫，家长手动删掉的项不会被迁移逻辑反复加回来。
- `data/db.json` 内含真实家庭数据，**已在 `.gitignore` 中排除**，不会进版本库。

---

## 数据与备份

数据存在 `data/db.json`（不入库，首次运行自动生成）。

**换机器或担心丢数据**，家长端点「导出备份」下载一个 json，再导回来：

```bash
curl -X POST http://host/api/import \
  -H 'x-pin: 1234' -H 'Content-Type: application/json' \
  --data-binary @备份.json
```

改家长密码：

```bash
curl -X POST http://localhost:3000/api/pin \
  -H 'x-pin: 1234' -H 'Content-Type: application/json' \
  -d '{"pin":"6688"}'
```

---

## 接口

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| GET | `/api/state?date=YYYY-MM-DD` | 公开 | 全量状态（日期按访问设备时区） |
| GET | `/api/verify-pin` | 公开 | 校验家长密码 |
| POST | `/api/checkin` | 公开 | 完成 / 取消完成（阅读与练习类禁用，须走分钟数） |
| POST | `/api/reading` | 公开 | 累加或设定阅读/练习分钟数（`taskId` 指定任务） |
| POST | `/api/undo` | 家长 | 撤回一条加分记录 |
| POST | `/api/kid` | 公开 | 换学院（只改 house / color，分数保留） |
| POST/PUT | `/api/tasks` | 家长 | 新建或修改打卡项（字段级合并，不覆盖未传字段） |
| DELETE | `/api/tasks/:id` | 家长 | 删除打卡项 |
| POST/PUT | `/api/activities` | 家长 | 课表上的家庭活动 |
| DELETE | `/api/activities/:id` | 家长 | 删除活动 |
| POST | `/api/badge` | 家长 | 手动解锁徽章 |
| GET/POST | `/api/export` `/api/import` | 家长 | 备份 / 恢复 |
| POST | `/api/pin` | 家长 | 改家长密码 |

家长权限通过 `x-pin` 请求头、URL 参数或请求体任一路径校验。

---

## 技术栈

- **后端**：Node.js，仅用内置 `node:http` / `node:fs`，无任何 npm 依赖
- **前端**：原生 JS 单页应用 + 原生 CSS，无框架、无构建步骤
- **持久化**：单个 JSON 文件，原子写入
- **规模**：`server.js` 约 790 行，`public/app.js` 约 980 行，`public/styles.css` 约 555 行
- **适配**：平板 / 触屏优先，支持添加到主屏幕全屏运行，两台设备 4 秒轮询自动同步
