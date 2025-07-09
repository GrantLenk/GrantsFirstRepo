import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPanel from "@/components/admin-panel";
import CountdownTimer from "@/components/countdown-timer";
import VideoPlayer from "@/components/video-player";
import type { Broadcast } from "@shared/schema";

export default function Home() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [broadcastState, setBroadcastState] = useState<'waiting' | 'playing' | 'ended' | 'none'>('waiting');

  const { data: broadcast, isLoading } = useQuery<Broadcast | null>({
    queryKey: ['/api/broadcast/today'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleCountdownComplete = () => {
    setBroadcastState('playing');
  };

  const handleVideoEnd = () => {
    setBroadcastState('ended');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter relative">
      {/* Admin Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 bg-slate-200 hover:bg-slate-300 text-slate-600"
        onClick={() => setShowAdminPanel(!showAdminPanel)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          broadcast={broadcast}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Daily Video Broadcast</h1>
          <p className="text-slate-600 text-lg">Experience something new every day</p>
        </div>

        {!broadcast ? (
          /* No Video Scheduled State */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl text-slate-400 mb-4">📅</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No broadcast scheduled</h3>
              <p className="text-slate-600">Check back tomorrow for the next daily video</p>
            </div>
          </div>
        ) : broadcastState === 'ended' ? (
          /* Post-Broadcast State */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl text-emerald-500 mb-4">✅</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Today's broadcast has ended</h3>
              <p className="text-slate-600">Thanks for watching! Come back tomorrow for the next video</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-600">
                ℹ️ Next broadcast: Tomorrow at {broadcast.broadcastTime}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Status Banner */}
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mb-8 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="text-brand-500 mr-2">🕐</div>
                <span className="text-brand-700 font-medium">
                  {broadcastState === 'playing' ? 'Broadcasting now!' : 'Next broadcast in:'}
                </span>
              </div>
              
              {broadcastState === 'waiting' && (
                <>
                  <CountdownTimer
                    targetTime={broadcast.broadcastTime}
                    onComplete={handleCountdownComplete}
                  />
                  <p className="text-sm text-slate-600 mt-3">
                    Today's broadcast: <span className="font-medium">{broadcast.videoTitle}</span>
                  </p>
                </>
              )}
            </div>

            {/* Video Player Container */}
            <VideoPlayer
              videoUrl={broadcast.videoUrl}
              videoTitle={broadcast.videoTitle}
              broadcastTime={broadcast.broadcastTime}
              isPlaying={broadcastState === 'playing'}
              onVideoEnd={handleVideoEnd}
            />
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm mt-12">
          <p>Daily Video Broadcast © 2024</p>
        </footer>
      </div>
    </div>
  );
}
