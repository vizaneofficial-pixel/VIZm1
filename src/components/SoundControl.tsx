import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Flame, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { volcanoAudio } from "../utils/audio";

interface SoundControlProps {
  onExplosionTriggered?: () => void;
}

export default function SoundControl({ onExplosionTriggered }: SoundControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4); // default 40%
  const [isExpanded, setIsExpanded] = useState(false);
  const [explosionCooldown, setExplosionCooldown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Synchronize audio state on mount/intervals
  useEffect(() => {
    // Keep internal engine state in sync with our state
    volcanoAudio.onStateChange = (playing) => {
      setIsPlaying(playing);
    };

    // Close on click outside to keep UI clean
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTogglePlay = () => {
    const nextState = volcanoAudio.toggleAmbient();
    setIsPlaying(nextState);
    // Sync initial volume
    volcanoAudio.setVolume(nextState ? volume : 0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isPlaying) {
      volcanoAudio.setVolume(val);
    }
  };

  const handleTriggerExplosion = () => {
    if (explosionCooldown) return;
    
    // Trigger procedural audio synthesiser
    volcanoAudio.triggerExplosion();
    
    // Fire callback for visual camera shake
    if (onExplosionTriggered) {
      onExplosionTriggered();
    }

    // Set interactive cooldown & animation trigger
    setExplosionCooldown(true);
    setTimeout(() => {
      setExplosionCooldown(false);
    }, 3000); // 3 seconds cooldown
  };

  return (
    <div 
      ref={panelRef} 
      id="volcanic-music-controller" 
      className="fixed bottom-6 left-6 z-40 font-mono"
    >
      <div className="relative flex items-end gap-3">
        {/* Toggle / Quick Action Button */}
        <motion.button
          id="sound-control-main-toggle"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/[0.08] backdrop-blur-2xl transition-all duration-500 cursor-pointer ${
            isPlaying 
              ? "bg-[#df7b34]/25 border-[#df7b34]/40 text-[#df7b34] shadow-[0_0_20px_rgba(223,123,52,0.25)]" 
              : "bg-[#090909]/95 text-gray-400 hover:text-white"
          }`}
          title="Volcanic Sound Engine"
        >
          {isPlaying ? (
            <div className="flex items-center gap-[2px] h-4">
              <span className="w-[2px] h-3 bg-[#df7b34] rounded-full animate-[bounce_0.6s_infinite_alternate]" />
              <span className="w-[2px] h-4 bg-[#df7b34] rounded-full animate-[bounce_0.8s_infinite_alternate_0.2s]" />
              <span className="w-[2px] h-2 bg-[#df7b34] rounded-full animate-[bounce_0.5s_infinite_alternate_0.1s]" />
              <span className="w-[2px] h-4 bg-[#df7b34] rounded-full animate-[bounce_0.7s_infinite_alternate_0.3s]" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </motion.button>

        {/* Expanded Console Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="sound-control-console-drawer"
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute left-14 bottom-0 w-72 bg-[#090909]/95 border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 shadow-[0_24px_50px_rgba(0,0,0,0.9)] text-[#b5b5b5] select-none pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-4 h-4 ${isPlaying ? "text-[#df7b34] animate-pulse" : "text-gray-500"}`} />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Volcanic Space BGM</span>
                </div>
                <span className="text-[8px] bg-white/[0.05] text-[#df7b34] border border-[#df7b34]/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  BY VIZ
                </span>
              </div>

              {/* BGM Toggle Control */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-white tracking-wide">Fiery Rumble Loop</span>
                  <span className="text-[8px] text-[#777777] lowercase">Procedural high-pass lava crackle</span>
                </div>
                <button
                  id="sound-control-bgm-active"
                  onClick={handleTogglePlay}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-400 ease-out cursor-pointer ${
                    isPlaying ? "bg-[#df7b34]" : "bg-white/[0.08]"
                  }`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ x: isPlaying ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </button>
              </div>

              {/* Master Volume Controller */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex justify-between items-center text-[10px] text-[#777777]">
                  <span>LEVEL CONTROLLER</span>
                  <span className="text-white font-semibold">{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-[#555]" />
                  <input
                    id="sound-control-volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer accent-[#df7b34] hover:bg-white/[0.1] transition-colors"
                  />
                  <Volume2 className="w- 3.5 h-3.5 text-[#df7b34]" />
                </div>
              </div>

              {/* Volcano Explode Manual Trigger */}
              <div className="border-t border-white/[0.05] pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] text-[#777777]">
                  <span>SEISMIC EVENT</span>
                  {explosionCooldown ? (
                    <span className="text-amber-500/60 animate-pulse text-[9px] lowercase">cooling...</span>
                  ) : (
                    <span className="text-green-500/70 text-[9px] uppercase">Ready</span>
                  )}
                </div>
                <motion.button
                  id="sound-control-trigger-explosion-btn"
                  whileHover={{ scale: explosionCooldown ? 1 : 1.02, boxShadow: "0 0 15px rgba(223,123,52,0.15)" }}
                  whileTap={{ scale: explosionCooldown ? 1 : 0.98 }}
                  disabled={explosionCooldown}
                  onClick={handleTriggerExplosion}
                  className={`w-full py-2.5 rounded-xl text-[10px] uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all duration-300 border cursor-pointer ${
                    explosionCooldown
                      ? "bg-white/[0.02] border-white/[0.04] text-[#444] cursor-not-allowed"
                      : "bg-[#df7b34]/15 border-[#df7b34]/30 hover:border-[#df7b34]/80 text-[#df7b34] hover:bg-[#df7b34]/25 shadow-[0_4px_12px_rgba(223,123,52,0.05)]"
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${explosionCooldown ? "" : "animate-[pulse_1s_infinite]"}`} />
                  Trigger Explosion
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
