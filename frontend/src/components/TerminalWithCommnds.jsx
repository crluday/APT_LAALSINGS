import React, { useRef } from "react";
import TerminalPanel from "./TerminalPanel";
import CommandSelector from "./CommandSelector";

export default function TerminalWithCommands() {
  const terminalRef = useRef(null);

  const handleCommandSelect = (cmd) => {
    terminalRef.current?.writeToTerminal(cmd);
  };

  return (
    <div style={{ padding: 12 }}>
      <CommandSelector onCommandSelect={handleCommandSelect} />
      <TerminalPanel ref={terminalRef} />
    </div>
  );
}
