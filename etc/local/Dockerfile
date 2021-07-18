ARG NODE_DOCKER_IMAGE

FROM ${NODE_DOCKER_IMAGE}

COPY firebase/firestore-data /home/firebase/firestore-data

RUN apk --upgrade --no-cache add openjdk11-jre python3 py3-pip bash && \
    npm config set user root && \
    npm install -g firebase-tools@9.16.0 && \
    npm cache clean --force && \
    firebase -V && \
    java -version
