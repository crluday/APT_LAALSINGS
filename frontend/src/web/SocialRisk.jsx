import React, { useState, useEffect } from "react";
import { Layout, Card } from "antd";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import TerminalPanel from "../components/TerminalPanel";
import socket from "../components/socket";

const { Content, Sider, Footer } = Layout;
const NUCLEI_BIN = "./nuclei";

export default function SocialRisk() {
  const [targetURL, setTargetURL] = useState("");
  const [commandStr, setCommandStr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCommandStr(
      `${NUCLEI_BIN} -u ${targetURL || "{targetURL}"} -severity low,medium,high,critical -tags cve,misconfig,exposure,rce,sqli,xss,takeover -rate-limit 300 -timeout 10`
    );
  }, [targetURL]);

  const run = () => {
    if (!targetURL) return socket.emit("input", "# ❗ Enter target URL\n");
    setLoading(true);
    window.sharedTerm?.write(`\r\n$ ${commandStr}\r\n`);
    socket.emit("input", commandStr + "\n");
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider><Sidebar /></Sider>

        <Content style={{ padding: 16, display: "flex" }}>
          <Card title="Exposure & Misconfiguration Scan (Nuclei)" className="rt-card">
            <div className="rt-controls">
              <input
                className="rt-input rt-w-lg"
                placeholder="http://192.168.0.104:3000"
                value={targetURL}
                onChange={(e) => setTargetURL(e.target.value)}
              />
              <button className="rt-btn run" onClick={run} disabled={loading}>
                {loading ? "Scanning..." : "Run Nuclei"}
              </button>
              <button className="rt-btn kill" onClick={() => socket.emit("terminal-cmd",{cmd:"\x03"})}>
                Kill
              </button>
            </div>

            <div className="rt-terminal-frame">
              <div className="rt-terminal-inner">
                <TerminalPanel />
              </div>
            </div>
          </Card>
        </Content>
      </Layout>
      <Footer className="footer">©2025 Central Research Laboratory. All rights reserved.</Footer>
    </Layout>
  );
}
