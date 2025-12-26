const API_URLS = {
  auth: 'https://functions.poehali.dev/99d5c417-1b44-407c-a7e0-de8b9616ae5f',
  messages: 'https://functions.poehali.dev/eed8c62b-774e-4292-b40f-88a68f3b65c0',
  upload: 'https://functions.poehali.dev/cc7193c7-66b7-44b4-b557-d81cab4064e6',
};

export interface User {
  id: number;
  phone: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  is_online?: boolean;
  last_seen?: string;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  message_type: 'text' | 'audio' | 'image' | 'video' | 'file';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  duration?: number;
  created_at: string;
  is_read: boolean;
  reply_to_id?: number;
}

export interface Chat {
  id: number;
  name: string;
  is_group: boolean;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  participants_count?: number;
  is_online?: boolean;
}

export const authAPI = {
  async register(phone: string, name: string): Promise<{ user: User; token: string }> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', phone, name }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка регистрации');
    return data;
  },

  async login(phone: string): Promise<{ user: User; token: string }> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', phone }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка входа');
    return data;
  },

  async updateProfile(userId: number, updates: Partial<User>): Promise<{ user: User }> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_profile', user_id: userId, ...updates }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка обновления профиля');
    return data;
  },
};

export const messagesAPI = {
  async getChats(userId: number): Promise<Chat[]> {
    const response = await fetch(`${API_URLS.messages}?action=get_chats&user_id=${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка загрузки чатов');
    return data.chats;
  },

  async getMessages(chatId: number, limit = 50, offset = 0): Promise<Message[]> {
    const response = await fetch(`${API_URLS.messages}?action=get_messages&chat_id=${chatId}&limit=${limit}&offset=${offset}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка загрузки сообщений');
    return data.messages;
  },

  async getContacts(userId: number): Promise<User[]> {
    const response = await fetch(`${API_URLS.messages}?action=get_contacts&user_id=${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка загрузки контактов');
    return data.contacts;
  },

  async sendMessage(
    chatId: number,
    senderId: number,
    content: string,
    messageType: 'text' | 'audio' | 'image' | 'video' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    duration?: number
  ): Promise<Message> {
    const response = await fetch(API_URLS.messages, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_message',
        chat_id: chatId,
        sender_id: senderId,
        content,
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        duration,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка отправки сообщения');
    return data.message;
  },

  async createChat(userId: number, participantIds: number[], isGroup = false, name?: string): Promise<number> {
    const response = await fetch(API_URLS.messages, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_chat',
        user_id: userId,
        participant_ids: participantIds,
        is_group: isGroup,
        name,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка создания чата');
    return data.chat_id;
  },
};

export const uploadAPI = {
  async uploadFile(fileData: string, fileName: string, fileType: string, folder = 'files'): Promise<{ url: string; file_name: string; file_size: number }> {
    const response = await fetch(API_URLS.upload, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_data: fileData,
        file_name: fileName,
        file_type: fileType,
        folder,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка загрузки файла');
    return data;
  },
};
