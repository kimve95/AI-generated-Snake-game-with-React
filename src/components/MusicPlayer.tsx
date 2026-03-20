import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'NEON_DREAMS_AI_MIX.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CYBERNETIC_PULSE.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'SYNTHWAVE_PROTOCOL.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-black border-4 border-cyan-400 p-4 w-full max-w-sm shadow-[4px_4px_0px_#f0f] relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-4 border-b-2 border-fuchsia-500 pb-2">
        <span className="text-fuchsia-500 font-bold animate-pulse">&gt;</span>
        <h2 className="text-cyan-400 font-mono text-lg tracking-widest">AUDIO_STREAM_ACTIVE</h2>
      </div>
      
      <div className="mb-6">
        <div className="text-xl font-bold text-white truncate glitch" data-text={currentTrack.title}>
          {currentTrack.title}
        </div>
        <div className="text-fuchsia-500 text-sm font-mono mt-1 tracking-widest">
          [ AI_GENERATED_WAVEFORMS ]
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Progress Bar */}
      <div 
        className="h-4 bg-black border-2 border-cyan-400 mb-6 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-fuchsia-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
        {/* Decorative scanline on progress bar */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:4px_100%] pointer-events-none"></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={prevTrack} className="text-cyan-400 hover:text-white hover:bg-fuchsia-500 px-2 py-1 transition-colors border border-transparent hover:border-white">
          [ &lt;&lt; ]
        </button>
        <button 
          onClick={togglePlay} 
          className="text-black bg-cyan-400 hover:bg-fuchsia-500 hover:text-white px-4 py-2 font-bold tracking-widest transition-colors border-2 border-transparent hover:border-white"
        >
          {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
        </button>
        <button onClick={nextTrack} className="text-cyan-400 hover:text-white hover:bg-fuchsia-500 px-2 py-1 transition-colors border border-transparent hover:border-white">
          [ &gt;&gt; ]
        </button>
      </div>

      <div className="flex items-center gap-3 border-t-2 border-cyan-400 pt-4">
        <span className="text-fuchsia-500 tracking-widest">VOL:</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-black border border-cyan-400 appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>
    </div>
  );
}
