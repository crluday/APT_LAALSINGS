import React, { useState, useEffect } from "react";
import { Layout, Card } from "antd";
import AppHeader from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TerminalPanel from "../../components/TerminalPanel";
import socket from "../../components/socket";
import "../../web/temp.css";
const { Content, Sider, Footer } = Layout;
const SQLMAP_DIR = "~/Downloads/sqlmap-1.9.12/sqlmap";

export default function Injection() {
  const [targetURL, setTargetURL] = useState("");
  const [crawl, setCrawl] = useState("1");
  const [level, setLevel] = useState("1");
  const [risk, setRisk] = useState("1");
  const [commandStr, setCommandStr] = useState("");

  useEffect(() => {
    setCommandStr(
      `cd ${SQLMAP_DIR} && python3 sqlmap.py -u ${targetURL || "{targetURL}"} --crawl=${crawl} --level=${level} --risk=${risk} --batch`
    );
  }, [targetURL, crawl, level, risk]);

return (
  <Layout style={{ minHeight: "100vh" }}>
    <AppHeader />

    <Layout>
      <Sider><Sidebar /></Sider>

        <Content style={{ padding: 16 }}>
          <Card title="SQL Injection Testing (SQLMap)" className="rt-card">
            <div className="rt-controls">
              <input
                className="rt-input rt-w-lg"
                placeholder="Target URL"
                value={targetURL}
                onChange={(e) => setTargetURL(e.target.value)}
              />

              <input
                className="rt-input rt-w-sm"
                type="number"
                min="1"
                max="100"
                value={crawl}
                onChange={(e) => setCrawl(e.target.value)}
              />

              <select
                className="rt-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
              </select>

              <select
                className="rt-select"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option value="1">Risk 1</option>
                <option value="2">Risk 2</option>
                <option value="3">Risk 3</option>
              </select>

              <button
                className="rt-btn run"
                onClick={() => socket.emit("input", commandStr + "\n")}
              >
                Run
              </button>

              <button
                className="rt-btn kill"
                onClick={() =>
                  socket.emit("terminal-cmd", { cmd: "\x03" })
                }
              >
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
