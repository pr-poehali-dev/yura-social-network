import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "Анна Смирнова",
    avatar: "",
    lastMessage: "Привет! Как дела?",
    time: "14:32",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Команда Дизайна",
    avatar: "",
    lastMessage: "Новый макет готов 🎨",
    time: "13:15",
    unread: 5,
    online: false,
  },
  {
    id: 3,
    name: "Дмитрий Петров",
    avatar: "",
    lastMessage: "Отлично, спасибо!",
    time: "Вчера",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Мария Иванова",
    avatar: "",
    lastMessage: "Созвон в 15:00?",
    time: "Вчера",
    unread: 1,
    online: true,
  },
  {
    id: 5,
    name: "Проект Alpha",
    avatar: "",
    lastMessage: "Документация обновлена",
    time: "Пн",
    unread: 0,
    online: false,
  },
];

interface ChatListProps {
  onSelectChat: (chatId: number) => void;
  selectedChatId?: number;
}

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gradient-card ${
              selectedChatId === chat.id ? "bg-gradient-card" : ""
            }`}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="gradient-primary text-white font-medium">
                  {chat.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
            
            {chat.unread > 0 && (
              <Badge className="gradient-primary text-white border-0 h-5 min-w-5 px-1.5">
                {chat.unread}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
