FROM golang:1.21.3

ENV ADDRESS=:5000

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o app

RUN chmod +x ./app

EXPOSE 5000

CMD ["./app"]