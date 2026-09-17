# 部署到自己的服务器

把这个应用从分享沙箱搬到一台自己长期持有的轻量服务器。跑完之后链接固定、数据在自己手里、断电重启自动恢复，不再有沙箱重建丢数据的风险。

## 为什么这么做

应用是零依赖 Node 服务，数据写在**一个 JSON 文件**里（不是数据库）。这决定了托管方必须提供**一块真磁盘**——所以任何「文件系统用完即弃」的免费 PaaS（Render 免费版、Vercel、Netlify 等）都不合适，一重新部署记录就没了。

这个部署方案把代码和数据**分开放在两个目录**，从结构上保证更新代码永远碰不到打卡记录：

| 路径 | 内容 | 更新代码时会动吗 |
|---|---|---|
| `/opt/hogwarts-checkin/app` | 代码 | 会，整体替换 |
| `/var/lib/hogwarts-checkin/db.json` | 打卡数据 | **不会** |
| `/var/backups/hogwarts-checkin/` | 每日备份（留 30 天） | 不会 |

## 步骤

### 1. 买服务器

腾讯云或阿里云「轻量应用服务器」，最低配（1 核 1G 或 2 核 2G）就绰绰有余——这个应用常驻内存不到 50MB。首年促销常见 ¥38–99，续费约 ¥100–300/年。

系统镜像选 **Ubuntu 24.04 LTS**。

> 顺带把云厂商控制台的**防火墙 / 安全组**打开：22（SSH）、3000（先用 IP 访问）。以后要用域名再加 80 和 443。

### 2. 初始化服务器（一次就够）

```bash
scp -r deploy root@<服务器IP>:/tmp/
ssh root@<服务器IP> 'sudo bash /tmp/deploy/setup.sh'
```

脚本会装 Node 22、建一个不能登录的低权限用户 `hogwarts`、注册开机自启的服务、配好每日备份和防火墙。脚本可以重复执行，不会重复建东西。

### 3. 上传代码

在自己的电脑上，项目根目录执行：

```bash
SERVER=root@<服务器IP> bash deploy/deploy.sh
```

它会先把当前线上链接的数据拉下来（带 JSON 校验和重试，防止拿到半截文件中招），再同步代码、初始化数据、重启、做健康检查并打印学院杯——确认没丢东西。

完成后访问 **`http://<服务器IP>:3000`** 就能用了。

### 4. 换成自己的域名（可选）

不做也完全能用，只是 `IP:3000` 这个地址不好记，而且没有 HTTPS。

要做的话：

1. 域名解析到服务器 IP
2. **在服务器上完成 ICP 备案**（免费，云厂商控制台提交，通常 1–2 周；国内服务器绑域名对外提供服务的必要条件）
3. 备案通过后：

```bash
ssh root@<服务器IP>
apt install -y caddy
# 把 deploy/Caddyfile 里的 checkin.example.com 换成你的域名
systemctl reload caddy
```

Caddy 会自动申请并续期证书，不用手动管。

## 日常维护

**改动代码后重新部署** → 再跑一次第 3 步。数据不动。

**数据备份** → 每天自动存到 `/var/backups/hogwarts-checkin/`，保留 30 天。也可以随时在家长端点「导出备份」存一份到自己电脑。

**把备份恢复到服务器** →

```bash
scp db-2026-09-17-0300.json root@<服务器IP>:/var/lib/hogwarts-checkin/db.json
ssh root@<服务器IP> 'systemctl restart hogwarts-checkin'
```

**看日志** →

```bash
ssh root@<服务器IP> 'journalctl -u hogwarts-checkin -n 100 --no-pager'
```

**确认数据落在哪** → 应用支持 `DATA_DIR` 环境变量（见 `server.js` 顶部）。systemd 单元里已固定指向 `/var/lib/hogwarts-checkin`，本地开发不设这个变量，仍然用项目内的 `data/`。

## 提醒

服务器上的数据是**唯一真源**。`deploy.sh` 默认在服务器已有数据时**绝不用线上数据覆盖**，只有初次部署（或显式 `--force-data`）才会写入。要把沙箱上的记录搬过来，初次部署那一次就够了。
