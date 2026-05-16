"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";

export function LessonPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white/50 text-center">
          <Play className="h-16 w-16 mx-auto mb-2" />
          <p>Video Player</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-2">
          <div className="relative h-1 bg-white/30 rounded-full cursor-pointer">
            <div
              className="absolute h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute h-3 w-3 bg-white rounded-full -top-1 transform -translate-x-1/2"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>

              <span className="text-sm">8:45 / 25:00</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
