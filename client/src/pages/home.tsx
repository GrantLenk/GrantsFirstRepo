import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPanel from "@/components/admin-panel";
import CountdownTimer from "@/components/countdown-timer";
import VideoPlayer from "@/components/video-player";
import RevenuePieChart from "@/components/revenue-pie-chart";
import type { Broadcast } from "@shared/schema";

export default function Home() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [broadcastState, setBroadcastState] = useState<'waiting' | 'playing' | 'ended' | 'none'>('waiting');

  const { data: broadcast, isLoading } = useQuery<Broadcast | null>({
    queryKey: ['/api/broadcast/today'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Initialize broadcast state based on current time and broadcast time
  useEffect(() => {
    if (broadcast) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const [hours, minutes] = broadcast.broadcastTime.split(':').map(Number);
      const broadcastTime = new Date(today.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
      
      console.log('Broadcast found:', broadcast);
      console.log('Current time:', now);
      console.log('Broadcast time:', broadcastTime);
      
      if (now >= broadcastTime) {
        console.log('Setting state to ended');
        setBroadcastState('ended');
      } else {
        console.log('Setting state to waiting');
        setBroadcastState('waiting');
      }
    } else {
      console.log('No broadcast found, setting state to none');
      setBroadcastState('none');
    }
  }, [broadcast]);

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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Daily Ad Display</h1>
          <p className="text-slate-600 text-lg">Your scheduled advertisement will appear here</p>
        </div>

        {!broadcast ? (
          /* No Ad Scheduled State */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl text-slate-400 mb-4">📺</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No ad scheduled</h3>
              <p className="text-slate-600">Use the admin panel to schedule today's advertisement</p>
            </div>
          </div>
        ) : broadcastState === 'ended' ? (
          /* Post-Ad State */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl text-emerald-500 mb-4">✅</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Today's ad has finished</h3>
              <p className="text-slate-600">Advertisement completed successfully</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-600">
                ℹ️ Next ad: Tomorrow at {broadcast.broadcastTime}
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
                  {broadcastState === 'playing' ? 'Ad playing now!' : 'Next ad in:'}
                </span>
              </div>
              
              {broadcastState === 'waiting' && (
                <>
                  <CountdownTimer
                    targetTime={broadcast.broadcastTime}
                    onComplete={handleCountdownComplete}
                  />
                  <p className="text-sm text-slate-600 mt-3">
                    Today's ad: <span className="font-medium">{broadcast.videoTitle}</span>
                  </p>
                </>
              )}
            </div>

            {/* Ad Player Container */}
            <VideoPlayer
              videoUrl={broadcast.videoUrl}
              videoTitle={broadcast.videoTitle}
              broadcastTime={broadcast.broadcastTime}
              isPlaying={broadcastState === 'playing'}
              onVideoEnd={handleVideoEnd}
            />

            {/* Revenue Distribution Chart */}
            <div className="mt-8">
              <RevenuePieChart 
                adPayment={parseInt(broadcast.adPayment || "1000")} 
                estimatedViewers={1250}
              />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm mt-12">
          <p>Daily Ad Display © 2024</p>
        </footer>
      </div>
    </div>
  );
}
