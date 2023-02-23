FROM node:18.3.0-slim

ENV HOME=/home/node
ENV APP_HOME="$HOME/nextjs"

WORKDIR $APP_HOME

# 共有ディレクトリの権限をnodeで777に設定する
RUN chown -R node:node ${HOME}

# ユーザーをrootからnodeへ変更する
USER node