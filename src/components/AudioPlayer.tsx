import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface AudioPlayerProps {
  audioUrl: string;
  duration?: number;
}

export default function AudioPlayer({ audioUrl, duration: providedDuration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(providedDuration || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(Math.floor(audio.duration));
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(Math.floor(audio.currentTime));
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl max-w-[280px]">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className="gradient-accent text-white hover:opacity-90 h-10 w-10 rounded-full"
      >
        {isPlaying ? <Icon name="Pause" size={18} /> : <Icon name="Play" size={18} />}
      </Button>

      <div className="flex-1">
        <div className="h-1 bg-white rounded-full overflow-hidden">
          <div
            className="h-full gradient-accent transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-600 font-mono">{formatTime(currentTime)}</span>
          <span className="text-xs text-gray-500 font-mono">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
