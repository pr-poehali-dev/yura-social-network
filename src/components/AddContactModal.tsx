import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { messagesAPI } from '@/lib/api';

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  onContactAdded: () => void;
}

export default function AddContactModal({ open, onOpenChange, userId, onContactAdded }: AddContactModalProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContact = async () => {
    if (!phone.trim()) {
      alert('Введите номер телефона');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Некорректный номер телефона');
      return;
    }

    setLoading(true);
    try {
      const contacts = await messagesAPI.getContacts(userId);
      const existingContact = contacts.find(c => c.phone.replace(/\D/g, '') === cleanPhone);
      
      if (existingContact) {
        const chatId = await messagesAPI.createChat(userId, [existingContact.id], false);
        alert(`Контакт найден! Чат создан.`);
        onContactAdded();
        onOpenChange(false);
        setPhone('');
      } else {
        alert('Пользователь с таким номером не найден. Пригласите его зарегистрироваться!');
      }
    } catch (error) {
      console.error('Ошибка добавления контакта:', error);
      alert('Не удалось добавить контакт');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить контакт</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-white">
              <Icon name="UserPlus" size={32} />
            </div>
            <p className="text-sm text-muted-foreground">
              Введите номер телефона контакта
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="+7 (999) 123-45-67"
              className="text-lg"
              maxLength={18}
            />
            <p className="text-xs text-muted-foreground">
              Контакт должен быть зарегистрирован в мессенджере
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setPhone('');
            }}
            className="flex-1"
            disabled={loading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleAddContact}
            className="flex-1 gradient-primary text-white"
            disabled={loading || !phone}
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Поиск...
              </>
            ) : (
              <>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
