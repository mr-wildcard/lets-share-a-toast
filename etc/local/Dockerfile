ARG FIREBASE_TOOLS_VERSION
ARG NODE_DOCKER_IMAGE

FROM ${NODE_DOCKER_IMAGE}

ADD ./firebase/firestore-data /home/firestore-data

ENV HOME=/home

RUN apk --no-cache add openjdk11-jre gettext bash && \
    yarn set version berry && \
    yarn plugin import interactive-tools && \
    yarn global add firebase-tools@${FIREBASE_TOOLS_VERSION} && \
    firebase setup:emulators:firestore && \
    yarn cache clean && \
    firebase -V && \
    java -version && \
    chown -R node:node $HOME

USER node

VOLUME $HOME/.cache
