import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import useMessageStore from '../store/useMessageStore';
import { authStore } from '../store/useAuthStore';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Chat = () => {

  const location = useLocation();
  const { sellerId } = location.state || {};


  const { user, onlineUsers } = authStore();

  const isOnline = (userId) => onlineUsers.includes(userId);
  const {
    users,
    messages,
    loading,
    fetchUsers,
    fetchMessages,
    sendMessage
  } = useMessageStore();

  const [activeUserId, setActiveUserId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  if (!user) {
    return <div className="text-center text-red-500 py-10">Please log in to access the chat.</div>;
  }

  if (!activeUser) {
    return <div className="text-center text-gray-500 py-10">No users available to chat with.</div>;
  }


  useEffect(() => {
    if (location.state?.sellerName) {
      toast.success(`Chat Initiated with ${location.state.sellerName}`);
    }
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Automatically select the first user
  useEffect(() => {
    if (users.length && !activeUserId) {
      if (sellerId) {
        const seller = users.find(u => u._id === sellerId);
        if (seller) {
          setActiveUserId(seller._id);
        }
      } else {
        setActiveUserId(users[0]._id);
      }
    }
  }, [users, activeUserId, sellerId]);


  // Fetch messages when the active user changes
  useEffect(() => {
    if (activeUserId) {
      fetchMessages(activeUserId);
    }
  }, [activeUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || !activeUserId) return;

    const textToSend = messageInput;
    setMessageInput(''); // Clear input before sending

    const success = await sendMessage(activeUserId, textToSend, null);
    if (success) {
      // Optional: ensure latest messages are fetched
      fetchMessages(activeUserId);
    }
  };

  const activeUser = users.find(u => u._id === activeUserId);

  useEffect(() => {
    const handleIncoming = (msg) => {
      toast.success("New message received", msg)
      console.log("New message received", msg);
    };

    useMessageStore.getState().subscribeToMessages(handleIncoming);

    return () => {
      useMessageStore.getState().unsubscribeFromMessages();
    };
  }, []);



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users List */}
        <Card className="md:col-span-1 overflow-hidden">
          <ScrollArea className="h-[80vh]">
            <div className="p-2">
              {users.map(u => (
                <div
                  key={u._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${u._id === activeUserId ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  onClick={() => setActiveUserId(u._id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-200 text-blue-700">
                      {getInitials(u.fullName)}
                    </AvatarFallback>
                  </Avatar>



                  <div className="ml-3">
                    <p className="font-medium">{u.fullName}</p>
                    <p className="text-sm text-gray-600">{u.matricNumber}</p>
                  </div>

                  {isOnline(u._id) ? <span className="ml-2 text-green-500 text-xs">Online</span> : <span className="ml-2 text-red-500 text-xs">Offline</span>}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col h-[80vh]">
          {/* Header */}
          <div className="p-4 border-b flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-200 text-blue-700">
                {getInitials(activeUser.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium">{activeUser.fullName}</p>
              <p className="text-sm text-gray-600">{activeUser.matricNumber}</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => {
                const isCurrentUser = msg.senderId === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-md ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                          }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={!messageInput.trim() || loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
