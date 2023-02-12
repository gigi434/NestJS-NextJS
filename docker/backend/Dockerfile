FROM node:18.3.0-slim

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
# npmのグローバル設定
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# NestJSをインストール時にgitが必要なためインストールする
RUN apt-get update \
    && apt-get install -y git \
    && npm i -g @nestjs/cli \
    && npm i -g prisma

# ユーザーをrootからnodeへ変更する
USER node

# 共有ディレクトリの権限をnodeで777に設定する
WORKDIR /home/node/nestjs-nextjs/backend/app
RUN chown -R node:node /home/node/nestjs-nextjs/backend/app
