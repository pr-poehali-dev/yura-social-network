import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { uploadAPI } from "@/lib/api";

interface VoiceRecorderProps {
  onRecordingComplete: (fileUrl: string, duration: number, fileSize: number) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const { isRecording, duration, startRecording, stopRecording, cancelRecording, getAudioBlob } = useAudioRecorder();

  const handleStart = () => {
    startRecording();
  };

  const handleStop = async () => {
    stopRecording();
    
    setTimeout(async () => {
      const blob = getAudioBlob();
      if (!blob) return;

      try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const result = await uploadAPI.uploadFile(base64, 'voice.webm', 'audio/webm', 'voice');
          onRecordingComplete(result.url, duration, result.file_size);
        };
      } catch (error) {
        console.error('Ошибка загрузки голосового сообщения:', error);
        alert('Не удалось загрузить голосовое сообщение');
      }
    }, 100);
  };

  const handleCancel = () => {
    cancelRecording();
    onCancel();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 p-3 border-t bg-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCancel}
        className="text-red-500 hover:text-red-600"
      >
        <Icon name="X" size={20} />
      </Button>
      
      <div className="flex-1 flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
        <span className="font-mono text-lg">{formatDuration(duration)}</span>
      </div>

      {!isRecording ? (
        <Button
          onClick={handleStart}
          className="gradient-primary text-white"
          size="icon"
        >
          <Icon name="Mic" size={20} />
        </Button>
      ) : (
        <Button
          onClick={handleStop}
          className="gradient-accent text-white"
          size="icon"
        >
          <Icon name="Send" size={20} />
        </Button>
      )}
    </div>
  );
}
