import React from "react";
import { Layout, Card, Alert } from "antd";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content, Sider, Footer } = Layout;

export default function AuthStrength() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider><Sidebar /></Sider>
        <Layout>
          <Content style={{ padding: 20 }}>
            <Card title="Authentication Strength Analysis">
              <Alert
                message="Simulation Output"
                description="Weak password policy detected (no MFA)."
                type="warning"
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer"> ©2025 Central Research Laboratory. All rights reserved.</Footer>
    </Layout>
  );
}
