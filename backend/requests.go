package main

import "encoding/json"

type RequestType string

const (
	OfferType        RequestType = "offer"
	AnswerType       RequestType = "answer"
	IceCandidateType RequestType = "ice-candidate"
)

type Request struct {
	MessageType       RequestType     `json:"messageType"`
	SenderId          string          `json:"senderId"`
	RecipientClientId string          `json:"recipientClientId"`
	Payload           json.RawMessage `json:"payload"`
}

type Description struct {
	Sdp  string `json:"sdp"`
	Type string `json:"type"`
}

type IceCandidate struct {
	Candidate     string `json:"candidate"`
	SdpMLineIndex int32  `json:"sdpMLineIndex"`
	SdpMid        string `json:"sdpMid"`
}
