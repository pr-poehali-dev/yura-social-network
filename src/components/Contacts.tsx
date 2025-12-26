import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { messagesAPI, User } from "@/lib/api";
import AddContactModal from "./AddContactModal";
import InviteModal from "./InviteModal";

interface ContactsProps {
  userId: number;
}

export default function Contacts({ userId }: ContactsProps) {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [userId]);

  const loadContacts = async () => {
    try {
      const data = await messagesAPI.getContacts(userId);
      setContacts(data);
    } catch (error) {
      console.error('Ошибка загрузки контактов:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
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
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Контакты не найдены</div>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-card transition-all cursor-pointer"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar_url || ""} />
                    <AvatarFallback className="gradient-accent text-white font-medium">
                      {contact.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full transition-all ${
                    contact.is_online ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  <p className={`text-xs mt-0.5 ${
                    contact.is_online ? "text-green-600 font-medium" : "text-gray-500"
                  }`}>
                    {contact.is_online ? "В сети" : "Не в сети"}
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
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm space-y-2">
        <Button 
          className="w-full gradient-primary text-white rounded-full"
          onClick={() => setAddModalOpen(true)}
        >
          <Icon name="UserPlus" size={20} className="mr-2" />
          Добавить контакт
        </Button>
        <Button 
          variant="outline" 
          className="w-full rounded-full"
          onClick={() => setInviteModalOpen(true)}
        >
          <Icon name="Share2" size={20} className="mr-2" />
          Пригласить друзей
        </Button>
      </div>
      
      <AddContactModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        userId={userId}
        onContactAdded={loadContacts}
      />
      
      <InviteModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </div>
  );
}