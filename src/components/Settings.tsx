import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { notificationsAPI } from "@/lib/notifications";
import { settingsAPI, UserSettings } from "@/lib/api";
import { useState, useEffect } from "react";

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.getSettings(user.id);
      setSettings(data);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    if (!settings) return;
    
    try {
      const updated = await settingsAPI.updateSettings(user.id, { [key]: value });
      setSettings(updated);
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      alert('Не удалось обновить настройку');
    }
  };

  const handlePushToggle = async (checked: boolean) => {
    if (!notificationsAPI.isSupported()) {
      alert('Ваш браузер не поддерживает push-уведомления');
      return;
    }

    try {
      if (checked) {
        await notificationsAPI.registerServiceWorker();
        const permission = await notificationsAPI.requestPermission();
        if (permission === 'granted') {
          await notificationsAPI.subscribeToPush(user.id);
          await updateSetting('push_notifications', true);
        }
      } else {
        await notificationsAPI.unsubscribe();
        await updateSetting('push_notifications', false);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось изменить настройки уведомлений');
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Загрузка настроек...</p>
      </div>
    );
  }
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
              <Switch 
                checked={settings.message_sound}
                onCheckedChange={(checked) => updateSetting('message_sound', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Звук звонков</p>
                <p className="text-sm text-muted-foreground">Включить рингтон</p>
              </div>
              <Switch 
                checked={settings.call_sound}
                onCheckedChange={(checked) => updateSetting('call_sound', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-sm text-muted-foreground">Получать уведомления о новых сообщениях</p>
              </div>
              <Switch 
                checked={settings.push_notifications} 
                onCheckedChange={handlePushToggle}
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
              <Switch 
                checked={settings.show_online_status}
                onCheckedChange={(checked) => updateSetting('show_online_status', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Прочитанные сообщения</p>
                <p className="text-sm text-muted-foreground">Отправлять уведомления о прочтении</p>
              </div>
              <Switch 
                checked={settings.send_read_receipts}
                onCheckedChange={(checked) => updateSetting('send_read_receipts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Двухфакторная аутентификация</p>
                <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
              </div>
              <Switch 
                checked={settings.two_factor_auth}
                onCheckedChange={(checked) => updateSetting('two_factor_auth', checked)}
              />
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
              <Switch 
                checked={settings.dark_theme}
                onCheckedChange={(checked) => updateSetting('dark_theme', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Анимации</p>
                <p className="text-sm text-muted-foreground">Плавные переходы интерфейса</p>
              </div>
              <Switch 
                checked={settings.animations}
                onCheckedChange={(checked) => updateSetting('animations', checked)}
              />
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
              <Switch 
                checked={settings.hd_quality}
                onCheckedChange={(checked) => updateSetting('hd_quality', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Шумоподавление</p>
                <p className="text-sm text-muted-foreground">Фильтровать фоновый шум</p>
              </div>
              <Switch 
                checked={settings.noise_cancellation}
                onCheckedChange={(checked) => updateSetting('noise_cancellation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Автоматическое подключение</p>
                <p className="text-sm text-muted-foreground">Отвечать на звонки автоматически</p>
              </div>
              <Switch 
                checked={settings.auto_answer}
                onCheckedChange={(checked) => updateSetting('auto_answer', checked)}
              />
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