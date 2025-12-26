import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface Contact {
  id: number;
  name: string;
  phone: string;
  online: boolean;
}

const mockContacts: Contact[] = [
  { id: 1, name: "Анна Смирнова", phone: "+7 999 123-45-67", online: true },
  { id: 2, name: "Дмитрий Петров", phone: "+7 999 234-56-78", online: false },
  { id: 3, name: "Мария Иванова", phone: "+7 999 345-67-89", online: true },
  { id: 4, name: "Алексей Козлов", phone: "+7 999 456-78-90", online: false },
  { id: 5, name: "Елена Новикова", phone: "+7 999 567-89-01", online: true },
  { id: 6, name: "Сергей Волков", phone: "+7 999 678-90-12", online: false },
  { id: 7, name: "Ольга Соколова", phone: "+7 999 789-01-23", online: true },
];

export default function Contacts() {
  const [search, setSearch] = useState("");

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone.includes(search)
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-3">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск контактов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full border-2"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-card transition-all cursor-pointer"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="gradient-accent text-white font-medium">
                    {contact.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full transition-all ${
                  contact.online ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                <p className="text-xs text-muted-foreground">{contact.phone}</p>
                <p className={`text-xs mt-0.5 ${
                  contact.online ? "text-green-600 font-medium" : "text-gray-500"
                }`}>
                  {contact.online ? "В сети" : "Не в сети"}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                  <Icon name="MessageCircle" size={18} className="text-primary" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                  <Icon name="Phone" size={18} className="text-accent" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <Button className="w-full gradient-primary text-white rounded-full">
          <Icon name="UserPlus" size={20} className="mr-2" />
          Добавить контакт
        </Button>
      </div>
    </div>
  );
}