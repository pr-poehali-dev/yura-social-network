import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import VoiceRecorder from "@/components/VoiceRecorder";
import AudioPlayer from "@/components/AudioPlayer";
import VideoCall from "@/components/VideoCall";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
  isGroup?: boolean;
  sender?: string;
  type?: 'text' | 'audio' | 'image';
  audioUrl?: string;
  duration?: number;
  imageUrl?: string;
}

const mockChats = {
  1: {
    name: "Анна Смирнова",
    online: true,
    isGroup: false,
    messages: [
      { id: 1, text: "Привет! Как дела?", time: "14:30", isMine: false },
      { id: 2, text: "Отлично! Работаю над новым проектом 🚀", time: "14:31", isMine: true },
      { id: 3, text: "Круто! Расскажешь подробнее?", time: "14:32", isMine: false },
      { id: 4, text: "Конечно! Это мессенджер с видеозвонками", time: "14:32", isMine: true },
    ]
  },
  2: {
    name: "Команда Дизайна",
    online: false,
    isGroup: true,
    participants: [
      { name: "Анна", avatar: "АС" },
      { name: "Дмитрий", avatar: "ДП" },
      { name: "Мария", avatar: "МИ" },
    ],
    messages: [
      { id: 1, text: "Привет всем! 👋", time: "13:10", isMine: false, sender: "Анна" },
      { id: 2, text: "Новый макет готов 🎨", time: "13:15", isMine: false, sender: "Дмитрий" },
      { id: 3, text: "Отлично выглядит!", time: "13:16", isMine: true },
    ]
  }
};

interface ChatWindowProps {
  chatId?: number;
  userId: number;
}

export default function ChatWindow({ chatId, userId }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatData = chatId ? mockChats[chatId as keyof typeof mockChats] : null;

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages);
    }
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: 'text',
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleVoiceComplete = (fileUrl: string, duration: number) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: '',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: 'audio',
      audioUrl: fileUrl,
      duration,
    };
    
    setMessages([...messages, newMessage]);
    setIsRecording(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage: Message = {
        id: messages.length + 1,
        text: '',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
        type: 'image',
        imageUrl: reader.result as string,
      };
      
      setMessages([...messages, newMessage]);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto gradient-primary rounded-full flex items-center justify-center">
            <Icon name="MessageCircle" size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Выберите чат</h2>
          <p className="text-muted-foreground">Начните общение с друзьями</p>
        </div>
      </div>
    );
  }

  if (isInCall) {
    return (
      <VideoCall
        contactName={chatData?.name || ""}
        contactAvatar=""
        isVideoCall={callType === 'video'}
        onEndCall={() => setIsInCall(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b bg-white/80 backdrop-blur-sm">
        {chatData?.isGroup ? (
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="gradient-accent text-white">КД</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <Icon name="Users" size={10} className="text-primary" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="gradient-primary text-white">АС</AvatarFallback>
            </Avatar>
            {chatData?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{chatData?.name}</h3>
          {chatData?.isGroup ? (
            <p className="text-xs text-muted-foreground">{chatData.participants?.length} участников</p>
          ) : (
            <p className="text-xs text-green-600">{chatData?.online ? "В сети" : "Не в сети"}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full"
            onClick={() => {
              setCallType('audio');
              setIsInCall(true);
            }}
          >
            <Icon name="Phone" size={20} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full"
            onClick={() => {
              setCallType('video');
              setIsInCall(true);
            }}
          >
            <Icon name="Video" size={20} />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.isMine
                    ? "gradient-primary text-white rounded-br-sm"
                    : "bg-white rounded-bl-sm shadow-sm"
                }`}
              >
                {chatData?.isGroup && !msg.isMine && (
                  <p className="text-xs font-semibold mb-1 text-primary">{msg.sender}</p>
                )}
                {msg.type === 'audio' && msg.audioUrl ? (
                  <AudioPlayer audioUrl={msg.audioUrl} duration={msg.duration} />
                ) : msg.type === 'image' && msg.imageUrl ? (
                  <img src={msg.imageUrl} alt="Изображение" className="rounded-lg max-w-full" />
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
                <span className={`text-xs mt-1 block ${msg.isMine ? "text-white/80" : "text-muted-foreground"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {isRecording ? (
        <VoiceRecorder 
          onRecordingComplete={handleVoiceComplete}
          onCancel={() => setIsRecording(false)}
        />
      ) : (
        <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="Paperclip" size={20} />
            </Button>
            <Input
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-full border-2"
            />
            {message.trim() ? (
              <Button 
                size="icon" 
                className="gradient-primary rounded-full hover-scale"
                onClick={handleSend}
              >
                <Icon name="Send" size={20} className="text-white" />
              </Button>
            ) : (
              <Button 
                size="icon" 
                className="gradient-accent rounded-full hover-scale"
                onClick={() => setIsRecording(true)}
              >
                <Icon name="Mic" size={20} className="text-white" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}