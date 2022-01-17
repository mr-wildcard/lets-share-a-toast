# 🍞 Let's share a TOAST 🍞

## Getting started

1. Install **Docker**.
2. Log in to **Gitlab registry** with `docker login registry.ekino.com` in order to pull Docker images.
3. Get a **Firebase** CLI token. If you're a member of the Firebase project, you can create your own token with `firebase login:ci`.
4. Copy and paste the token as the value of the `FIREBASE_TOKEN` key in the `.env` file.
5. This project uses [**Yarn >= 3**](https://yarnpkg.com/getting-started/install).

## Installation

1. `./etc/local/install.sh`
2. `docker compose up --remove-orphans`

- Webapp URL: [http://localhost:5000/](http://localhost:5000/) (should show up with preloaded data)
- Firebase emulator suite: [http://localhost:5004/](http://localhost:5004/)

## Upgrade project dependencies

If Docker Compose is `up` :
```
$ docker compose exec web yarn upgrade-interactive
```

If not:
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
   
   ```docker build -t registry.ekino.com/ekino-bordeaux/toast/letsshareatoast:[VERSION] etc/local```
5. Push the Docker image: 
   
   ```docker push registry.ekino.com/ekino-bordeaux/toast/letsshareatoast:[VERSION]```
