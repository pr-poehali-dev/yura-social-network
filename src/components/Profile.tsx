import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { User } from "@/lib/api";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import InviteModal from "./InviteModal";

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export default function Profile({ user, onLogout }: ProfileProps) {
  const [localUser, setLocalUser] = useState<User>(user);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={localUser.avatar_url} />
              <AvatarFallback className="gradient-primary text-white text-4xl font-bold">
                {localUser.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full gradient-accent text-white h-10 w-10"
              onClick={() => setEditModalOpen(true)}
            >
              <Icon name="Pencil" size={20} />
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">{localUser.name}</h2>
            <p className="text-muted-foreground">{localUser.phone}</p>
          </div>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
              <Icon name="Phone" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Телефон</p>
              <p className="font-medium">{localUser.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
              <Icon name="Users" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Участник с</p>
              <p className="font-medium">{new Date(localUser.created_at).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </Card>

        {localUser.bio && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold mb-2">О себе</h3>
            <p className="text-sm text-muted-foreground">
              {localUser.bio}
            </p>
          </Card>
        )}

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-xl h-14"
            onClick={() => setEditModalOpen(true)}
          >
            <Icon name="Pencil" size={20} className="mr-3 text-primary" />
            <span>Редактировать профиль</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-xl h-14"
            onClick={() => setInviteModalOpen(true)}
          >
            <Icon name="UserPlus" size={20} className="mr-3 text-primary" />
            <span>Пригласить друзей</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Archive" size={20} className="mr-3 text-primary" />
            <span>Архив чатов</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="HelpCircle" size={20} className="mr-3 text-primary" />
            <span>Помощь и поддержка</span>
          </Button>
        </div>

        <Button 
          variant="destructive" 
          className="w-full rounded-xl"
          onClick={onLogout}
        >
          <Icon name="LogOut" size={20} className="mr-2" />
          Выйти
        </Button>
      </div>
      
      <EditProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={localUser}
        onUpdate={setLocalUser}
      />
      
      <InviteModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </ScrollArea>
  );
}