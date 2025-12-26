import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { authAPI, User } from "@/lib/api";

interface LoginScreenProps {
  onLogin: (user: User, token: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError("Введите имя");
          setLoading(false);
          return;
        }
        const data = await authAPI.register(phone, name);
        onLogin(data.user, data.token);
      } else {
        const data = await authAPI.login(phone);
        onLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center">
            <Icon name="MessageCircle" size={40} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {isRegister ? "Регистрация" : "Вход в мессенджер"}
          </CardTitle>
          <CardDescription>
            {isRegister 
              ? "Создайте аккаунт для начала общения" 
              : "Введите номер телефона для входа"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <Input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  className="border-2"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Телефон</label>
              <Input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border-2"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? "Загрузка..." : isRegister ? "Создать аккаунт" : "Войти"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
