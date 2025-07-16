import { create } from 'zustand';
import { axiosInstance } from '../lib/utils';
import { authStore } from './useAuthStore';

export const useMessageStore = create((set, get) => ({
  users: [],
  messages: [],
  loading: false,
  selectedUser: null,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/users');
      set({ users: response.data.filterUsers, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ loading: false });
    }
  },

  fetchMessages: async (userId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data.messages, loading: false, selectedUser: userId });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ loading: false });
    }
  },

  sendMessage: async (receiverId, text, image) => {
    const { user } = authStore.getState();

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      senderId: user._id,
      recipientId: receiverId,
      text,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));

    try {
      const response = await axiosInstance.post(`/message/${receiverId}`, { text, image });

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempMessage._id ? response.data : msg
        ),
      }));

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempMessage._id),
      }));
      return false;
    }
  },

  subscribeToMessages: (callback) => {
    const socket = authStore.getState().socket;
    if (!socket) return;

    socket.on('newMessage', (message) => {
      const { selectedUser, messages } = get();

      // Check if message is from or to the selected user
      if (message.senderId === selectedUser || message.recipientId === selectedUser) {
        set({ messages: [...messages, message] });
        if (typeof callback === 'function') callback(message);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    if (socket) socket.off('newMessage');
  },
}));
