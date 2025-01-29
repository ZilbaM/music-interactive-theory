"use client";
import React from "react";
import BaseStep from "../";
import FlickerText from "@/components/UI/FlickerText";

export default function StandardStep({
  completeStep,
  onEnter,
  onExit,
  children,
}) {

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
    </BaseStep>
  );
}
