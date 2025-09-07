"use client";
import { useEffect, useRef, useState } from "react";

export default function Multigame() {
  const canvasRef = useRef(null);

  const [ball, setBall] = useState({ x: 200, y: 200, dx: 3, dy: 2, r: 5, color: "White"});
  const [paddles, setPaddles] = useState([
    { x: 20, y: 160, w: 10, h: 80, dy: 0 }, // esquerda
    { x: 370, y: 160, w: 10, h: 80, dy: 0 }, // direita
  ]);
  const [wall, setWall] = useState([
    { x: 0, y: 0, w: 400, h: 5}, // left
    { x: 0, y: 395, w: 400, h: 5}, // right
  ]);

  // captura de teclas
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "w") setPaddles((prev) => [{ ...prev[0], dy: -5 }, prev[1]]);
      if (e.key === "s") setPaddles((prev) => [{ ...prev[0], dy: 5 }, prev[1]]);
      if (e.key === "ArrowUp") setPaddles((prev) => [prev[0], { ...prev[1], dy: -5 }]);
      if (e.key === "ArrowDown") setPaddles((prev) => [prev[0], { ...prev[1], dy: 5 }]);
    }
    function handleKeyUp(e) {
      if (["w", "s"].includes(e.key)) setPaddles((prev) => [{ ...prev[0], dy: 0 }, prev[1]]);
      if (["ArrowUp", "ArrowDown"].includes(e.key)) setPaddles((prev) => [prev[0], { ...prev[1], dy: 0 }]);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      ctx.fillStyle = "Black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // desenhar barras
      ctx.fillStyle = "Purple";
      paddles.forEach((p) => ctx.fillRect(p.x, p.y, p.w, p.h));

      //draw wall
      ctx.fillStyle = "White";
      wall.forEach((p) => ctx.fillRect(p.x, p.y, p.w, p.h));

      // desenhar bola
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();

      // mover barras
      let newPaddles = paddles.map((p) => {
        let newY = p.y + p.dy;
        if (newY < 0) newY = 0;
        if (newY + p.h > canvas.height) newY = canvas.height - p.h;
        return { ...p, y: newY };
      });

      // atualizar posição da bola
      let { x, y, dx, dy, r } = ball;
      x += dx;
      y += dy;

      // colisão com bordas superior/inferior
      if (y - r < 0 || y + r > canvas.height) {
        dy = -dy;
        ball.color = "purple";
        setTimeout(() => {
        setBall((prev) => ({ ...prev, color: "white" }));
        }, 200);
      }

      // colisão com paddles
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

      // reset se a bola sair da tela
      if (x - r < 0 || x + r > canvas.width) {
        x = canvas.width / 2;
        y = canvas.height / 2;
        dx = -dx;
      }

      setPaddles(newPaddles);
      setBall({ x, y, dx, dy, r, color: ball.color});
    }

    const interval = setInterval(draw, 16); // ~60fps
    return () => clearInterval(interval);
  }, [ball, paddles]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  );
}