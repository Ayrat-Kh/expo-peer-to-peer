package main

import (
	"encoding/json"
	"log"
)

func (hub *Hub) HandleAnswerOrOffer(description Description) {
	client, ok := hub.clients[description.ClientId]

	if !ok {
		log.Printf("[HandleAnswerOrOffer] No client found with id %s", description.ClientId)
		return
	}

	res, _ := json.Marshal(&description)

	if res == nil {
		return
	}

	client.send <- res
}

func (hub *Hub) HandleIceCandidate(iceCandidate IceCandidate) {
	client, ok := hub.clients[iceCandidate.ClientId]

	if !ok {
		log.Printf("[HandleIceCandidate] No client found with id %s", iceCandidate.ClientId)
		return
	}

	res, _ := json.Marshal(&iceCandidate)

	if res == nil {
		return
	}

	client.send <- res
}
