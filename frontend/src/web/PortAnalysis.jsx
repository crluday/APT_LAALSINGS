import React, { useState, useEffect } from "react";
import { Layout, Card } from "antd";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import TerminalPanel from "../components/TerminalPanel";
import socket from "../components/socket";
import "../web/temp.css";

const { Content, Sider, Footer } = Layout;

export default function PortAnalysis() {
  const [targetURL, setTargetURL] = useState("");

  const command = `nikto -h ${targetURL || "{targetURL}"}`;

  return (
    <Layout style={{ height: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider><Sidebar /></Sider>

        <Content style={{ padding: 16 }}>
          <Card title="Web Server Scan (Nikto)" className="rt-card">
            <div className="rt-controls">
              <input className="rt-input rt-w-xl" placeholder="http://example.com" value={targetURL} onChange={e=>setTargetURL(e.target.value)} />
              <button className="rt-btn run" onClick={()=>socket.emit("input",command+"\n")}>Run Nikto</button>
              <button className="rt-btn kill" onClick={()=>socket.emit("terminal-cmd",{cmd:"\x03"})}>Kill</button>
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
