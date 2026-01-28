import React, { useEffect, useState } from "react";
import { Layout, Button, Form, Input, message, Spin } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";
import "../index.css";

const { Content, Sider, Footer } = Layout;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const fields = [
  { name: "portScan", label: "Port Scan" },
  { name: "bruteForce", label: "Brute Force" },
  { name: "sshAttack", label: "SSH Attack" },
  { name: "dosAttack", label: "DoS Attack" },
  { name: "malware", label: "Malware Attack" },
  { name: "phishing", label: "Phishing Attack" },
  { name: "data-exploitation", label: "Data Exploitation" },
  { name: "lateral-movement", label: "Lateral Movement" },
];

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch("http://"+document.location.hostname+":3001/api/commands")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOriginalData(data || {});

        const flatData = {};
        for (const key in data) {
          const val = data[key];
          if (val && typeof val === "object" && "command" in val) {
            if (Array.isArray(val.command)) {
              flatData[key] = val.command.join("\n");
            } else {
              flatData[key] = String(val.command);
            }
          } else {
            flatData[key] = typeof val === "undefined" ? "" : String(val);
          }
        }

        fields.forEach((f) => {
          if (typeof flatData[f.name] === "undefined") flatData[f.name] = "";
        });

        form.setFieldsValue(flatData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        message.error("Failed to load commands from server");
        const defaults = {};
        fields.forEach((f) => (defaults[f.name] = ""));
        form.setFieldsValue(defaults);
        setLoading(false);
      });
  }, [form]);

  const onFinish = (values) => {
    const payload = {};
    fields.forEach((f) => {
      const key = f.name;
      const original = originalData[key];
      const label = f.label || (original && original.label) || key;
      if (
        original &&
        typeof original === "object" &&
        Array.isArray(original.command)
      ) {
        const arr = String(values[key] || "")
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        payload[key] = { label, command: arr };
      } else {
        payload[key] = { label, command: String(values[key] || "") };
      }
    });

    fetch("http://localhost:3001/api/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (res.ok && (json.success === true || json.success === undefined)) {
          message.success("Commands updated successfully");
          setOriginalData(payload);
        } else {
          console.error("Save response:", json);
          message.error(json.message || "Failed to update commands");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        message.error("Failed to update commands");
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" tip="Loading commands..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider>
          <Sidebar />
        </Sider>
        <Layout>
          <Content className="center-form">
            <div className="form-wrapper">
              <Form
                {...layout}
                form={form}
                name="settingsForm"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                {fields.map((field) => (
                  <Form.Item
                    key={field.name}
                    name={field.name}
                    label={
                      <span style={{ color: "white" }}>{field.label}</span>
                    }
                    rules={[
                      { required: true, message: `${field.label} is required` },
                    ]}
                  >
                    <Input.TextArea
                      placeholder={`Enter ${field.label}`}
                      rows={4}
                      autoSize={{ minRows: 2, maxRows: 8 }}
                    />
                  </Form.Item>
                ))}

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  <Button
                    type="default"
                    htmlType="button"
                    onClick={() => {
                      const flat = {};
                      for (const key in originalData) {
                        const v = originalData[key];
                        if (v && typeof v === "object" && "command" in v) {
                          flat[key] = Array.isArray(v.command)
                            ? v.command.join("\n")
                            : String(v.command);
                        } else {
                          flat[key] = typeof v === "undefined" ? "" : String(v);
                        }
                      }
                      fields.forEach((f) => {
                        if (typeof flat[f.name] === "undefined")
                          flat[f.name] = "";
                      });
                      form.setFieldsValue(flat);
                      message.info("Reverted to last loaded commands");
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default Settings;
