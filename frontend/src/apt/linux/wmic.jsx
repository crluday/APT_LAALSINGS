import React, { useState, useEffect } from "react";
import { Layout, Card, Form, Input, Select, Button } from "antd";
import AppHeader from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const { Sider, Content, Footer } = Layout;
const backendUrl = "http://localhost:3001";

const WmicLauncher = ({
  payloadType = "Wmic",
  description = "Uses wmic.exe to launch a Grunt using a COM activated Delegate and ActiveXObjects (ala DotNetToJScript). Please note that DotNetToJScript-based launchers may not work on Windows 10 and Windows Server 2016.",
  onClose,
}) => {
  const [form] = Form.useForm();
  const [launcherCode, setLauncherCode] = useState("");
  const [generated, setGenerated] = useState(false);

  // Default values
  const [lhost, setLhost] = useState("127.0.0.1");
  const [lport, setLport] = useState("4444");

  const buildStagerCode = (values) => {
    return `${payloadType} Launcher  
    Listener: ${values.listener}  
    CommType: ${values.commType}  
    Architecture: ${values.arch}  
    LHOST: ${lhost}  
    LPORT: ${lport}`;
  };

  const handleGenerate = (values) => {
    const code = buildStagerCode(values);
    setLauncherCode(code);
    setGenerated(true);
  };

  const handleDownload = () => {
    if (!generated) return alert("Please generate first.");

    const blob = new Blob([launcherCode], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${payloadType}_launcher.txt`;
    link.click();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout className="layout">
        <Sider>
          <Sidebar />
        </Sider>
        <Layout>
          <Content style={{ marginTop: "1px" }}>
            <Card
              title={`${payloadType} Payload Launcher`}
              bordered={false}
              style={{ maxWidth: "1080px", margin: "0 auto" }}
            >
              <p style={{ marginBottom: 20, color: "#555" }}>{description}</p>

              <Form
                layout="vertical"
                form={form}
                onFinish={handleGenerate}
                initialValues={{
                  listener: "10.10.10.10",
                  commType: "HTTP",
                  arch: "x86",
                }}
              >
                <Form.Item label="Listener" name="listener" required>
                  <Input placeholder="Listener IP" />
                </Form.Item>

                <Form.Item label="Communication Type" name="commType">
                  <Select>
                    <Select.Option value="HTTP">HTTP</Select.Option>
                    <Select.Option value="SMB">SMB</Select.Option>
                    <Select.Option value="TCP">TCP</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Architecture" name="arch">
                  <Select>
                    <Select.Option value="x86">x86</Select.Option>
                    <Select.Option value="x64">x64</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="LHOST">
                  <Input
                    value={lhost}
                    onChange={(e) => setLhost(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="LPORT">
                  <Input
                    value={lport}
                    onChange={(e) => setLport(e.target.value)}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#1677ff",
                    borderColor: "#1677ff",
                  }}
                >
                  Generate Payload
                </Button>

                <Button
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "white",
                    marginLeft: 10,
                  }}
                  onClick={handleDownload}
                  disabled={!generated}
                >
                  Download
                </Button>
              </Form>

              <div style={{ marginTop: 30 }}>
                <h4>Generated Launcher Code</h4>
                <Input.TextArea
                  rows={6}
                  value={launcherCode}
                  readOnly
                  style={{ background: "black" }}
                />
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default WmicLauncher;
