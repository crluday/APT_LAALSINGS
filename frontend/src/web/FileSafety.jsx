import React from "react";
import { Layout, Card, Alert } from "antd";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content, Sider, Footer } = Layout;

export default function FileSafety() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider><Sidebar /></Sider>
        <Layout>
          <Content style={{ padding: 20 }}>
            <Card title="File Upload Safety">
              <Alert
                message="Simulation Output"
                description="Executable file uploads allowed."
                type="error"
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer"> ©2025 Central Research Laboratory. All rights reserved.</Footer>
    </Layout>
  );
}
