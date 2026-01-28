import React, { useState, useEffect } from "react";
import { Layout, Card, Tag } from "antd";
import AppHeader from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TerminalPanel from "../../components/TerminalPanel";
import socket from "../../components/socket";
import "../../web/temp.css";

const { Content, Sider, Footer } = Layout;
const ZAP_PROJECT_DIR = "~/Desktop/Simulator/red-team-simulator-2.0.2";

export default function VulnerableComponents() {
  const [targetURL, setTargetURL] = useState("");
  const [commandStr, setCommandStr] = useState("");
  const [zapStatus, setZapStatus] = useState("stopped"); // stopped | starting | running

  // Build zap scan command dynamically
  useEffect(() => {
    setCommandStr(
      `cd ${ZAP_PROJECT_DIR} && source venv/bin/activate && python3 zap.py ${targetURL || "{targetURL}"}`
    );
  }, [targetURL]);

  // Listen to terminal output to infer ZAP status
useEffect(() => {
  // connect explicitly
  if (!socket.connected) {
    socket.connect();
  }

  const handleTerminal = (data) => {
    if (data.includes("Daemon starting")) setZapStatus("starting");

    if (
      data.includes("ZAP is now listening") ||
      data.includes("Listening on") ||
      data.includes("Started OWASP ZAP")
    ) {
      setZapStatus("running");
    }

    if (data.includes("Daemon stopped")) setZapStatus("stopped");
  };

  socket.on("terminal", handleTerminal);

  return () => {
    socket.off("terminal", handleTerminal);

    // 🔥 HARD CLEANUP
    if (socket.connected) {
      socket.disconnect();
    }
  };
}, []);


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />

      <Layout>
        <Sider>
          <Sidebar />
        </Sider>

        <Content style={{ padding: 16 }}>
          <Card
            title="Vulnerable Components Scan (OWASP ZAP)"
            className="rt-card"
          >

            {/* ========================= */}
            {/* STATUS */}
            {/* ========================= */}
            <div style={{ marginBottom: 8 }}>
              ZAP Status:{" "}
              <Tag
                color={
                  zapStatus === "running"
                    ? "green"
                    : zapStatus === "starting"
                    ? "orange"
                    : "red"
                }
              >
                {zapStatus.toUpperCase()}
              </Tag>
            </div>

            {/* ========================= */}
            {/* ZAP DAEMON CONTROLS */}
            {/* ========================= */}
            <div className="rt-controls">

              <button
                className="rt-btn"
                style={{
                  background: "#1677ff",
                  color: "#fff",
                  marginRight: "6px",
                }}
                onClick={() => socket.emit("zap-start")}
                disabled={zapStatus !== "stopped"}
              >
                Start ZAP
              </button>

              <button
                className="rt-btn kill"
                onClick={() => socket.emit("zap-stop")}
                disabled={zapStatus === "stopped"}
              >
                Stop ZAP
              </button>

            </div>

            {/* ========================= */}
            {/* SCAN CONTROLS */}
            {/* ========================= */}
            <div className="rt-controls">

              <input
                className="rt-input rt-w-lg"
                placeholder="Target URL (https://example.com)"
                value={targetURL}
                onChange={(e) => setTargetURL(e.target.value)}
                disabled={zapStatus !== "running"}
              />

              <button
                className="rt-btn run"
                disabled={!targetURL || zapStatus !== "running"}
                onClick={() => socket.emit("input", commandStr + "\n")}
              >
                Run Scan
              </button>

              <button
                className="rt-btn kill"
                onClick={() =>
                  socket.emit("terminal-cmd", { cmd: "\x03" })
                }
              >
                Kill Scan
              </button>

            </div>

            {/* ========================= */}
            {/* TERMINAL */}
            {/* ========================= */}
            <div className="rt-terminal-frame">
              <div className="rt-terminal-inner">
                <TerminalPanel />
              </div>
            </div>

          </Card>
        </Content>
      </Layout>

      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>
    </Layout>
  );
}
