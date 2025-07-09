import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Broadcast } from "@shared/schema";

interface AdminPanelProps {
  broadcast: Broadcast | null;
  onClose: () => void;
}

export default function AdminPanel({ broadcast, onClose }: AdminPanelProps) {
  const [videoUrl, setVideoUrl] = useState(broadcast?.videoUrl || "");
  const [broadcastTime, setBroadcastTime] = useState(broadcast?.broadcastTime || "15:00");
  const [videoTitle, setVideoTitle] = useState(broadcast?.videoTitle || "");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveBroadcastMutation = useMutation({
    mutationFn: async (data: { videoUrl: string; broadcastTime: string; videoTitle: string }) => {
      const response = await apiRequest("POST", "/api/broadcast", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Broadcast settings saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/broadcast/today'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save broadcast settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!videoUrl || !broadcastTime || !videoTitle) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(videoUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    saveBroadcastMutation.mutate({ videoUrl, broadcastTime, videoTitle });
  };

  return (
    <Card className="fixed top-16 right-4 z-40 w-80 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Admin Settings</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
          />
        </div>
        
        <div>
          <Label htmlFor="broadcastTime">Broadcast Time</Label>
          <Input
            id="broadcastTime"
            type="time"
            value={broadcastTime}
            onChange={(e) => setBroadcastTime(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="videoTitle">Video Title</Label>
          <Input
            id="videoTitle"
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Today's Featured Video"
          />
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={saveBroadcastMutation.isPending}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {saveBroadcastMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
