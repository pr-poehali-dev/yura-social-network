import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import Contacts from "@/components/Contacts";
import Profile from "@/components/Profile";
import Gallery from "@/components/Gallery";
import Calls from "@/components/Calls";
import Settings from "@/components/Settings";

type Tab = "chats" | "contacts" | "profile" | "gallery" | "calls" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [selectedChatId, setSelectedChatId] = useState<number>();
  const [search, setSearch] = useState("");

  const renderLeftPanel = () => {
    switch (activeTab) {
      case "chats":
        return (
          <>
            <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-3">Чаты</h2>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-full border-2"
                />
              </div>
            </div>
            <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
          </>
        );
      case "contacts":
        return <Contacts />;
      case "profile":
        return <Profile />;
      case "gallery":
        return <Gallery />;
      case "calls":
        return <Calls />;
      case "settings":
        return <Settings />;
    }
  };

  const renderRightPanel = () => {
    if (activeTab === "chats") {
      return <ChatWindow chatId={selectedChatId} />;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-20 gradient-primary flex flex-col items-center py-6 gap-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Icon name="MessageCircle" size={24} className="text-primary" />
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveTab("chats")}
            className={`rounded-xl transition-all ${
              activeTab === "chats" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name="MessageSquare" size={24} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveTab("contacts")}
            className={`rounded-xl transition-all ${
              activeTab === "contacts" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name="Users" size={24} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveTab("calls")}
            className={`rounded-xl transition-all ${
              activeTab === "calls" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name="Phone" size={24} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveTab("gallery")}
            className={`rounded-xl transition-all ${
              activeTab === "gallery" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name="Image" size={24} />
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveTab("settings")}
            className={`rounded-xl transition-all ${
              activeTab === "settings" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name="Settings" size={24} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActiveTab("profile")}
            className={`rounded-xl transition-all ${
              activeTab === "profile" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name="User" size={24} />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 bg-white/95 backdrop-blur-sm border-r flex flex-col">
          {renderLeftPanel()}
        </div>

        <div className="flex-1">
          {renderRightPanel()}
          {activeTab !== "chats" && (
            <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
