FROM golang:1.21.3 AS development

ENV ADDRESS=:5000

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o runner

FROM alpine:3.14 AS production

WORKDIR /app

COPY --from=development /app/runner .

RUN chmod +x ./runner

EXPOSE 5000

CMD ["./runner"]