import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatSupportProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ChatSupport({ isOpen: externalIsOpen, onClose: externalOnClose }: ChatSupportProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose ? (value: boolean) => {
    if (!value) externalOnClose();
  } : setInternalIsOpen;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Big Partner AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Property-related queries
    if (lowerMessage.includes('property') || lowerMessage.includes('properties')) {
      if (lowerMessage.includes('residential')) {
        return 'We have 14 residential properties available. You can browse them at /properties-residential. Would you like to know about specific locations or price ranges?';
      }
      if (lowerMessage.includes('commercial')) {
        return 'We have 9 commercial properties perfect for businesses. Check them out at /properties-commercial. What type of commercial space are you looking for?';
      }
      if (lowerMessage.includes('industrial')) {
        return 'We have 5 industrial properties available. View them at /properties-industrial. Are you looking for warehouse or manufacturing space?';
      }
      if (lowerMessage.includes('farmland') || lowerMessage.includes('farm')) {
        return 'We have 7 farmland properties available. Explore them at /properties-farmland. What size of land are you interested in?';
      }
      return 'We have 36 properties across residential, commercial, industrial, and farmland categories. Visit our properties page to browse all listings. What type of property interests you?';
    }

    // Investment queries
    if (lowerMessage.includes('invest') || lowerMessage.includes('investor')) {
      return 'Big Partner offers excellent investment opportunities in real estate. You can register as an investor at /register-investor to access exclusive deals. Would you like to know about our investment plans?';
    }

    // Partnership queries
    if (lowerMessage.includes('partner') || lowerMessage.includes('collaboration')) {
      return 'We welcome property owners and developers to partner with us. Register at /register-partner to list your properties. What type of partnership are you interested in?';
    }

    // Contact queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return 'You can reach us at:\n📞 Phone: +91 9600047740\n📧 Email: info@bigpartner.in\n📍 Address: #61, 5th Cross Street, Logaiah Colony, Saligramam, Chennai - 600 093\n\nOr visit our contact page for more options!';
    }

    // Pricing queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'Property prices vary based on location, size, and type. Our listings range from affordable residential units to premium commercial spaces. Would you like to browse properties in a specific price range?';
    }

    // Location queries
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('area')) {
      return 'We have properties across various prime locations in India. Our office is in Chennai. Which city or area are you interested in?';
    }

    // Registration queries
    if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('account')) {
      return 'You can register as:\n• Investor - Access exclusive investment opportunities\n• Partner - List your properties with us\n• Regular User - Browse and save favorite properties\n\nWhich option interests you?';
    }

    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! Welcome to Big Partner. I\'m here to help you find the perfect property or answer any questions about our services. What can I assist you with today?';
    }

    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    // Help
    if (lowerMessage.includes('help')) {
      return 'I can help you with:\n• Finding properties (residential, commercial, industrial, farmland)\n• Investment opportunities\n• Partnership programs\n• Contact information\n• Registration process\n\nWhat would you like to know more about?';
    }

    // Default response
    return 'I\'m here to help! You can ask me about:\n• Available properties\n• Investment opportunities\n• Partnership programs\n• Contact details\n• Registration process\n\nWhat would you like to know?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'View Properties', action: 'Show me available properties' },
    { label: 'Investment Info', action: 'Tell me about investment opportunities' },
    { label: 'Contact Details', action: 'How can I contact you?' },
    { label: 'Become a Partner', action: 'I want to become a partner' },
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && externalIsOpen === undefined && (
        <Button
          onClick={() => setInternalIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          aria-label="Open chat support"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Big Partner AI</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (externalOnClose) {
                  externalOnClose();
                } else {
                  setInternalIsOpen(false);
                }
              }}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 max-w-[75%] ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
