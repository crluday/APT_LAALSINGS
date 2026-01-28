import React from "react";
import { Card, Layout, Row, Col } from "antd";
import AppHeader from "./Header";
import Sidebar from "./Sidebar";
import "../style.css";

const { Content, Sider, Footer } = Layout;

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* 🔴 Top Header */}
      <AppHeader />

      {/* 🔴 Main Layout */}
      <Layout>
        
        {/* Sidebar */}
        <Sider width={220}>
          <Sidebar />
        </Sider>

        {/* Main Content */}
        <Content style={{ padding: "20px" }}>
          
          <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
            Welcome to the secure RED TEAM dashboard for penetration testing.
          </h3>

          {/* Cards Grid */}
          <Row gutter={16} justify="center">
            
            <Col span={8}>
              <Card title="External Attacks">
                <p>Run external network penetration testing commands</p>
                <ol>
                  <li>Port Scan</li>
                  <li>Brute Force</li>
                  <li>SSH Attack</li>
                  <li>DoS Attack</li>
                  <li>Malware Attack</li>
                </ol>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Internal Attacks">
                <p>Run internal network penetration testing commands</p>
                <ol>
                  <li>Phishing Attack</li>
                  <li>Data Exploitation</li>
                  <li>Lateral Movement</li>
                  <li>DoS Attack</li>
                </ol>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="APT Attacks">
                <p>Run advanced persistent threat simulations</p>
                <ol>
                  <li>Port Scan</li>
                  <li>Brute Force</li>
                  <li>SSH Attack</li>
                  <li>DoS Attack</li>
                  <li>Malware Attack</li>
                  <li>Phishing Attack</li>
                  <li>Data Exploitation</li>
                  <li>Lateral Movement</li>
                </ol>
              </Card>
            </Col>

          </Row>
        </Content>
      </Layout>

      {/* Footer */}
      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>

    </Layout>
  );
}
