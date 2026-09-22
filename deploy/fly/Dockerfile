FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY public ./public

# 持久卷会挂到 /app/data，这里只确保目录存在
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["node", "server.js"]
