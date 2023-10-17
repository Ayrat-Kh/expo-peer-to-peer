export const SocketMessageType = {
  ANSWER: "answer",
  OFFER: "offer",
  ICE_CANDIDATE: "ice-candidate",
} as const;

export type SocketMessageType =
  (typeof SocketMessageType)[keyof typeof SocketMessageType];

export interface SocketMessageTypeMapping {
  [SocketMessageType.ANSWER]: RTCSessionDescriptionInit;
  [SocketMessageType.OFFER]: RTCSessionDescriptionInit;
  [SocketMessageType.ICE_CANDIDATE]: RTCIceCandidate;
}

export type SocketMessageTypeHandlers = {
  [key in keyof SocketMessageTypeMapping]: (
    data: SocketMessageTypeMapping[key],
    fromClientId: string
  ) => void | Promise<void>;
};

export interface SocketMessage<
  TMessageType extends SocketMessageType = "answer"
> {
  messageType: TMessageType;
  recipientClientId?: string;
  senderId: string;
  payload: SocketMessageTypeMapping[TMessageType];
}
