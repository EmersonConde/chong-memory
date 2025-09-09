"use client";
import Button from "@/components/atoms/button";
import Game from "@/components/templates/play/play";
import { useState } from "react";

export const Play = () => {
  const [mode, setMode] = useState("menu");

  const onegame = () => {
    setMode("single");
  };

  return (
    <div className="grid h-screen place-items-center">
      {mode === "menu" && (
        <div onClick={onegame}>
          <Button
            className="bg-[#6C30D3] before:bg-[#3d324e]"
            label="Play"
          />
        </div>
      )}

      {mode === "single" && (
        <div className="flex flex-col items-center gapsw-4">
          <Game />
          <div onClick={() => setMode("menu")}>
            <Button
              className="bg-red-600 before:bg-red-900"
              label="End Game"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;

