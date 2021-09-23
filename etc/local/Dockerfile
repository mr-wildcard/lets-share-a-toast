FROM node:16.9.1-alpine

ENV HOME=/home

COPY ./firebase/firestore-data $HOME/firebase/firestore-data

ENV FIREBASE_TOOLS_VERSION=9.17.0 \
    YARN_VERSION=3.0.2

RUN apk --upgrade --no-cache add openjdk11-jre python3 py3-pip

RUN npm config set user root && \
    npm install -g firebase-tools@${FIREBASE_TOOLS_VERSION} && \
    npm cache clean --force

RUN yarn set version berry && \
    yarn set version ${YARN_VERSION}

RUN firebase setup:emulators:database && \
    firebase setup:emulators:firestore && \
    firebase setup:emulators:ui && \
    chown -R node:node $HOME

VOLUME $HOME/.cache
VOLUME $HOME/firebase

USER node
