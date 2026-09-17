#!/usr/bin/env bash
# 霍格沃茨打卡 · 服务器初始化（Ubuntu 22.04 / 24.04，Debian 12 同样可用）
#
# 在一台刚买好的轻量服务器上跑一次即可，可以重复执行。
#   sudo bash setup.sh
#
# 做的事：装 Node 22 → 建专用低权限用户 → 建代码目录 / 数据目录
#         → 注册 systemd 服务（开机自启 + 崩溃自动重启）→ 每日自动备份 → 防火墙
#
# 目录约定（刻意把数据和代码分开，更新代码永远动不到数据）：
#   /opt/hogwarts-checkin/app   代码，每次部署整体替换
#   /var/lib/hogwarts-checkin   数据 db.json，只有应用自己写
#   /var/backups/hogwarts-checkin  每日备份，保留 30 天

set -euo pipefail

APP_USER=hogwarts
APP_DIR=/opt/hogwarts-checkin
APP_CODE="$APP_DIR/app"
DATA_DIR=/var/lib/hogwarts-checkin
BACKUP_DIR=/var/backups/hogwarts-checkin
PORT=3000

log() { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m!!\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "请用 root 运行：sudo bash setup.sh"

log "安装系统包"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl ca-certificates gnupg rsync ufw cron

NODE_MAJOR=0
command -v node >/dev/null 2>&1 && NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
if [[ "$NODE_MAJOR" -lt 18 ]]; then
  log "安装 Node.js 22 LTS"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
log "Node 版本：$(node -v)"

if ! id -u "$APP_USER" >/dev/null 2>&1; then
  log "创建低权限用户 $APP_USER"
  useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
fi

log "创建目录"
install -d -o "$APP_USER" -g "$APP_USER" -m 755 "$APP_CODE"
install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$DATA_DIR"
install -d -m 750 "$BACKUP_DIR"

log "注册 systemd 服务"
cat > /etc/systemd/system/hogwarts-checkin.service <<'UNIT'
[Unit]
Description=Hogwarts family check-in
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=hogwarts
Group=hogwarts
WorkingDirectory=/opt/hogwarts-checkin/app
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATA_DIR=/var/lib/hogwarts-checkin
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal
SyslogIdentifier=hogwarts-checkin
# 加固：整个文件系统只读，只放开数据目录
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/hogwarts-checkin

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable hogwarts-checkin.service >/dev/null

log "配置每日备份（保留 30 天）"
cat > /etc/cron.daily/hogwarts-backup <<'CRON'
#!/bin/sh
# 每天把打卡数据另存一份，只留在本机，不参与代码更新
set -e
SRC=/var/lib/hogwarts-checkin/db.json
DST=/var/backups/hogwarts-checkin
[ -f "$SRC" ] || exit 0
cp "$SRC" "$DST/db-$(date +%F-%H%M).json"
ls -1t "$DST"/db-*.json 2>/dev/null | tail -n +31 | xargs -r rm -f
CRON
chmod 755 /etc/cron.daily/hogwarts-backup

log "配置防火墙"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 80/tcp  >/dev/null 2>&1 || true
ufw allow 443/tcp >/dev/null 2>&1 || true
ufw allow "${PORT}/tcp" >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

cat <<EOF

$(log "服务器准备完毕")

  代码目录  $APP_CODE
  数据目录  $DATA_DIR
  备份目录  $BACKUP_DIR

下一步：在你自己的电脑上跑
  SERVER=root@<服务器公网IP> bash deploy/deploy.sh

提醒：如果打算用域名访问，先在云厂商控制台把这个域名解析到本机，
      并在服务器上完成 ICP 备案，再参考 deploy/Caddyfile 开启 HTTPS。
EOF
