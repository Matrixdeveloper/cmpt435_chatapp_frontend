import { Message } from './message';

export interface SocketMessage {
  requestType: string,
  sender: string,
  receiver: string,
  result: Boolean,
  notification: string
  content: Array<Message>
}
