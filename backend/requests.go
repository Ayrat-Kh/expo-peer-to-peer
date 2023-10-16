package main

import "encoding/json"

type RequestType string

const (
	OfferType    RequestType = "offer"
	AnswerType   RequestType = "answer"
	IceCandidate RequestType = "ice-candidate"
)

type Request struct {
	MessageType RequestType     `json:"messageType"`
	Payload     json.RawMessage `json:"payload"`
}

type Description struct {
	Sdp      string `json:"sdp"`
	Type     string `json:"type"`
	ClientId string `json:"clientId"`
}
