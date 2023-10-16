package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", "localhost:5000", "http service address")

func main() {
	flag.Parse()
	hub := NewHub()
	go hub.Run()

	mux := http.NewServeMux()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	})

	err := http.ListenAndServe(*addr, mux)

	if err != nil {
		log.Fatalln("Listen and server", err)
	}
}
