"use client";
import { useEffect, useRef, useState } from "react";

export default function Game() {
  const canvasRef = useRef(null);

  const [ball, setBall] = useState({ x: 200, y: 200, dx: 3, dy: 2, r: 5, color: "White" });
  const [paddles, setPaddles] = useState([
    { x: 20, y: 160, w: 10, h: 80, dy: 0 }, // left player
    { x: 370, y: 160, w: 10, h: 80, dy: 0 }, // bot
  ]);
  const [wall, setWall] = useState([
    { x: 0, y: 0, w: 400, h: 5}, // top
    { x: 0, y: 395, w: 400, h: 5}, // bottom
  ]);

  // score state
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [FinalScore, setFinalScore] = useState<number | null>(null); // stores player - bot at the end

  // key controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "w") setPaddles((prev) => [{ ...prev[0], dy: -5 }, prev[1]]);
      if (e.key === "s") setPaddles((prev) => [{ ...prev[0], dy: 5 }, prev[1]]);
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (["w", "s"].includes(e.key)) setPaddles((prev) => [{ ...prev[0], dy: 0 }, prev[1]]);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      // clear canvas
      ctx.fillStyle = "Black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw paddles
      ctx.fillStyle = "Purple";
      paddles.forEach((p) => ctx.fillRect(p.x, p.y, p.w, p.h));

      // draw walls
      ctx.fillStyle = "White";
      wall.forEach((p) => ctx.fillRect(p.x, p.y, p.w, p.h));

      // draw ball
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      // draw score
      ctx.fillStyle = "White";
      ctx.font = "16px Arial";
      ctx.fillText(`Player: ${score.player}`, 10, 20);
      ctx.fillText(`Bot: ${score.bot}`, 320, 20);

      // move paddles
      let newPaddles = paddles.map((p) => {
        let newY = p.y + p.dy;
        if (newY < 0) newY = 0;
        if (newY + p.h > canvas.height) newY = canvas.height - p.h;
        return { ...p, y: newY };
      });

      // update ball position
      let { x, y, dx, dy, r } = ball;
      x += dx;
      y += dy;

      // collision with top/bottom walls
      if (y - r < 0 || y + r > canvas.height) {
        dy = -dy;
        ball.color = "purple";
        setTimeout(() => {
          setBall((prev) => ({ ...prev, color: "white" }));
        }, 200);
      }

      // collision with paddles
      newPaddles.forEach((p) => {
        if (
          x - r < p.x + p.w &&
          x + r > p.x &&
          y > p.y &&
          y < p.y + p.h
        ) {
          dx = -dx;
        }
      });

      // simple bot AI
      const bot = newPaddles[1];
      const speed = 1.5;
      if (ball.y < bot.y + bot.h / 2) bot.y -= speed;
      if (ball.y > bot.y + bot.h / 2) bot.y += speed;
      if (bot.y < 0) bot.y = 0;
      if (bot.y + bot.h > canvas.height) bot.y = canvas.height - bot.h;
      newPaddles[1] = bot;

      // ball out of screen -> update score
      if (x - r < 0) {
        // player missed -> bot scores
        setScore((prev) => ({ ...prev, bot: prev.bot + 1 }));
        x = canvas.width / 2;
        y = canvas.height / 2;
        dx = 3;
        dy = 2;
      } else if (x + r > canvas.width) {
        // bot missed -> player scores
        setScore((prev) => ({ ...prev, player: prev.player + 1 }));
        x = canvas.width / 2;
        y = canvas.height / 2;
        dx = -3;
        dy = 2;
      }

      if (score.player >= 1 || score.bot >= 1) {
        setFinalScore(score.player - score.bot);
        clearInterval(interval);

      }

      setPaddles(newPaddles);
      setBall({ x, y, dx, dy, r, color: ball.color });
    }

    const interval = setInterval(draw, 16);
    return () => clearInterval(interval);
  }, [ball, paddles, score]);

  return (
    <div className="flex flex-col justify-center min-h-[450px] bg-black">
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  );
}