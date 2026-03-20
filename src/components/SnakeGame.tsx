import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const TILE_COUNT = 20;
const CANVAS_SIZE = 400;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);

  const snake = useRef<Point[]>([{ x: 10, y: 10 }]);
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const food = useRef<Point>({ x: 15, y: 15 });
  const lastRenderTime = useRef<number>(0);
  const scoreRef = useRef(0);
  const SNAKE_SPEED = 12;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (velocity.current.y === 1) break;
          velocity.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (velocity.current.y === -1) break;
          velocity.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (velocity.current.x === 1) break;
          velocity.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (velocity.current.x === -1) break;
          velocity.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      if (gameOverRef.current) return;

      const head = { ...snake.current[0] };
      head.x += velocity.current.x;
      head.y += velocity.current.y;

      // Wall collision
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        setGameOver(true);
        gameOverRef.current = true;
        return;
      }

      // Self collision
      for (let i = 0; i < snake.current.length; i++) {
        if (head.x === snake.current[i].x && head.y === snake.current[i].y) {
          if (velocity.current.x !== 0 || velocity.current.y !== 0) {
              setGameOver(true);
              gameOverRef.current = true;
              return;
          }
        }
      }

      snake.current.unshift(head);

      // Food collision
      if (head.x === food.current.x && head.y === food.current.y) {
        scoreRef.current += 10;
        onScoreChange(scoreRef.current);
        
        food.current = {
          x: Math.floor(Math.random() * TILE_COUNT),
          y: Math.floor(Math.random() * TILE_COUNT)
        };
      } else {
        snake.current.pop();
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid
      ctx.strokeStyle = '#220022';
      ctx.lineWidth = 1;
      for (let i = 0; i < TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#ff00ff'; // Magenta
      ctx.fillRect(food.current.x * GRID_SIZE, food.current.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

      // Draw snake
      snake.current.forEach((segment, index) => {
        if (index === 0) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#00ffff'; // Cyan
        }
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
      });
    };

    const gameLoop = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);
      
      const secondsSinceLastRender = (currentTime - lastRenderTime.current) / 1000;
      if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;
      
      lastRenderTime.current = currentTime;
      
      update();
      draw();
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onScoreChange]);

  const restartGame = () => {
    snake.current = [{ x: 10, y: 10 }];
    velocity.current = { x: 0, y: 0 };
    scoreRef.current = 0;
    onScoreChange(0);
    setGameOver(false);
    gameOverRef.current = false;
  };

  return (
    <div className="relative w-[400px] h-[400px]">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full h-full bg-black"
      />
      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-4 border-fuchsia-500">
          <h2 
            className="text-5xl font-bold text-white mb-4 glitch"
            data-text="FATAL_ERROR"
          >
            FATAL_ERROR
          </h2>
          <p className="text-fuchsia-500 mb-8 tracking-widest animate-pulse">SYSTEM_HALT</p>
          <button 
            onClick={restartGame}
            className="px-6 py-3 bg-cyan-400 text-black font-bold uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-colors"
          >
            [ REBOOT_SEQUENCE ]
          </button>
        </div>
      )}
    </div>
  );
}
