import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
}

const mockMessages: Message[] = [
  { id: 1, text: "Привет! Как дела?", time: "14:30", isMine: false },
  { id: 2, text: "Отлично! Работаю над новым проектом 🚀", time: "14:31", isMine: true },
  { id: 3, text: "Круто! Расскажешь подробнее?", time: "14:32", isMine: false },
  { id: 4, text: "Конечно! Это мессенджер с видеозвонками", time: "14:32", isMine: true },
];

interface ChatWindowProps {
  chatId?: number;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [message, setMessage] = useState("");

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b bg-white/80 backdrop-blur-sm">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className="gradient-primary text-white">АС</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">Анна Смирнова</h3>
          <p className="text-xs text-green-600">В сети</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="Phone" size={20} />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="Video" size={20} />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.isMine
                    ? "gradient-primary text-white rounded-br-sm"
                    : "bg-white rounded-bl-sm shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className={`text-xs mt-1 block ${msg.isMine ? "text-white/80" : "text-muted-foreground"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="Paperclip" size={20} />
          </Button>
          <Input
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full border-2"
          />
          <Button size="icon" className="gradient-primary rounded-full">
            <Icon name="Send" size={20} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
