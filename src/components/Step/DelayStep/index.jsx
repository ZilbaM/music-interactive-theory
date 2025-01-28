"use client";
import React, { useEffect } from "react";
import BaseStep from "../";
import { Timeout } from "../stepHelpers";

export default function DelayStep({
  completeStep,
  onEnter,
  onExit,
  children,
  delay = 2000, // Duration in milliseconds
}) {
  const [timer, setTimer] = React.useState(null);

  useEffect(() => {
    const timeout = new Timeout(() => completeStep(), delay, setTimer);
    timeout.start();
    
    return () => {
      if (timeout) {
        timeout.stop();
      }
    };
  }, [completeStep, delay]);

  useEffect(() => {
    if (timer & timer % 1000 === 0) {
      console.log("Timer updated:", timer);
    }
  }, [timer]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      <div className="flex flex-col items-center w-full h-full">
        <div className="w-full bg-gray-400 h-4 rounded-lg overflow-hidden">
          <div
            className="h-full bg-blue-400"
            style={{ width: `${(timer / delay) * 100}%` }}
          ></div>
        </div>
        {children}
      </div>
    </BaseStep>
  );
}
