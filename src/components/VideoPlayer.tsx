"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { ClinicVideo } from "@/data/mediaManifest";

interface VideoPlayerProps {
  video: ClinicVideo;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="bg-ivory-100 border border-forest-950/15 overflow-hidden flex flex-col group">
      {/* Video Viewport — uses object-contain so no cropping/distortion regardless of aspect ratio */}
      <div className="relative bg-charcoal-950 flex items-center justify-center min-h-[240px]">
        <video
          ref={videoRef}
          src={video.src}
          muted={isMuted}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          // object-contain preserves the video's original aspect ratio without any cropping.
          // The dark background fills any letterbox bars, which is appropriate for clinical footage.
          className="w-full max-h-[520px] object-contain"
        />

        {/* Play/Pause Centre Overlay */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause clinical video" : "Play clinical video"}
          className={`absolute z-10 w-14 h-14 rounded-full bg-forest-950/85 border border-gold-400/40 text-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-forest-900 shadow-xl ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-95"
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>

        {/* Hover Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-charcoal-900/90 to-transparent flex items-center justify-between text-ivory-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-gold-400 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-1 hover:text-gold-400 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-[11px] font-mono text-ivory-300 tracking-wider">
              Clinical Video Record
            </span>
          </div>
          <button
            onClick={handleFullscreen}
            className="p-1 hover:text-gold-400 transition-colors"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Description */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-600 block mb-1">
            Operative Video Documentation
          </span>
          <h4 className="font-serif text-lg font-medium text-forest-950 mb-2">
            {video.title}
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed font-sans mb-3">
            {video.caption}
          </p>
        </div>
        <p className="text-[11px] text-charcoal-500 italic border-t border-forest-950/10 pt-3">
          {video.description}
        </p>
      </div>
    </div>
  );
}
