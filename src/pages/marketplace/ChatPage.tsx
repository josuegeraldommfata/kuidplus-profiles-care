import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ArrowLeft, Send, User } from 'lucide-react';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { getConversation, messages, sendMessage, getConversationsByUser } = useMarketplace();
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversationId ? getConversation(conversationId) : null;
  const conversationMessages = conversationId ? (messages[conversationId] || []) : [];
  const allConversations = user ? getConversationsByUser(user.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSend = () => {
    if (!text.trim() || !conversationId) return;
    sendMessage(conversationId, {
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderImage: user.profileImage,
      content: text.trim(),
    });
    setText('');
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-4">
          <div className="flex gap-4 h-[calc(100vh-120px)]">
            {/* Sidebar - conversation list */}
            <div className="w-80 hidden md:block border rounded-lg bg-background overflow-auto">
              <div className="p-3 border-b">
                <h2 className="font-semibold text-sm">Conversas</h2>
              </div>
              {allConversations.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">Nenhuma conversa</p>
              ) : (
                allConversations.map(c => (
                  <button
                    key={c.id}
                    className={`w-full text-left p-3 border-b hover:bg-muted/50 transition-colors ${c.id === conversationId ? 'bg-primary/5' : ''}`}
                    onClick={() => navigate(`/chat/${c.id}`)}
                  >
                    <p className="font-medium text-sm truncate">{c.participantName}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.serviceTitle}</p>
                    {c.lastMessage && <p className="text-xs text-muted-foreground truncate mt-1">{c.lastMessage}</p>}
                  </button>
                ))
              )}
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col border rounded-lg bg-background">
              {conversation ? (
                <>
                  {/* Header */}
                  <div className="p-3 border-b flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate(-1)}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {conversation.participantImage ? (
                        <img src={conversation.participantImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{conversation.participantName}</p>
                      <p className="text-xs text-muted-foreground">{conversation.serviceTitle}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-3">
                    {conversationMessages.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Nenhuma mensagem. Comece a conversa!
                      </p>
                    )}
                    {conversationMessages.map(m => (
                      <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                          m.senderId === user.id
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        }`}>
                          <p className="whitespace-pre-wrap">{m.content}</p>
                          <p className={`text-[10px] mt-1 ${
                            m.senderId === user.id ? 'text-primary-foreground/60' : 'text-muted-foreground'
                          }`}>
                            {new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={!text.trim()} className="gradient-highlight border-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Selecione uma conversa para começar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
