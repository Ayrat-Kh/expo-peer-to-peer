package main

import (
	"encoding/json"
	"log"
)

func (hub *Hub) HandleResend(clientId string, request Request) {
	client, ok := hub.clients[clientId]

	if !ok {
		log.Printf("[HandleAnswerOrOffer] No client found with id %s", clientId)
		return
	}

	// resend request
	res, _ := json.Marshal(&request)

	if res == nil {
		return
	}

	client.send <- res
}
