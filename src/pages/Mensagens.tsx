import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { MessageCircle, Clock, Menu, X, Send, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Conversation {
  id: number;
  other_user_name: string;
  other_user_avatar: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  service_title: string;
}

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  created_at: string;
  is_read: boolean;
}

export default function Mensagens() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/messages/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar conversas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await api.get(`/api/messages/${conversationId}`);
      setMessages(response.data.messages || []);

      // Mark as read
      api.patch(`/api/messages/${conversationId}/read`);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar mensagens.',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || !user) return;

    try {
      const response = await api.post(`/api/messages/${selectedConversation.id}`, {
        content: newMessage.trim(),
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      fetchConversations(); // Refresh unread count
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar mensagem.',
        variant: 'destructive',
      });
    }
  };

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    setMobileChatOpen(true);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Mensagens</h1>
          <p>Faça login para ver suas mensagens.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="h-[70vh] md:h-[80vh] flex flex-col lg:flex-row gap-4">
          {/* Sidebar - List of conversations */}
          <Card className="flex-1 lg:w-80 lg:min-w-[320px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Mensagens ({conversations.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchConversations}
                className="w-full"
              >
                Atualizar
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Carregando...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma conversa
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <Button
                      key={conv.id}
                      variant="ghost"
                      className={`w-full justify-start h-16 px-4 py-3 hover:bg-accent gap-3 text-left flex items-center relative cursor-pointer ${
                        selectedConversation?.id === conv.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => openConversation(conv)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.other_user_avatar} />
                        <AvatarFallback>
                          {conv.other_user_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{conv.other_user_name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {conv.last_message}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-muted-foreground">
                          {new Date(conv.last_message_time).toLocaleString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {conv.unread_count > 0 && (
                          <Badge className="text-xs">{conv.unread_count}</Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {mobileChatOpen && (
              <Button
                variant="ghost"
                className="lg:hidden mb-4 p-2 h-auto"
                onClick={() => setMobileChatOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}

            {selectedConversation ? (
              <div className="h-full flex flex-col">
                <Card className="flex-1 border-t-0 rounded-t-none">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.other_user_avatar} />
                        <AvatarFallback>
                          {selectedConversation.other_user_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedConversation.other_user_name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedConversation.service_title}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 h-0 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] p-3 rounded-2xl ${
                            msg.sender_id === user.id
                              ? 'bg-gradient-primary text-white rounded-br-sm'
                              : 'bg-muted'
                          }`}
                          >
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender_id === user.id ? 'text-white/80' : 'text-muted-foreground'
                            }`}>
                              {new Date(msg.created_at).toLocaleString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t p-4 bg-background">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          rows={1}
                          className="flex-1 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex-1 flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma conversa selecionada</h3>
                  <p className="text-muted-foreground">Selecione uma conversa para começar a chat</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

