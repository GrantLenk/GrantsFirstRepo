import { useEffect, useRef } from "react";
import { Play, Calendar, Clock, Eye } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  videoTitle: string;
  broadcastTime: string;
  isPlaying: boolean;
  onVideoEnd: () => void;
}

export default function VideoPlayer({ 
  videoUrl, 
  videoTitle, 
  broadcastTime, 
  isPlaying, 
  onVideoEnd 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [isPlaying]);

  const handleVideoEnded = () => {
    onVideoEnd();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Video Player */}
      <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
        {!isPlaying ? (
          /* Waiting State */
          <div className="text-center text-white">
            <div className="mb-4">
              <Play className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advertisement will begin shortly</h3>
            <p className="text-slate-300">Get ready for today's ad</p>
          </div>
        ) : (
          /* Video Element */
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            onEnded={handleVideoEnded}
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">{videoTitle}</h2>
        <div className="flex items-center text-slate-600 text-sm space-x-4">
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            Today, {broadcastTime}
          </span>
          <span className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            Scheduled ad
          </span>
          <span className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            {isPlaying ? 'Now playing' : 'Scheduled'}
          </span>
        </div>
      </div>
    </div>
  );
}
