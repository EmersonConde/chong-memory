"use client";
import Button from "@/components/atoms/button"
import Game from "@/components/templates/play/play"
import Multigame from "@/components/templates/multiplayer/multiplayer";
import { useEffect, useRef, useState } from "react";
export const Play = () => {
  const [mode, setMode] = useState(<Play/>);
  let onegame = () => {
    setMode(<Game/>)
  }
  let twogame = () => {
    setMode(<Multigame/>)
  }
  return (
    <div className="grid h-screen place-items-center">
      <div className="grid h-[300px]">
        <div onClick={onegame}><Button label="Play"/></div>
        <div onClick={twogame}><Button label="Multiplayer"/></div>
      </div>
    </div>
  )
}
export default Play