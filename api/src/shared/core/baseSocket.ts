import type { Namespace, Socket } from "socket.io";

type IEvent = "message" | "admin_update";
interface IMessage {
  event: string;
  symbol?: string;
  message?: string;
  status?: string;
  date: Date;
}
abstract class BaseSocket {
  private static namespace: Namespace;

  constructor(namespace: Namespace) {
    BaseSocket.namespace = namespace;
    this.startConnection();
  }

  private startConnection(): void {
    BaseSocket.namespace.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.onClientConnect(socket);
      socket.on("disconnect", () => this.onClientDisconnect(socket));
    });
  }

  // Hooks for child classes to override
  protected abstract onClientConnect(socket: Socket): void;
  protected abstract onClientDisconnect(socket: Socket): void;

  // Static method to emit events without requiring an instance
  public static emitMessage(event: IEvent, message: IMessage): void {
    if (!BaseSocket.namespace) {
      throw new Error(
        "Namespace is not initialized. Ensure the class is instantiated."
      );
    }
    BaseSocket.namespace.emit(event, JSON.stringify(message));
  }
}

export default BaseSocket;
