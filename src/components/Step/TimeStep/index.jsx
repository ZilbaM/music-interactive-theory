'use client'
import React, { useEffect } from 'react';
import BaseStep from '../';

export default function TimeStep({
  completeStep,
  onEnter,
  onExit,
  children,
  delay = 2000, // Duration in milliseconds
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      completeStep();
    }, delay);

    return () => {
      clearTimeout(timer);
      if (onExit) onExit();
    };
  }, [delay, completeStep, onExit]);

  return <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>{children}</BaseStep>;
}
