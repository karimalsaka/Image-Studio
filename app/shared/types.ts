export interface Message {
  id: string;
  role: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  thumbnail?: string | null;
  messages: Message[];
}
