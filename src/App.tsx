import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center justify-center p-4 relative selection:bg-fuchsia-500 selection:text-black">
      {/* CRT Overlays */}
      <div className="scanlines"></div>
      <div className="static-noise"></div>

      <header className="mb-8 text-center z-10 w-full max-w-5xl border-b-4 border-fuchsia-500 pb-4 tear-effect">
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-widest text-white glitch" 
          data-text="SNAKE_PROTOCOL.EXE"
        >
          SNAKE_PROTOCOL.EXE
        </h1>
        <div className="flex justify-between items-center mt-2 text-fuchsia-500 text-lg md:text-xl">
          <span>// SYS.STATUS: OVERRIDE_ACTIVE</span>
          <span className="animate-pulse">_TERMINAL_READY</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start z-10 w-full max-w-5xl justify-between">
        {/* Game Section */}
        <div className="flex flex-col items-start w-full lg:w-auto">
          <div className="flex justify-between w-full mb-2 border-b-2 border-cyan-400 pb-1">
            <div className="text-2xl text-cyan-400 tracking-widest">
              DATA_COLLECTED: <span className="text-fuchsia-500">{score.toString().padStart(4, '0')}</span>
            </div>
            <div className="text-2xl text-cyan-400 animate-pulse">
              [REC]
            </div>
          </div>
          <div className="p-1 bg-black border-4 border-fuchsia-500 shadow-[4px_4px_0px_#0ff] relative">
            <SnakeGame onScoreChange={setScore} />
            <div className="absolute -top-3 -right-3 bg-black text-fuchsia-500 px-1 border border-fuchsia-500 text-sm">
              v1.0.9
            </div>
          </div>
          <p className="mt-4 text-cyan-400 text-lg tracking-widest">
            &gt; INPUT_REQ: [W,A,S,D] OR [ARROWS]
          </p>
        </div>

        {/* Music Player Section */}
        <div className="flex flex-col gap-8 w-full lg:w-96 tear-effect" style={{ animationDelay: '1s' }}>
          <MusicPlayer />
          
          {/* Cryptic Terminal Output */}
          <div className="flex flex-col gap-1 p-4 border-2 border-cyan-400 bg-black text-cyan-400 shadow-[4px_4px_0px_#f0f]">
             <div className="border-b border-cyan-400 pb-1 mb-2">
               <span className="text-fuchsia-500">root@neon-core:~#</span> ./status_check
             </div>
             <div className="flex items-center gap-2">
               <span className="text-fuchsia-500">[OK]</span>
               <span>NEURAL_LINK_ESTABLISHED</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-fuchsia-500">[OK]</span>
               <span>AUDIO_SUBSYSTEM_SYNCED</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-fuchsia-500">[OK]</span>
               <span>MEMORY_ALLOCATION: 0x0F4A</span>
             </div>
             <div className="flex items-center gap-2 mt-2 animate-pulse">
               <span className="text-white">&gt; AWAITING_COMMAND_</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
