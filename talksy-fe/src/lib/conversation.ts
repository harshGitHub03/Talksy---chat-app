import { apiRequest } from "./api";

type AuthResponse = {
  id: string
};

export type ConversationMessage = {
  id: string;
  content: string;
  senderId?: string;
  sender?: { id: string };
  createdAt: string;
};

type MessagesResponse = {
  success: boolean;
  messages: ConversationMessage[];
  hasMore: boolean;
  skip: number;
  limit: number;
};

// create / get direct conversation 
export function upsertConverAndGetId(otherUserId: string) {
  const params = new URLSearchParams({ otherUserId });
  return apiRequest<AuthResponse>(`/conversations/direct?${params}`);
}

export function listMessages(conversationId: string, skip = 0, limit = 5) {
  const params = new URLSearchParams({ conversationId, skip: String(skip), limit: String(limit) });
  return apiRequest<MessagesResponse>(`/conversations/list/messages?${params}`);
}
