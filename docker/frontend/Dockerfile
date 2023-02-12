FROM node:18.3.0-slim

# ユーザーをrootからnodeへ変更する
USER node

# 共有ディレクトリの権限をnodeで777に設定する
WORKDIR /home/node/nestjs-nextjs/frontend/app
RUN chown -R node:node /home/node/nestjs-nextjs/frontend/app
