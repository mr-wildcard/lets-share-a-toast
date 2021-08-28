FROM node:14-alpine

COPY ./firebase/firestore-data /home/firebase/firestore-data

RUN apk --upgrade --no-cache add openjdk11-jre python3 py3-pip

RUN npm config set user root && \
    npm install -g firebase-tools@9.16.6 && \
    npm cache clean --force

RUN yarn set version berry

RUN firebase setup:emulators:database && \
    firebase setup:emulators:firestore && \
    firebase setup:emulators:ui
