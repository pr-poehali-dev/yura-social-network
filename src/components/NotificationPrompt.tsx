import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { notificationsAPI } from "@/lib/notifications";

interface NotificationPromptProps {
  userId: number;
  onComplete: () => void;
}

export default function NotificationPrompt({ userId, onComplete }: NotificationPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const permission = notificationsAPI.getPermissionStatus();
    const hasAsked = localStorage.getItem('notification-asked');
    
    if (notificationsAPI.isSupported() && permission === 'default' && !hasAsked) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      await notificationsAPI.registerServiceWorker();
      
      const permission = await notificationsAPI.requestPermission();
      
      if (permission === 'granted') {
        await notificationsAPI.subscribeToPush(userId);
        localStorage.setItem('notification-enabled', 'true');
        onComplete();
      }
      
      localStorage.setItem('notification-asked', 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Ошибка включения уведомлений:', error);
      alert('Не удалось включить уведомления. Проверьте настройки браузера.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('notification-asked', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center">
            <Icon name="Bell" size={40} className="text-white" />
          </div>
          <CardTitle className="text-2xl">Включить уведомления?</CardTitle>
          <CardDescription>
            Получайте мгновенные оповещения о новых сообщениях, даже когда мессенджер закрыт
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleEnable}
            className="w-full gradient-primary text-white py-6 text-lg"
            disabled={loading}
          >
            {loading ? "Настройка..." : "Включить уведомления"}
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full"
            disabled={loading}
          >
            Может быть позже
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
