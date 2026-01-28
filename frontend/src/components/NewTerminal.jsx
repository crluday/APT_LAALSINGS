import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import "../style.css";
import "xterm/css/xterm.css";
import socket from "../components/socket";

// Global cache so we reuse the same terminal & session
let sharedTerm = null;
let initialized = false;

const TerminalPanel = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    // If we already created a terminal, just re-attach it
    if (initialized && sharedTerm && terminalRef.current) {
      terminalRef.current.innerHTML = "";
      sharedTerm.open(terminalRef.current);
      sharedTerm.focus();
      return;
    }

    const term = new XTerm({
      cursorBlink: true,
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
        cursor: "#00ff00",
        selection: "rgba(255,255,255,0.3)",
      },
    });

    term.open(terminalRef.current);
    sharedTerm = term;
    initialized = true;

    // Send data from terminal → backend
    term.onData((data) => socket.emit("input", data));

    // Receive backend data → terminal
    const handleOutput = (data) => term.write(data);
    socket.on("output", handleOutput);

    // Do not dispose terminal when component unmounts
    return () => {
      socket.off("output", handleOutput);
    };
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-title-bar">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span className="title">Active Session</span>
      </div>
      <div ref={terminalRef} className="terminal-content" />
    </div>
  );
};

export default TerminalPanel;
