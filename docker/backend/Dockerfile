FROM node:18.3.0-slim

ENV HOME=${HOME}
ENV APP_HOME="$HOME/nestjs"

WORKDIR ${APP_HOME}

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
# npmのグローバル設定
ENV NPM_CONFIG_PREFIX=${HOME}/.npm-global
ENV PATH=$PATH:${HOME}/.npm-global/bin

# NestJSをインストール時にgitが必要なためインストールする
RUN apt-get update \
    && apt-get install -y git \
    && npm i -g @nestjs/cli \
    && npm i -g prisma

# 共有ディレクトリの権限をnodeで777に設定する
RUN chown -R node:node ${HOME}

# ユーザーをrootからnodeへ変更する
USER node