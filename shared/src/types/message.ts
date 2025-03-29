/** Senderの列挙型 */
export enum Sender {
  USER = "USER",
  AI = "AI",
}

export interface Message {
  messageId: string;
  userId: string;
  threadId: string;
  sender: Sender;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRes {
  messageId: string;
  userId: string;
  threadId: string;
  content: string;
  sender: Sender;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageReq {
  userId: string;
  threadId: string;
  content: string;
  sender: Sender;
}

export interface MessageResList {
  messages: MessageRes[];
}
