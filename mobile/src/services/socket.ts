import {
  SocketMessage,
  SocketMessageType,
  SocketMessageTypeHandlers,
  SocketMessageTypeMapping,
} from 'src/types/peer';

export class Socket {
  handlers: Partial<SocketMessageTypeHandlers> = {};
  closeListener: VoidFunction | null = null;
  socket: WebSocket | undefined;

  constructor(
    private readonly socketUrl: string,
    private readonly clientId: string
  ) {}

  async connect() {
    this.close();

    const url = `${this.socketUrl}?clientId=${this.clientId}`;

    const socket = new WebSocket(url);

    socket.addEventListener('message', this.messageListener.bind(this));

    await new Promise<void>((resolve) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        socket.onopen = () => resolve();
      }
    });

    this.socket = socket;
  }

  send<Type extends SocketMessageType>(
    messageType: SocketMessageType,
    payload: SocketMessageTypeMapping[Type],
    recipientClientId?: string
  ) {
    this.socket?.send(
      JSON.stringify({
        messageType,
        recipientClientId,
        senderId: this.clientId,
        payload,
      } as SocketMessage)
    );
  }

  setEventListener<Type extends SocketMessageType>(
    messageType: Type,
    handler: SocketMessageTypeHandlers[Type]
  ) {
    this.handlers[messageType] = handler;
  }

  setCloseListener(handler: VoidFunction) {
    if (this.closeListener) {
      this.socket?.removeEventListener('close', this.closeListener);
    }

    this.socket?.addEventListener('close', handler);
  }

  close() {
    this.socket?.close();
    this.socket = undefined;
  }

  private messageListener(ev: MessageEvent<any>) {
    try {
      const data = JSON.parse(ev.data) as SocketMessage;

      const { messageType, payload } = data;

      if (messageType in this.handlers) {
        this.handlers[messageType]?.(payload, data.senderId);
      } else {
        console.log('Unknown message type', data);
      }
    } catch (e) {
      console.log('Unknown message or error', e);
    }
  }
}
