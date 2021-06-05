ARG NODE_DOCKER_IMAGE

FROM ${NODE_DOCKER_IMAGE}

COPY ./firestore-data /home/firebase/firestore-data

RUN apk --upgrade --no-cache add openjdk11-jre bash && \
    npm install -g firebase-tools@9.12.1 && \
    npm cache clean --force && \
    firebase -V && \
    java -version
