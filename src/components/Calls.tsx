import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface Call {
  id: number;
  name: string;
  type: "incoming" | "outgoing" | "missed";
  callType: "voice" | "video";
  time: string;
  duration?: string;
}

const mockCalls: Call[] = [
  { id: 1, name: "Анна Смирнова", type: "incoming", callType: "video", time: "14:32", duration: "12:45" },
  { id: 2, name: "Дмитрий Петров", type: "outgoing", callType: "voice", time: "13:15", duration: "5:23" },
  { id: 3, name: "Мария Иванова", type: "missed", callType: "video", time: "Вчера" },
  { id: 4, name: "Алексей Козлов", type: "incoming", callType: "voice", time: "Вчера", duration: "18:12" },
  { id: 5, name: "Елена Новикова", type: "outgoing", callType: "video", time: "Пн", duration: "45:30" },
  { id: 6, name: "Сергей Волков", type: "missed", callType: "voice", time: "Пн" },
];

const getCallIcon = (type: Call["type"], callType: Call["callType"]) => {
  if (callType === "video") {
    return type === "missed" ? "VideoOff" : "Video";
  }
  return type === "missed" ? "PhoneOff" : "Phone";
};

const getCallColor = (type: Call["type"]) => {
  switch (type) {
    case "incoming": return "text-green-600";
    case "outgoing": return "text-blue-600";
    case "missed": return "text-red-600";
  }
};

export default function Calls() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-3">Звонки</h2>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-4 pt-2 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">Все</TabsTrigger>
            <TabsTrigger value="missed" className="flex-1">Пропущенные</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {mockCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-card transition-all"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="gradient-accent text-white font-medium">
                      {call.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{call.name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Icon 
                        name={getCallIcon(call.type, call.callType) as any} 
                        size={14} 
                        className={getCallColor(call.type)}
                      />
                      <span className="text-muted-foreground">
                        {call.time}
                        {call.duration && ` • ${call.duration}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                      <Icon name="Phone" size={18} className="text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                      <Icon name="Video" size={18} className="text-blue-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="missed" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {mockCalls.filter(call => call.type === "missed").map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-card transition-all"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="gradient-accent text-white font-medium">
                      {call.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{call.name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Icon 
                        name={getCallIcon(call.type, call.callType) as any} 
                        size={14} 
                        className={getCallColor(call.type)}
                      />
                      <span className="text-muted-foreground">{call.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                      <Icon name="Phone" size={18} className="text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                      <Icon name="Video" size={18} className="text-blue-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <Button className="w-full gradient-primary text-white rounded-full">
          <Icon name="Video" size={20} className="mr-2" />
          Начать видеозвонок
        </Button>
      </div>
    </div>
  );
}
