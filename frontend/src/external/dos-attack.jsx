import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import socket from "../components/socket";
import Tabs from "../components/Tabs";
import IPPanel from "../components/IPPanel";
import TerminalPanel from "../components/TerminalPanel";
import "../style.css";
import "../index.css";

const { Content, Sider, Footer } = Layout;

const API_BASE = "http://localhost:3001";

const DoSExtAttack = () => {
  console.log("Internal : DoS Attack");

  const [targetIP, setTargetIP] = useState("");
  const [commandStr, setCommandStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [commands, setCommands] = useState({});

  const preferredKey = "dosAttack";

  const tabItems = [
    {
      key: "portscan",
      label: "Port Scan",
      category: "External Attacks",
      path: "/external/port-scan",
    },
    {
      key: "bruteforce",
      label: "Brute Force",
      category: "External Attacks",
      path: "/external/brute-force",
    },
    {
      key: "ssh",
      label: "SSH Attack",
      category: "External Attacks",
      path: "/external/ssh-attack",
    },
    {
      key: "dos",
      label: "DoS Attack",
      category: "External Attacks",
      path: "/external/dos-attack",
    },
    {
      key: "malware",
      label: "Malware Attack",
      category: "External Attacks",
      path: "/external/malware-attack",
    },
  ];

  const findKeyIgnoreCase = (obj, wantedKey) => {
    if (!obj) return null;
    const lower = wantedKey.toLowerCase();
    const found = Object.keys(obj).find((k) => k.toLowerCase() === lower);
    return found || null;
  };

  const extractTargetFromCommand = (cmd) => {
    if (!cmd || typeof cmd !== "string") return "";
    const ipv4 = cmd.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    if (ipv4 && ipv4[0]) return ipv4[0];

    const ipv6 = cmd.match(/\b([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\b/);
    if (ipv6 && ipv6[0]) return ipv6[0];

    const hostname = cmd.match(
      /\b([a-zA-Z0-9][a-zA-Z0-9\-.]{1,}\.[a-zA-Z]{2,}|[a-zA-Z0-9\-.]+(?:\.[a-zA-Z0-9\-.]+)?)\b/
    );
    if (hostname && hostname[0] && !hostname[0].startsWith("-"))
      return hostname[0];

    const tokens = cmd.split(/\s+/).filter(Boolean);
    for (let i = tokens.length - 1; i >= 0; i--) {
      const t = tokens[i].trim();
      if (!t.startsWith("-") && t.length > 0) {
        const cleaned = t.replace(/[;|&><()]+$/g, "");
        if (cleaned) return cleaned;
      }
    }

    return "";
  };

  useEffect(() => {
    let mounted = true;

    const loadCommands = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/commands`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        const normalized = {};
        Object.entries(data || {}).forEach(([k, v]) => {
          if (typeof v === "string") {
            normalized[k] = { label: k, command: v };
          } else if (v && typeof v === "object") {
            normalized[k] = {
              label: v.label || k,
              command: v.command !== undefined ? v.command : "",
            };
          } else {
            normalized[k] = { label: k, command: "" };
          }
        });

        setCommands(normalized);

        const keyFound =
          findKeyIgnoreCase(normalized, preferredKey) ||
          Object.keys(normalized)[0];
        const picked = keyFound
          ? normalized[keyFound]
          : {
              command:
                "python3 /home/anuja/MHDDoS/start.py udp http://{target} 1 999 http.txt 999 600 true",
            };

        let template = picked.command;
        if (Array.isArray(template)) {
          template = template.join(" && ");
        } else {
          template = String(template || "");
        }

        const resolved = template.replace(
          /\{target\}|\{targetIP\}/g,
          targetIP || ""
        );
        setCommandStr(resolved);
      } catch (err) {
        console.error("Failed to fetch commands:", err);
        const fallbackTpl =
          "python3 /home/anuja/MHDDoS/start.py udp http://{target} 1 999 http.txt 999 600 true";
        setCommands({
          dosAttack: { label: "DoS Attack", command: fallbackTpl },
        });
        setCommandStr(
          fallbackTpl.replace(/\{target\}|\{targetIP\}/g, targetIP || "")
        );
      }
    };

    loadCommands();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const keyFound =
      findKeyIgnoreCase(commands, preferredKey) || Object.keys(commands)[0];
    const template =
      (keyFound && commands[keyFound] && commands[keyFound].command) ||
      "python3 /home/anuja/MHDDoS/start.py udp http://{target} 1 999 http.txt 999 600 true";

    let tpl = template;
    if (Array.isArray(tpl)) tpl = tpl.join(" && ");

    const resolved = String(tpl).replace(
      /\{target\}|\{targetIP\}/g,
      targetIP || ""
    );
    setCommandStr(resolved);
  }, [targetIP, commands]);

  const handleSelect = (tab) => {
    console.log("Selected tab:", tab);
    if (!tab || !tab.key) return;

    // Send Ctrl+C to terminal before switching
    socket.emit("terminal-cmd", { cmd: "\x03" }); // \x03 is Ctrl+C

    const keyFound = findKeyIgnoreCase(commands, tab.key);
    if (keyFound && commands[keyFound]) {
      let tpl = commands[keyFound].command;
      if (Array.isArray(tpl)) tpl = tpl.join(" && ");
      const resolved = String(tpl).replace(
        /\{target\}|\{targetIP\}/g,
        targetIP || ""
      );
      setCommandStr(resolved);
    }
  };

  const handleDoSAttack = () => {
    if (!commandStr || !commandStr.trim()) {
      const InvalidMessage = `# ❗ Please enter a valid command or target IP.\n`;
      socket.emit("input", InvalidMessage);
      return;
    }

    const extracted = extractTargetFromCommand(commandStr);
    console.log("[DoSExtAttack] extracted target:", extracted);
    if (extracted) setTargetIP(extracted);

    setLoading(true);

    try {
      if (window.sharedTerm) {
        window.sharedTerm.write(`\r\n$ ${commandStr}\r\n`);
      }
      socket.emit(
        "input",
        commandStr + (commandStr.endsWith("\n") ? "" : "\n")
      );
    } catch (err) {
      console.error("Failed to send DoS command:", err);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  console.log("External : DoS Attack");
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider>
          <Sidebar />
        </Sider>
        <Layout>
          <Tabs tabs={tabItems} onSelect={handleSelect} />
          <IPPanel targetIP={targetIP} hostOverride="10.229.40.10:5173" />
          <TerminalPanel />
          <Content style={{ marginTop: "1px" }}>
            <div className="terminal-controls" style={{ marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Enter full command or edit full command"
                value={commandStr}
                onChange={(e) => setCommandStr(e.target.value)}
                style={{
                  marginRight: "8px",
                  padding: "6px 8px",
                  width: "520px",
                }}
              />
              <button
                onClick={handleDoSAttack}
                disabled={loading}
                style={{ padding: "6px 12px" }}
              >
                {loading ? "Running..." : "DoS Attack"}
              </button>
            </div>
            {/* <div style={{ marginBottom: 12 }}>
              <input
                value={targetIP}
                onChange={(e) => setTargetIP(e.target.value)}
                placeholder="Target IP (updates the command above)"
                style={{ padding: "6px 8px", width: 240, marginRight: 12 }}
              />
              <small style={{ color: "#6b7280" }}>
                Edit target and the command will update automatically.
              </small>
            </div> */}
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default DoSExtAttack;
