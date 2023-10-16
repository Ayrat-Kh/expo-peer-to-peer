package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", "localhost:5000", "http service address")

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "home.html")
}

func main() {
	flag.Parse()
	hub := NewHub()
	go hub.Run()

	mux := http.NewServeMux()
	mux.HandleFunc("/", serveHome)
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		log.Println("ws")
		ServeWs(hub, w, r)
	})

	log.Println("Start app", *addr)

	err := http.ListenAndServe(*addr, mux)

	if err != nil {
		log.Fatalln("Listen and server", err)
	}

	log.Println("Listen and server")
}