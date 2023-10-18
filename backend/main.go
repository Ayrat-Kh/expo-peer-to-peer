package main

import (
	"encoding/json"
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

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		res, _ := json.Marshal(map[string]string{
			"message": "server is working fine",
		})

		w.Write(res)
	})

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Call ws")
		ServeWs(hub, w, r)
	})

	err := http.ListenAndServe(address, mux)

	if err != nil {
		log.Fatalln("Listen and server", err)
	}
}
