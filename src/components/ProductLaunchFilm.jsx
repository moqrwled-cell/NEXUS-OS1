import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles, 
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { openSeamlessCheckout } from '../utils/checkoutPopup';
import { useNavigate } from 'react-router-dom';

export default function ProductLaunchFilm({ isRtl = false }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(48);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls when playing and inactive
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2800);
    }
  };

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimeout();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) container.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 48);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const togglePlay = () => {
    setHasInteracted(true);
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        resetControlsTimeout();
      }).catch(err => console.log('Playback error:', err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(console.log);
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(console.log);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only when video container is focused or fullscreen
      if (document.fullscreenElement === containerRef.current) {
        if (e.code === 'Space') {
          e.preventDefault();
          togglePlay();
        } else if (e.code === 'KeyM') {
          toggleMute();
        } else if (e.code === 'KeyF') {
          toggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  return (
    <section id="launch-film" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
      
      {/* Editorial Section Header: Ad Creative Strategist + UI Designer standard */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/30 text-nexus-emerald text-[11px] font-mono uppercase tracking-wider mb-3.5 shadow-[0_0_15px_rgba(0,255,157,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-nexus-emerald animate-ping"></span>
          <span>'OFFICIAL KEYNOTE FILM • 4K 60FPS PRODUCT TOUR'</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
        >
          See How <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-emerald via-[#00F0FF] to-white">ContractGuard</span> Eliminates Liabilities in 79ms
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-zinc-300 mt-3.5 leading-relaxed"
        >
          Experience the zero-cloud, 5-engine audit studio in motion: 100% client-side RAM execution, instant financial mismatch reconciliation, and one-click court-ready executive memo generation with zero bytes leaving your machine.
        </motion.p>
      </div>

      {/* Cinematic Hardware-Framed Video Container */}
      <div className="relative group max-w-5xl mx-auto">
        
        {/* Ambient Backlight Aura (Apple / Linear Glow) */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-nexus-emerald/30 via-nexus-cyan/20 to-emerald-500/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none"></div>

        {/* Studio Bezel Chassis */}
        <div 
          ref={containerRef}
          className="relative rounded-2xl md:rounded-3xl border border-white/20 bg-[#03070A] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
        >
          
          {/* Top Chassis Telemetry & Chrome Bar */}
          <div className="px-4 py-2.5 bg-[#050B10]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs text-zinc-400 select-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              <span className="ml-2 font-mono text-[11px] text-zinc-300 hidden sm:inline-block">
                ContractGuard™ Launch Film • Master Edition (4K 60FPS)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-nexus-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-nexus-emerald animate-pulse"></span>
                <span>AIR-GAPPED RUNTIME</span>
              </span>
              <span className="font-mono text-[11px] text-zinc-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Video Player Core */}
          <div className="relative aspect-video bg-black cursor-pointer overflow-hidden" onClick={togglePlay}>
            <video
              ref={videoRef}
              src="/videos/contractguard-launch-film.mp4"
              poster="/videos/contractguard-poster.jpg"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />

            {/* Initial Play Floating Overlay (before play or when paused) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 pointer-events-none"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-nexus-emerald/30 rounded-full blur-xl animate-pulse"></div>
                    <button 
                      className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-nexus-emerald/95 text-black flex items-center justify-center shadow-[0_0_40px_rgba(0,255,157,0.6)] hover:scale-105 active:scale-95 transition-transform"
                      aria-label="Play Launch Film"
                    >
                      <Play size={36} className="ml-1 fill-black" />
                    </button>
                  </div>

                  <div className="mt-5 text-center">
                    <p className="text-white font-extrabold text-base md:text-lg tracking-tight drop-shadow-md">
                      Play Official Product Launch Film (48s)
                    </p>
                    <p className="text-xs text-zinc-300 mt-1 font-mono">
                      Full Audio Bed • English Voiceover • High-Tech SFX
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Luxury Custom Controls Overlay */}
            <div 
              className={`absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-30 ${
                showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Interactive Scrubber Timeline */}
              <div 
                className="relative w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer mb-3 transition-all duration-150 group/timeline"
                onClick={handleSeek}
              >
                {/* Buffered / Background line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-nexus-emerald via-[#00F0FF] to-white rounded-full transition-all"
                  style={{ width: `${(currentTime / (duration || 48)) * 100}%` }}
                ></div>
                {/* Scrubber Knob */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_rgba(0,255,157,0.8)] scale-0 group-hover/timeline:scale-100 transition-transform pointer-events-none"
                  style={{ left: `calc(${(currentTime / (duration || 48)) * 100}% - 7px)` }}
                ></div>
              </div>

              {/* Lower Controls Strip */}
              <div className="flex items-center justify-between text-white text-xs">
                
                {/* Left: Play/Pause, Replay, Time, Volume */}
                <div className="flex items-center gap-3 md:gap-4">
                  <button 
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>

                  <button 
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="hidden sm:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 items-center justify-center transition-colors text-zinc-300 hover:text-white"
                    title="Restart from beginning"
                  >
                    <RotateCcw size={14} />
                  </button>

                  {/* Volume & Mute Control */}
                  <div className="flex items-center gap-2 group/vol">
                    <button 
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-zinc-200 hover:text-white"
                      title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-nexus-emerald" />}
                    </button>
                    
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 md:w-20 h-1 accent-nexus-emerald bg-white/20 rounded-lg cursor-pointer transition-opacity"
                    />
                  </div>

                  {/* Time indicator */}
                  <span className="font-mono text-[11px] text-zinc-300">
                    {formatTime(currentTime)} <span className="text-zinc-500">/</span> {formatTime(duration)}
                  </span>
                </div>

                {/* Right: Quality Badge, Speed, Fullscreen */}
                <div className="flex items-center gap-2.5">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-zinc-300">
                    1080p 60FPS
                  </span>

                  <button 
                    onClick={cyclePlaybackRate}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] font-mono font-bold text-zinc-300 hover:text-white transition-colors"
                    title="Playback Speed"
                  >
                    {playbackRate}x
                  </button>

                  <button 
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-zinc-200 hover:text-white"
                    title="Toggle Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Under-Video Value Strip (High-Conversion Anchor: Ad Creative Strategist) */}
          <div className="p-4 md:p-6 bg-[#04080D] border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-nexus-emerald/10 border border-nexus-emerald/20 flex items-center justify-center text-nexus-emerald shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  100% In-RAM Air-Gap
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  ABA Rule 1.6 Privilege
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-nexus-cyan/10 border border-nexus-cyan/20 flex items-center justify-center text-nexus-cyan shrink-0 mt-0.5">
                <Zap size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  5-Engine Audit in ~79ms
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Zero Latency Web Worker
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Sliders size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Dual Mode LCS Diff
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Single Draft + Redline
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                <Lock size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Perpetual License ($199)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Zero Recurring SaaS Fees
                </p>
              </div>
            </div>

          </div>

          {/* Direct High-Impact Conversion Action Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-nexus-emerald/15 via-[#020608] to-cyan-500/15 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-300 text-center sm:text-left">
              <Sparkles size={15} className="text-nexus-emerald shrink-0" />
              <span>
                Ready to audit your active contracts in real-time before execution?
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/demo')}
                className="flex-1 sm:flex-initial bg-nexus-emerald text-black px-5 py-2.5 rounded-xl font-black text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,255,157,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Try Interactive Live Demo</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={() => openSeamlessCheckout({ plan: 'solo' })}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock size={13} className="text-nexus-cyan" />
                <span>Get Perpetual License ($199)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
