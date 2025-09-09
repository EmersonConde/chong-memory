"use client";
import { useEffect, useRef, useState } from "react"
import Button from "@/components/atoms/button"
export default function NavButtonsOff () {
      const [mode, setMode] = useState("buttons");
    
      const backmenu = () => {
        setMode("back");
      };
    return (
        <div>
            {mode === "buttons" && (
                <div>
                    <div onClick={backmenu}>
                        <Button className="bg-[#6C30D3] before:bg-[#3d324e]" label="Back"/>
                    </div>
                </div>
            )}
        </div>
    )
}