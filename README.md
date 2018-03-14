# Invaders.js

## Set up

Set up docker-machine and install docker-compose (if not already done)
```
brew install docker-compose
docker-machine create --driver virtualbox default
docker-machine start
eval "$(docker-machine env default)"
```

Create docker container
```
docker-compose up
```

