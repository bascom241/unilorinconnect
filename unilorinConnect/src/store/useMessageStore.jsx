import { create } from 'zustand';
import { axiosInstance } from '../lib/utils';
import { authStore } from './useAuthStore';

const useMessageStore = create((set) => ({
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
      set({ messages: response.data.messages, loading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ loading: false });
    }
  },

  sendMessage: async (receiverId, text, image) => {
    const { user } = authStore.getState(); // get sender

    // Create optimistic message
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      senderId: user._id,
      recipientId: receiverId,
      text,
      createdAt: new Date().toISOString(),
      pending: true
    };

    // Push to UI immediately
    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));

    try {
      const response = await axiosInstance.post(`/message/${receiverId}`, { text, image });

      // Replace temporary message with real one
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempMessage._id ? response.data : msg
        ),
      }));

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message if sending failed
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempMessage._id),
      }));
      return false;
    }
  },
  subscribeToMessages: (callback) => {
    const {selectedUser} = get();
    if (!selectedUser) return;
    const socket = authStore.getState().socket;
    socket.on('newMessage', (message) => {
      if (message.senderId === selectedUser._id || message.recipientId === selectedUser._id) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
        callback(message);
      }
    });
  },
   unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket.off('newMessage');
  },
}));

export default useMessageStore;
