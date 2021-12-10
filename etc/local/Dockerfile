FROM google/cloud-sdk:366.0.0-alpine as gcloud-image

FROM node:16.13.1-alpine

ENV HOME=/home \
    FIREBASE_TOOLS_VERSION=9.23.1 \
    YARN_VERSION=3.1.1

COPY --from=gcloud-image /google-cloud-sdk $HOME/google-cloud-sdk

ENV PATH=$HOME/google-cloud-sdk/bin:$PATH

COPY ./firebase/firestore-data $HOME/firebase/firestore-data

RUN apk --upgrade --no-cache add openjdk11-jre python3 py3-pip curl

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
