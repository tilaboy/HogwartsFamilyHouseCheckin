#!/usr/bin/env bash
# 霍格沃茨打卡 · 上传并重启（在自己的电脑上跑）
#
#   SERVER=root@1.2.3.4 bash deploy/deploy.sh
#
# 每次部署做四件事：
#   1. 从当前线上链接把最新数据拉下来（带 JSON 校验 + 重试，防止拿到半截文件）
#   2. 把代码同步到服务器（不动服务器上的数据目录）
#   3. 服务器还没有数据文件时，才用刚拉到的数据初始化它
#   4. 重启服务并做健康检查
#
# 服务器上的数据永远优先。想强制用本地/线上的数据覆盖，加 --force-data。

set -euo pipefail

SERVER="${SERVER:-}"
LIVE_URL="${LIVE_URL:-https://deploy-probe-check-21610.app.workbuddy.host}"
APP_DIR=/opt/hogwarts-checkin/app
DATA_FILE=/var/lib/hogwarts-checkin/db.json
FORCE_DATA=0

for arg in "$@"; do
  [[ "$arg" == "--force-data" ]] && FORCE_DATA=1
done

log() { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m!!\033[0m %s\n' "$*" >&2; exit 1; }

# node 不一定在 PATH 里（尤其是 WorkBuddy 自带的运行时），逐个候选找一遍
NODE=""
for c in "$(command -v node 2>/dev/null)" /usr/local/bin/node /opt/homebrew/bin/node \
         "$HOME"/.workbuddy/binaries/node/versions/*/bin/node; do
  [[ -n "$c" && -x "$c" ]] && NODE="$c" && break
done
[[ -n "$NODE" ]] || die "本机找不到 node，无法做数据校验"

[[ -n "$SERVER" ]] || die "请指定服务器：SERVER=root@1.2.3.4 bash deploy/deploy.sh"
cd "$(dirname "$0")/.."
[[ -f server.js ]] || die "请从项目根目录运行"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# ---------- 1. 拉取当前线上数据 ----------
log "拉取线上最新数据"
PULLED=0
for i in 1 2 3 4 5 6; do
  if curl -fsS -m 120 "$LIVE_URL/api/export" -o "$TMP/live.json" 2>/dev/null; then
    if "$NODE" -e "JSON.parse(require('fs').readFileSync('$TMP/live.json','utf8'))" 2>/dev/null; then
      PULLED=1
      "$NODE" -e "
        const d=require('$TMP/live.json');
        console.log('   打卡 '+d.checkins.length+' 条 / 任务 '+d.tasks.length+' 个 / 阅读记录 '+(d.reading||[]).length+' 条');
      "
      break
    fi
    echo "   第 $i 次拿到的文件不完整，重试"
  else
    echo "   第 $i 次请求失败，重试"
  fi
  sleep 3
done
[[ "$PULLED" == 1 ]] || log "线上暂时拉不到（跳过）。服务器已有数据不受影响。"

# ---------- 2. 同步代码 ----------
log "同步代码 → $SERVER:$APP_DIR"
rsync -az --delete \
  --exclude 'data/' \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  ./ "$SERVER:$APP_DIR/"

# ---------- 3. 初始化数据 ----------
if [[ "$PULLED" == 1 ]]; then
  REMOTE_HAS="$(ssh "$SERVER" "test -f $DATA_FILE && echo yes || echo no")"
  if [[ "$REMOTE_HAS" == "no" || "$FORCE_DATA" == 1 ]]; then
    if [[ "$FORCE_DATA" == 1 && "$REMOTE_HAS" == "yes" ]]; then
      BACKUP="$DATA_FILE.before-$(date +%Y%m%d-%H%M%S)"
      log "备份服务器现有数据 → $BACKUP"
      ssh "$SERVER" "cp $DATA_FILE $BACKUP"
    fi
    log "初始化服务器数据"
    scp -q "$TMP/live.json" "$SERVER:$DATA_FILE.new"
    ssh "$SERVER" "mv $DATA_FILE.new $DATA_FILE && chown hogwarts:hogwarts $DATA_FILE && chmod 640 $DATA_FILE"
  else
    log "服务器已有数据，保留不动（要用线上数据覆盖加 --force-data）"
  fi
fi

# ---------- 4. 重启并检查 ----------
log "重启服务"
ssh "$SERVER" "systemctl restart hogwarts-checkin && sleep 2 && systemctl is-active hogwarts-checkin"

log "健康检查"
OK=0
for i in 1 2 3 4 5; do
  if ssh "$SERVER" "curl -fsS -m 5 http://127.0.0.1:3000/api/state >/dev/null"; then
    OK=1
    break
  fi
  sleep 2
done

if [[ "$OK" == 1 ]]; then
  ssh "$SERVER" "curl -fsS -m 5 http://127.0.0.1:3000/api/state" > "$TMP/state.json"
  "$NODE" -e "
    const s=require('$TMP/state.json');
    console.log('   学院杯  '+JSON.stringify(s.houseCup));
    console.log('   任务    '+s.allTasks.length+' 个（计时任务 '+s.allTasks.filter(t=>t.tiers).length+' 个）');
    console.log('   身份    '+s.kids.map(k=>k.name+'('+k.house+')').join(' / '));
  "
  IP="${SERVER#*@}"; IP="${IP%%:*}"
  log "部署完成"
  echo
  echo "  现在就可以用了：http://$IP:3000"
  echo
  echo "  想换成自己的域名 + HTTPS："
  echo "    1. 域名解析到这台服务器，并完成 ICP 备案"
  echo "    2. 服务器上执行：apt install -y caddy"
  echo "    3. 按 deploy/Caddyfile 改一行域名，复制到 /etc/caddy/Caddyfile"
  echo "    4. systemctl reload caddy"
else
  die "服务没起来，看日志：ssh $SERVER 'journalctl -u hogwarts-checkin -n 50 --no-pager'"
fi
