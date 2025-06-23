import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Lightbulb, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AsistenAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo! Aku adalah asisten AI kamu yang sudah terhubung dengan ChatGPT! 🤖✨ Aku di sini untuk membantu dan memberikan motivasi dalam perjalanan belajar kamu. Sekarang aku bisa menjawab pertanyaan yang lebih kompleks dan memberikan saran yang lebih personal. Ada yang bisa aku bantu hari ini? 😊",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    "Aku butuh motivasi belajar",
    "Bagaimana cara mengatasi prokrastinasi?",
    "Tips belajar efektif untuk UTBK",
    "Aku bingung pilih jurusan kuliah",
    "Cara mengatur waktu belajar",
    "Aku merasa stress dengan target"
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.slice(-4).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Call the ChatGPT edge function
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message: text,
          conversationHistory: conversationHistory
        }
      });

      if (error) throw error;

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // Show a subtle indicator if using fallback
      if (data.fallback) {
        toast.info('Menggunakan mode offline - respons mungkin terbatas');
      }

    } catch (error) {
      console.error('Error calling AI:', error);
      
      // Fallback response
      const fallbackResponse: Message = {
        id: Date.now() + 1,
        text: "Maaf, aku sedang mengalami gangguan koneksi. Tapi aku tetap di sini untuk membantu! Coba tanyakan lagi atau gunakan pertanyaan cepat di bawah ya 😊",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      toast.error('Koneksi AI terganggu, menggunakan mode offline');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue">
      {/* Header */}
      <div className="p-4 bg-white border-b border-border">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-lifeguide-blue to-lifeguide-teal rounded-full flex items-center justify-center mr-3">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lifeguide-blue">Asisten AI</h1>
            <p className="text-sm text-muted-foreground flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Powered by ChatGPT ✨
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-lifeguide-blue' : 'bg-gradient-to-r from-lifeguide-teal to-lifeguide-blue'}`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`p-3 rounded-2xl ${message.sender === 'user' ? 'bg-lifeguide-blue text-white' : 'bg-white lifeguide-shadow'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-lifeguide-light-blue' : 'text-muted-foreground'}`}>
                  {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start space-x-2 max-w-[85%]">
              <div className="w-8 h-8 bg-gradient-to-r from-lifeguide-teal to-lifeguide-blue rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-3 rounded-2xl lifeguide-shadow">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-lifeguide-blue" />
                  <span className="text-sm text-muted-foreground">AI sedang berpikir...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white border-t border-border">
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-4 h-4 text-lifeguide-blue mr-1" />
            <span className="text-sm font-medium text-lifeguide-blue">Pertanyaan Populer:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                className="text-xs border-lifeguide-blue/30 hover:bg-lifeguide-blue hover:text-white h-auto py-2 px-3 text-left justify-start"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanya apa saja ke AI..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="bg-lifeguide-blue hover:bg-lifeguide-teal"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💡 AI ini menggunakan ChatGPT untuk memberikan jawaban yang lebih akurat dan personal
        </p>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-16"></div>
    </div>
  );
};

export default AsistenAI;