import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { notificationsAPI } from "@/lib/notifications";
import { useState, useEffect } from "react";

export default function Settings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isEnabled = notificationsAPI.getPermissionStatus() === 'granted';
    setPushEnabled(isEnabled);
  }, []);

  const handlePushToggle = async (checked: boolean) => {
    if (!notificationsAPI.isSupported()) {
      alert('Ваш браузер не поддерживает push-уведомления');
      return;
    }

    setLoading(true);
    try {
      if (checked) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        await notificationsAPI.registerServiceWorker();
        const permission = await notificationsAPI.requestPermission();
        if (permission === 'granted') {
          await notificationsAPI.subscribeToPush(user.id);
          setPushEnabled(true);
        }
      } else {
        await notificationsAPI.unsubscribe();
        setPushEnabled(false);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось изменить настройки уведомлений');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Настройки</h2>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-primary" />
            Уведомления
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Звук сообщений</p>
                <p className="text-sm text-muted-foreground">Воспроизводить звук при получении</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Звук звонков</p>
                <p className="text-sm text-muted-foreground">Включить рингтон</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-sm text-muted-foreground">Получать уведомления о новых сообщениях</p>
              </div>
              <Switch 
                checked={pushEnabled} 
                onCheckedChange={handlePushToggle}
                disabled={loading}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Icon name="Lock" size={20} className="text-primary" />
            Конфиденциальность
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Статус "В сети"</p>
                <p className="text-sm text-muted-foreground">Показывать когда вы онлайн</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Прочитанные сообщения</p>
                <p className="text-sm text-muted-foreground">Отправлять уведомления о прочтении</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Двухфакторная аутентификация</p>
                <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Icon name="Palette" size={20} className="text-primary" />
            Оформление
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Тёмная тема</p>
                <p className="text-sm text-muted-foreground">Использовать тёмный режим</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Анимации</p>
                <p className="text-sm text-muted-foreground">Плавные переходы интерфейса</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Icon name="Video" size={20} className="text-primary" />
            Видеозвонки
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">HD качество</p>
                <p className="text-sm text-muted-foreground">Использовать высокое качество видео</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Шумоподавление</p>
                <p className="text-sm text-muted-foreground">Фильтровать фоновый шум</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Автоматическое подключение</p>
                <p className="text-sm text-muted-foreground">Отвечать на звонки автоматически</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Database" size={20} className="mr-3 text-primary" />
            <span>Управление данными</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Shield" size={20} className="mr-3 text-primary" />
            <span>Безопасность</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="HelpCircle" size={20} className="mr-3 text-primary" />
            <span>Помощь и поддержка</span>
          </Button>
          
          <Button variant="outline" className="w-full justify-start rounded-xl h-14">
            <Icon name="Info" size={20} className="mr-3 text-primary" />
            <span>О приложении</span>
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}