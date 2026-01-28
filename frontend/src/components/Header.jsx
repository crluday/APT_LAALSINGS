import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth";
import logo from "../assets/logo.png";

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();        // 🔐 Clear auth
    navigate("/");   // 🔁 Back to login
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#000",
        padding: "0 20px",
      }}
    >
      {/* Left: Logo */}
      <img src={logo} alt="Logo" height={60} style={{ margin: "15px" }} />

      {/* Center: Title */}
      <h2 style={{ color: "red", fontSize: "24px", margin: 0 }}>
        Red Team Attacking Tool
      </h2>

      {/* Right: Logout */}
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Header>
  );
}
