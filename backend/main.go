package main

import (
	"log"
	"net/http"
	"os"
)

const (
	Address string = "ADDRESS"
)

func main() {

	address := os.Getenv(Address)

	if address == "" {
		address = ":5000"
	}
	log.Printf("Starting app at %s", address)

	hub := NewHub()
	go hub.Run()

	mux := http.NewServeMux()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	})

	err := http.ListenAndServe(address, mux)

	if err != nil {
		log.Fatalln("Listen and server", err)
	}
}
