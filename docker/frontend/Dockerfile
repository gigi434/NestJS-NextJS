FROM node:18.3.0-slim

# 共有ディレクトリの権限をnodeで777に設定する
WORKDIR /home/node/nextjs/frontend/app
RUN chown -R node:node /home/node/nextjs/frontend/app

# ユーザーをrootからnodeへ変更する
USER node