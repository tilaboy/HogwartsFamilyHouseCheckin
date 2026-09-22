# fly.io 部署套件（备用方案）

这套是给 [fly.io](https://fly.io) 用的容器部署配置，作为「平台分享链接」之外的长期自托管备选。

用法：把下面三个文件放到**项目根目录**（和 `server.js` 同级），再执行 `fly deploy`：

```
hogwarts-checkin/
  server.js
  public/
  package.json
  Dockerfile        ← 从这里复制
  fly.toml          ← 从这里复制
  .dockerignore     ← 从这里复制
```

要点：

- `fly.toml` 里挂了持久卷 `hogwarts_data` → `/app/data`，打卡数据不会因为重新部署而丢；
- 首次部署前需要 `fly volumes create hogwarts_data --size 1`；
- 默认 `PORT=3000`、`min_machines_running = 1`（不休眠，孩子随时能打开）；
- 区域写的是 `sin`（新加坡），可以按需要改。

> 现在实际线上用的是 WorkBuddy 平台分享链接，不是这套配置；
> 想换成自己的服务器长期托管时，再来这里取。
