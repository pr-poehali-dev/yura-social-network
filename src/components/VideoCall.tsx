import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoCallProps {
  contactName: string;
  contactAvatar?: string;
  isVideoCall: boolean;
  onEndCall: () => void;
}

export default function VideoCall({ contactName, contactAvatar, isVideoCall, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideoCall);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoCall,
          audio: true,
        });
        streamRef.current = stream;
        
        if (localVideoRef.current && isVideoCall) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Ошибка доступа к камере/микрофону:', error);
        alert('Не удалось получить доступ к камере или микрофону');
      }
    };

    startCall();

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoCall]);

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 to-pink-900 flex flex-col">
      <div className="flex-1 relative">
        {isVideoCall ? (
          <>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 right-4 w-32 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-white">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-6">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src={contactAvatar} />
                <AvatarFallback className="gradient-primary text-white text-3xl">
                  {contactName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-white">{contactName}</h2>
                <p className="text-xl text-white/80 mt-2">{formatDuration(callDuration)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white font-mono">{formatDuration(callDuration)}</p>
        </div>
      </div>

      <div className="p-8 flex justify-center items-center gap-6">
        <Button
          size="icon"
          variant="ghost"
          className={`w-16 h-16 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 backdrop-blur-sm`}
          onClick={toggleMute}
        >
          <Icon name={isMuted ? "MicOff" : "Mic"} size={24} className="text-white" />
        </Button>

        {isVideoCall && (
          <Button
            size="icon"
            variant="ghost"
            className={`w-16 h-16 rounded-full ${!isVideoEnabled ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 backdrop-blur-sm`}
            onClick={toggleVideo}
          >
            <Icon name={isVideoEnabled ? "Video" : "VideoOff"} size={24} className="text-white" />
          </Button>
        )}

        <Button
          size="icon"
          className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600"
          onClick={onEndCall}
        >
          <Icon name="PhoneOff" size={28} className="text-white" />
        </Button>
      </div>
    </div>
  );
}
