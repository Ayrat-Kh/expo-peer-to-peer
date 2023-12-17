# About the project

This is an example react native webrtc peer to peer connection. The go backend is used for the echanging ICE, offer and answer informations.

# How to run mobile

```
1. should be preinstalled ios/android simulators.
2. cd ./mobile
3. yarn
4. yarn start
```

# How to run backend

Should be preinstalled [golang](https://go.dev/doc/install).

```
1. cd ./backend
2. go mod download
3. CGO_ENABLED=0 GOOS=linux go build -o runner
4. ./runner
```

or we can build docker image:

```
1. cd ./backend
2. docker build -t peer-ro-peer-backend .
3. docker run --name peer-ro-peer-backend
```
