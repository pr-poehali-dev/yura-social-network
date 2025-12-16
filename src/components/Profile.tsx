import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

export default function Profile() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="gradient-primary text-white text-4xl font-bold">
                ИВ
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full gradient-accent text-white h-10 w-10"
            >
              <Icon name="Camera" size={20} />
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">Иван Васильев</h2>
            <p className="text-muted-foreground">@ivanvas</p>
          </div>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
              <Icon name="Phone" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Телефон</p>
              <p className="font-medium">+7 999 123-45-67</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
              <Icon name="Mail" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">ivan@example.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
              <Icon name="MapPin" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Город</p>
              <p className="font-medium">Москва, Россия</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-semibold mb-2">О себе</h3>
          <p className="text-sm text-muted-foreground">
            Frontend разработчик. Люблю создавать красивые интерфейсы 🚀
          </p>
        </Card>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Bell" size={20} className="mr-3 text-primary" />
            <span>Уведомления</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Lock" size={20} className="mr-3 text-primary" />
            <span>Конфиденциальность</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Palette" size={20} className="mr-3 text-primary" />
            <span>Оформление</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="HelpCircle" size={20} className="mr-3 text-primary" />
            <span>Помощь</span>
          </Button>
        </div>

        <Button variant="destructive" className="w-full rounded-xl">
          <Icon name="LogOut" size={20} className="mr-2" />
          Выйти
        </Button>
      </div>
    </ScrollArea>
  );
}
