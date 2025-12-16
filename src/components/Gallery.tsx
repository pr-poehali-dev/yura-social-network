import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const mockImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/400/300?random=${i}`,
  date: i < 4 ? "Сегодня" : i < 8 ? "Вчера" : "На этой неделе",
}));

const mockVideos = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/400/300?random=${i + 20}`,
  duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
}));

export default function Gallery() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <h2 className="text-xl font-bold">Галерея</h2>
      </div>

      <Tabs defaultValue="photos" className="flex-1 flex flex-col">
        <div className="px-4 pt-3 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="photos" className="flex-1">
              <Icon name="Image" size={18} className="mr-2" />
              Фото
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">
              <Icon name="Video" size={18} className="mr-2" />
              Видео
            </TabsTrigger>
            <TabsTrigger value="files" className="flex-1">
              <Icon name="File" size={18} className="mr-2" />
              Файлы
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="photos" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {mockImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                  >
                    <img
                      src={image.url}
                      alt={`Gallery ${image.id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="videos" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {mockVideos.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-video rounded-lg overflow-hidden cursor-pointer relative group"
                  >
                    <img
                      src={video.url}
                      alt={`Video ${video.id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Icon name="Play" size={24} className="text-primary ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="files" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {[
                { name: "Презентация.pdf", size: "2.4 MB", icon: "FileText" },
                { name: "Договор.docx", size: "845 KB", icon: "FileText" },
                { name: "Отчет.xlsx", size: "1.2 MB", icon: "FileSpreadsheet" },
                { name: "Архив.zip", size: "15.8 MB", icon: "Archive" },
              ].map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-card transition-all cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
                    <Icon name={file.icon as any} size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <Icon name="Download" size={20} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
