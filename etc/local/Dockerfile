FROM google/cloud-sdk:366.0.0-alpine as gcloud-image

FROM node:16.13.2-alpine

ENV HOME=/home \
    FIREBASE_TOOLS_VERSION=10.1.2 \
    PNPM_VERSION=6.29.1

COPY --from=gcloud-image /google-cloud-sdk $HOME/google-cloud-sdk

ENV PATH=$HOME/google-cloud-sdk/bin:$PATH

COPY ./firebase/firestore-data $HOME/firebase/firestore-data

RUN apk --upgrade --no-cache add openjdk11-jre python3 py3-pip curl

RUN npm i -g pnpm@${PNPM_VERSION}

RUN pnpm add --global firebase-tools@${FIREBASE_TOOLS_VERSION} && \
    firebase setup:emulators:database && \
    firebase setup:emulators:firestore && \
    firebase setup:emulators:ui && \
    chown -R node:node $HOME

VOLUME $HOME/.cache
VOLUME $HOME/firebase

USER node
