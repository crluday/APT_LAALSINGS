import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";
import "../index.css";

export default function LoginForm() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { username, password } = values;

    const success = login(username, password);

    if (success) {
      message.success("Login successful");
      navigate("/dashboard", { replace: true });

    } else {
      message.error("Invalid username or password");
    }
  };

  return (
    <div className="video-bg-container">
      <video autoPlay muted loop className="bg-video">
        <source src="/video-bg.mp4" type="video/mp4" />
      </video>

      <div className="form-overlay">
        <Card title="Red Team Simulator" className="glass-card" style={{ width: 450 }}>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              <LoginOutlined /> Login
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
