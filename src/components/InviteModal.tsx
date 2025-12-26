import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const inviteLink = `${window.location.origin}/?invite=true`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Присоединяйся к мессенджеру!',
          text: 'Зарегистрируйся в нашем мессенджере по этой ссылке:',
          url: inviteLink,
        });
      } catch (error) {
        console.error('Ошибка при попытке поделиться:', error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Пригласить друзей</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-white">
              <Icon name="UserPlus" size={40} />
            </div>
            <p className="text-sm text-muted-foreground">
              Поделитесь ссылкой с друзьями, чтобы они могли зарегистрироваться в мессенджере
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Icon name="Check" size={20} className="text-green-500" />
              ) : (
                <Icon name="Copy" size={20} />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="w-full"
            >
              <Icon name="Share2" size={18} className="mr-2" />
              Поделиться
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-full"
            >
              <Icon name="Link" size={18} className="mr-2" />
              Копировать
            </Button>
          </div>

          <div className="pt-4 border-t space-y-3">
            <p className="text-sm font-medium">Быстрый доступ:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Присоединяйся к мессенджеру: ${inviteLink}`)}`)}
                className="flex flex-col h-auto py-3"
              >
                <Icon name="MessageCircle" size={24} className="mb-1 text-green-600" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('Присоединяйся к мессенджеру!')}`)}
                className="flex flex-col h-auto py-3"
              >
                <Icon name="Send" size={24} className="mb-1 text-blue-500" />
                <span className="text-xs">Telegram</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:?subject=Приглашение в мессенджер&body=${encodeURIComponent(`Присоединяйся: ${inviteLink}`)}`)}
                className="flex flex-col h-auto py-3"
              >
                <Icon name="Mail" size={24} className="mb-1 text-red-500" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
          Закрыть
        </Button>
      </DialogContent>
    </Dialog>
  );
}
