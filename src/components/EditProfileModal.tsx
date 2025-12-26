import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { authAPI, User, uploadAPI } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUpdate: (user: User) => void;
}

export default function EditProfileModal({ open, onOpenChange, user, onUpdate }: EditProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (!base64) return;

        const result = await uploadAPI.uploadFile(base64, file.name, file.type, 'avatars');
        setAvatarUrl(result.url);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      alert('Не удалось загрузить изображение');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Имя обязательно для заполнения');
      return;
    }

    setSaving(true);
    try {
      const result = await authAPI.updateProfile(user.id, {
        name: name.trim(),
        bio: bio.trim() || null,
        avatar_url: avatarUrl || null,
      });

      const updatedUser = { ...user, ...result.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUpdate(updatedUser);
      onOpenChange(false);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      alert('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="gradient-primary text-white text-2xl">
                  {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload">
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full gradient-accent text-white h-8 w-8"
                  disabled={uploading}
                  type="button"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  {uploading ? (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  ) : (
                    <Icon name="Camera" size={16} />
                  )}
                </Button>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">Нажмите на камеру чтобы изменить фото</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Расскажите о себе..."
              rows={4}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
          </div>

          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input value={user.phone} disabled className="bg-muted" />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={saving}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 gradient-primary text-white"
            disabled={saving || uploading}
          >
            {saving ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
