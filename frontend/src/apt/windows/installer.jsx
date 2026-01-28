import React, { useState, useEffect } from "react";
import { Layout, Card, Form, Input, Select, Button } from "antd";
import AppHeader from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const { Sider, Content, Footer } = Layout;
const backendUrl = `http://${window.location.hostname}:3001`;


const InstallerLauncher = ({
  payloadType = "InstallerLauncher",
  description = "Uses InstallerLauncher to launch a Grunt using ",
  onClose,
}) => {
  const [form] = Form.useForm();
    const [launcherCode, setLauncherCode] = useState("");
    const [generated, setGenerated] = useState(false);
  
    // Default values
    const [lhost, setLhost] = useState("10.229.40.138");
    const [lport, setLport] = useState("4444");
  
    const buildStagerCode = (values) => {
      return `${payloadType} Launcher
      Payload: ${values.commType}
      Encoder: ${values.encoder}
      Payload_type:${values.arch}
      LHOST: ${lhost}
      LPORT: ${lport}`;
    };
  const handleGenerate = async (values) => {
  const payloadData = {
    payload: values.commType,
    encoder: values.encoder,
    encoder_iteration:values.Iter,
    lhost: lhost,
    lport: lport,
    payload_Type: values.arch,
    payload_name:values.name,

  };

  try {
    const res = await fetch(`${backendUrl}/generate`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadData),
    });

    const data = await res.json();

    // Optional: Show backend response in UI
    setLauncherCode(JSON.stringify(data, null, 2));
    setGenerated(true);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};

const handleDownload = () => {
  if (!generated) return alert("Please generate first.");

  const data = JSON.parse(launcherCode);
  const filename = data.filename;

  window.location.href = `${backendUrl}/download/${filename}`;
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
                listener: "10.229.40.10",
                commType: "windows/x64/meterpreter/reverse_tcp",
                arch: "msi",
              }}
            >
              <Form.Item label="Payload_Type" name="arch" required>
                <Select>
                  <Select.Option value="msi">msi</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Payload" name="commType" required>
                <Select>
                  <Select.Option value="windows/meterpreter/reverse_tcp">
                    windows/meterpreter/reverse_tcp
                  </Select.Option>
                  <Select.Option value="windows/x64/meterpreter/reverse_tcp">
                    windows/x64/meterpreter/reverse_tcp
                  </Select.Option>
                  <Select.Option value="windows/powershell_reverse_tcp">
                    windows/powershell_reverse_tcp
                  </Select.Option>
                  <Select.Option value="windows/shell/reverse_tcp">
                    windows/shell/reverse_tcp
                  </Select.Option>
                </Select>
              </Form.Item>

              {/* Encoder + Iteration VALIDATION */}
              <Form.Item label="Encoder" name="encoder">
                <Select allowClear>
                  <Select.Option value="x86/xor_dynamic">x86/xor_dynamic</Select.Option>
                  <Select.Option value="x64/xor">x64/xor</Select.Option>
                  <Select.Option value="x86/shikata_ga_nai">x86/Shikata_Ga_Ni</Select.Option>
                  <Select.Option value="cmd/powershell_base64">cmd/powershell_base64</Select.Option>
                  <Select.Option value="python">Python Payload</Select.Option>
                  <Select.Option value="x64/xor_dynamic">x64/xor_dynamic</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Iteration Number"
                name="Iter"
                dependencies={["encoder"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const encoder = getFieldValue("encoder");

                      if (encoder && !value) {
                        return Promise.reject("Iteration is required when encoder is selected!");
                      }
                      if (!encoder && value) {
                        return Promise.reject("Cannot set iteration unless encoder is selected.");
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="Enter encoding iteration" />
              </Form.Item>

              {/* LHOST */}
              <Form.Item label="LHOST" required>
                <Input value={lhost} onChange={(e) => setLhost(e.target.value)} />
              </Form.Item>

              {/* LPORT */}
              <Form.Item label="LPORT" required>
                <Input value={lport} onChange={(e) => setLport(e.target.value)} />
              </Form.Item>

              {/* Filename */}
              <Form.Item
                label="Payload_File_Name"
                name="name"
                rules={[{ required: true, message: "Please enter a name" }]}
              >
                <Input placeholder="Enter payload name" />
              </Form.Item>

              {/* FIXED BUTTON (Correct onClick + form submit) */}
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#1677ff", borderColor: "#1677ff" }}
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

 


export default InstallerLauncher;
