# 🍞 Let's share a TOAST 🍞

## Getting started

1. Install **Docker**.
2. Log in to **Gitlab registry** with `docker login registry.ekino.com` in order to pull Docker images.
3. Get a **Firebase** CI token. If you're a member of the Firebase project, you can create your own token with `firebase login:ci`.
4. Copy and paste the token as the value of the `FIREBASE_TOKEN` key in the `.env` file.
5. This project uses [PNPM](https://pnpm.io/).

## Installation

1. `./etc/local/install.sh`
2. `docker compose up --remove-orphans`

- Webapp URL: [http://localhost:5000/](http://localhost:5000/)
- Firebase emulator suite: [http://localhost:5004/](http://localhost:5004/)

## Deploy

Every commit on master is automatically deployed to production.

## Working in a Docker container

Basically, every commands should be run inside a container.

For example, want to install a new dependency to `web` package ?
1. `docker compose exec web sh`
2. `pnpm add my-dependency`
3. or `docker compose exec web pnpm add my-dependency`

## Upgrade project dependencies

```
$ ./etc/local/upgrade-dependencies.sh
```

## Upgrade project Docker image

1. Open `etc/local/Dockerfile`
2. Modify the file
3. Choose an incremented version for the Docker image versions and replace the current used version. This has to be done at several places:
   1. `.env` and `.env.dist` files : update `DOCKER_IMAGE_VERSION` value.
   2. `.gitlab-ci.yml` : update `DOCKER_IMAGE_VERSION` variable's value.
4. Build the Docker image with the version you chose in the previous step: 
   ```
   docker build -t registry.ekino.com/ekino-bordeaux/toast/letsshareatoast:[VERSION] etc/local
   ```
5. Push the Docker image: 
   ```
   docker push registry.ekino.com/ekino-bordeaux/toast/letsshareatoast:[VERSION]
   ```
