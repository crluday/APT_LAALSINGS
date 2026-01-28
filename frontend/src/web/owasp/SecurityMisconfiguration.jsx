import React from "react";
import { Layout, Card, Alert } from "antd";
import AppHeader from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const { Content, Sider, Footer } = Layout;

export default function SecurityMisconfiguration() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider><Sidebar /></Sider>
        <Layout>
          <Content style={{ padding: 20 }}>
            <Card title="A05 – Security Misconfiguration">
              <Alert
                message="Simulation Output"
                description="Configuration settings reviewed. No risky defaults detected."
                type="info"
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>
    </Layout>
  );
}

