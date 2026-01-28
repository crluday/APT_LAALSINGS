import React, { useState } from "react";
import {
  SettingOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import socket from "../components/socket";

const items = [
  { key: "about", icon: <MailOutlined />, label: "About" },
  { key: "/dashboard", icon: <DesktopOutlined />, label: "Dashboard" },
  {
    key: "sub1",
    icon: <PieChartOutlined />,
    label: "External Attacks",
    children: [
      { key: "/external/port-scan", label: "Port Scan" },
      { key: "/external/brute-force", label: "Brute Force" },
      { key: "/external/ssh-attack", label: "SSH Attack" },
      { key: "/external/dos-attack", label: "DoS Attack" },
      { key: "/external/malware-attack", label: "Malware Attack" },
    ],
  },
  {
    key: "sub2",
    icon: <ContainerOutlined />,
    label: "Internal Attacks",
    children: [
      { key: "/internal/phishing", label: "Phishing" },
      { key: "/internal/data-exploitation", label: "Data Exploitation" },
      { key: "/internal/lateral-movement", label: "Lateral Movement" },
      { key: "/internal/dos-attack", label: "DoS Attack" },
    ],
  },
  {
    key: "sub3",
    label: "APT Attacks",
    icon: <BarChartOutlined />,
    children: [
      { key: "/apt/port-scans", label: "Port Scan" },
      { key: "/apt/brute-forces", label: "Brute Force" },
      { key: "/apt/ssh-attacks", label: "SSH Attack" },
      { key: "/apt/dos-attacks", label: "DoS Attack" },
      { key: "/apt/malware-attacks", label: "Malware Attack" },
      { key: "/apt/phishing-attacks", label: "Phishing" },
      { key: "/apt/data-exploitations", label: "Data Exploitation" },
      { key: "/apt/lateral-movements", label: "Lateral Movement" },
    ],
  },
  {
    key: "sub4",
    icon: <ContainerOutlined />,
    label: "Generate APT 36",
    children: [
      {
        key: "/apt/windows",
        label: "Windows",
        children: [
          { key: "/windows/executable", label: "Executable" },
          { key: "/windows/powershell", label: "PowerShell" },
          { key: "/windows/installer", label: "Installer" },
          { key: "/windows/bat", label: "Bat" },
          { key: "/windows/vbs", label: "VBS" },
          { key: "/windows/py", label: "Py" },
        ],
      },
      {
        key: "/apt/linux",
        label: "Linux",
        children: [
          { key: "/linux/elf", label: "Elf" },
          { key: "/linux/sh", label: "Sh" },
          { key: "/linux/py", label: "Py" },
        ],
      },
      {
        key: "/apt/android",
        label: "Android",
        children: [
          { key: "/android/exe", label: "Android1" },
          { key: "/android/powershell", label: "Android2" },
          { key: "/android/installer", label: "Android3" },
        ],
      },
      { key: "/apt/handler", label: "Handler" },
      { key: "/apt/phishing", label: "Phishing" },
    ],
  },
{
  key: "sub5",
  label: "Web Security Simulations",
  icon: <ContainerOutlined />,
children: [
  {
    key: "owasp-top-10",
    label: "OWASP TOP 10",
    children: [
      {key: "/web/owasp/access-control", label: "A01: Broken Access Control"},
      {key: "/web/owasp/crypto-failures",label: "A02: Cryptographic Failures"},
      {key: "/web/owasp/injection",label: "A03: Injection"},
      {key: "/web/owasp/insecure-design",label: "A04: Insecure Design"},
      {key: "/web/owasp/security-misconfig",label: "A05: Security Misconfiguration"},
      {key: "/web/owasp/vulnerable-components",label: "A06: Vulnerable Components"},
      {key: "/web/owasp/auth-failures",label: "A07: Authentication Failures"},
      {key: "/web/owasp/integrity-failures",label: "A08: Software & Data Integrity Failures",},
      {key: "/web/owasp/logging-failures",label: "A09: Logging & Monitoring Failures"},
      {key: "/web/owasp/ssrf",label: "A10: Server-Side Request Forgery (SSRF)"},
    ],
  },
{ key: "/web/port-analysis", label: "Web Analysis" },
    { key: "/web/auth-strength", label: "Authentication Strength Test" },
    { key: "/web/XSS", label: "XSS" },
    { key: "/web/rate-limit", label: "Traffic & Rate Limiting Test" },
    { key: "/web/file-safety", label: "File Handling Safety Check" },
    { key: "/web/social-risk", label: "CVE Scanning" },
    { key: "/web/data-access", label: "Data Access Control Review" },
    { key: "/web/accesspaths", label: "Privilege & Access Path Analysis" },

  ],
},
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
  { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
];


const Sidebar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarState")) || [];
  });

  const navigate = useNavigate();

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
    localStorage.setItem("sidebarState", JSON.stringify(keys));
  };

  const handleMenuClick = (e) => {
    if (e.key === "about") {
      setIsModalVisible(true);
    } else if (e.key === "logout") {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        socket.emit("close-session", sessionId);
        localStorage.removeItem("sessionId");
      }
      navigate("/");
    } else {
      navigate(e.key);
    }
  };

  return (
    <>
      <div style={{ width: 200 }}>
        <Menu
          onClick={handleMenuClick}
          mode="inline"
          theme="dark"
          items={items}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
        />
        <Modal
          title=""
          open={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
          width={1200}
        >
          <h1 style={{ textAlign: "center" }}>
            <b>Welcome to the APT CRL ToolKit</b>
          </h1>
          <p>
            This web application is a GUI simulations of cyber-attacks allow
            organizations to test their security defenses by mimicking
            real-world attack scenarios in a controlled environment. These
            simulations help identify vulnerabilities, improve incident
            response, and train cybersecurity professionals. Common attack types
            simulated include network infiltration, endpoint attacks, web
            application attacks, email infiltration, data ex-filtration, lateral
            movement, and cloud attacks.
          </p>
          <h3>Benefits of GUI Simulations:</h3>
          <ul>
            <li>
              <b>Vulnerability Assessment:</b> Identify weaknesses in systems
              and applications.
            </li>
            <li>
              <b>Security Training:</b> Provides hands-on experience for
              cybersecurity professionals.
            </li>
            <li>
              <b>Incident Response:</b> Develop and test incident response
              plans.
            </li>
            <li>
              <b>Security Posture Validation:</b> Assess the effectiveness of
              security controls.
            </li>
            <li>
              <b>Threat Intelligence:</b> Gain insights into attacker tactics,
              techniques, and procedures (TTPs).
            </li>
            <li>
              <b>Compliance:</b> Help meet regulatory requirements for security
              testing.
            </li>
            <li>
              <b>Cost-Effective:</b> Reduce the cost of security testing
              compared to traditional methods.
            </li>
          </ul>
          <h3>💻 Types of Cyber-attack Simulations:</h3>
          <ul>
            <li>
              <b>Port Scan:</b> A port scan is a technique used to identify
              which ports on a network device are open and accepting
              connections.
            </li>
            <li>
              <b>Brute Force Attack:</b> A Brute Force attack attempts to guess
              login credentials by trying multiple combinations of usernames and
              passwords.
            </li>
            <li>
              <b>SSH Attack:</b> A malicious activity targeting the SSH (Secure
              Shell) protocol, which is widely used for secure remote login and
              management of servers.
            </li>
            <li>
              <b>DoS Attack:</b> An attempt to overload a website or network,
              with the aim of degrading its performance or even making it
              completely inaccessible.
            </li>
            <li>
              <b>Malware Attack:</b> involve the deployment of malicious
              software to infiltrate computer systems and networks with the goal
              of causing harm, disrupting operations, or gaining unauthorized
              access.
            </li>
          </ul>
        </Modal>
      </div>
    </>
  );
};

export default Sidebar;
