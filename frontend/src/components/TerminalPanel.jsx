import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import "../style.css";
import socket from "../components/socket";

let sharedTerm = null;
let isInitialized = false;

const TerminalPanel = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isInitialized && sharedTerm) {
      containerRef.current.innerHTML = "";
      sharedTerm.open(containerRef.current);
      sharedTerm.focus();

      if (!socket.hasListeners("output")) {
        socket.on("output", (data) => sharedTerm.write(data));
      }

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
      convertEol: true,
      allowProposedApi: true,
    });

    term.open(containerRef.current);
    term.focus();

    sharedTerm = term;
    isInitialized = true;

    const handleData = (data) => socket.emit("input", data);
    const handleOutput = (data) => term.write(data);

    term.onData(handleData);
    socket.on("output", handleOutput);

    socket.on("disconnect", () => {
      term.write("\r\n\x1b[31m[Disconnected from server]\x1b[0m\r\n");
    });

    return () => {
      socket.off("output", handleOutput);
    };
  }, []);

  useEffect(() => {
    const div = containerRef.current;
    if (!div || !sharedTerm) return;
    const handleClick = () => sharedTerm.focus();
    div.addEventListener("click", handleClick);
    return () => div.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-title-bar">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span className="title">Active Terminal</span>
      </div>
      <div ref={containerRef} className="terminal-content" />
    </div>
  );
};

export default TerminalPanel;
