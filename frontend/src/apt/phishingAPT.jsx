import React, { useState } from "react";
import { Layout, Card, Form, Input, Button, Upload, Modal, Typography, Divider } from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./template.css";


const { Content, Footer, Sider } = Layout;
const { Title } = Typography;

const PhishingAPT = ({
    payloadType = "Phishing Mail",
    description = "Design and send a simulated email to test cybersecurity awareness."
}) => {
    const [form] = Form.useForm();
    const [htmlContent, setHtmlContent] = useState("<h2>Email Template</h2><p>Edit this content...</p>");
    const [previewVisible, setPreviewVisible] = useState(false);

    const [htmlFileList, setHtmlFileList] = useState([]);
    const [attachmentFile, setAttachmentFile] = useState(null);

    // =======================
    //     TEMPLATES
    // =======================
    const templates = {
        office_365: `
          <div style="font-family: Arial, sans-serif; background:#f5f6fa; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:8px;">
              <p><img height="60px" width="240px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Logo_Microsoft_Office_365_%282013-2019%29.svg/960px-Logo_Microsoft_Office_365_%282013-2019%29.svg.png" /></p>
              <h1><b>A high-severity alert has been triggered</b></h1>
              <p>Hello,</p>
              <p>Our systems detected a login attempt that did not follow standard security protocols.</p>
              <p><strong>Event Type:</strong> Unrecognized Login</p>
              <p><strong>Location:</strong> New Delhi, India</p>
              <a href="https://www.microsoft.com/review" style="background:#DC3E15;color:white;padding:12px 18px;border-radius:4px;display:inline-block;">Click Here</a>
              <p style="margin-top:20px;color:#777;font-size:12px;">Cybersecurity simulation email.</p>
            </div>
          </div>
        `,

        zoom_meeting: `
          <div style="font-family: Arial, sans-serif; background:#f2f2f2; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:8px;">
              <p><img height="60px" width="240px" src="https://freelogopng.com/images/all_img/1685422532zoom-logo-png.png" /></p>
              <h2 style="color:#1a73e8;">Meeting Reminder</h2>
              <p>Hello,</p>
              <p>Join Link: https://zoom.com/simulation</p>
              <a href="#" style="background:#1a73e8;color:white;padding:12px 18px;border-radius:4px;">Click Here</a>
            </div>
          </div>
        `,

        document_sign: `
          <div style="font-family: Arial, sans-serif; background:#f2f2f2; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:8px;">
              <h2 style="color:#1a73e8;">Document Signature Required</h2>
              <p>Hello,</p>
              <p>A simulated document needs your acknowledgment.</p>
              <a href="#" style="background:#1a73e8;color:white;padding:12px 18px;border-radius:4px;">Open Document</a>
            </div>
          </div>
        `,

        monday_verify: `
          <div style="font-family: Arial, sans-serif; background:#eef2f7; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:8px;">
              <h2>Monday.com Board Invitation</h2>
              <p>You are invited to join a simulated board.</p>
              <a href="#" style="background:#258f3e;color:white;padding:12px 18px;border-radius:4px;">See Board</a>
            </div>
          </div>
        `,

        account_review: `
          <div style="font-family: Arial, sans-serif; background:#fafafa; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:8px;">
              <h2 style="color:#d9534f;">Account Review Required</h2>
              <p>This is a cybersecurity simulation alert.</p>
              <a href="#" style="background:#d9534f;color:white;padding:12px 18px;border-radius:4px;">Review Alert</a>
            </div>
          </div>
        `
    };

    const handleTemplateChange = (key) => setHtmlContent(templates[key]);

    // ============================
    //    HTML File Upload
    // ============================
    const htmlUploadProps = {
        onRemove: () => setHtmlFileList([]),
        beforeUpload: (file) => {
            setHtmlFileList([file]);
            const reader = new FileReader();
            reader.onload = (e) => setHtmlContent(e.target.result);
            reader.readAsText(file);
            return false;
        },
        fileList: htmlFileList,
        accept: ".html"
    };

    // ============================
    //    Attachment Upload
    // ============================
    const allowedExtensions = ".jpg,.jpeg,.pdf,.docx,.odt,.zip,.txt";

    const attachmentProps = {
        onRemove: () => setAttachmentFile(null),
        beforeUpload: (file) => {
            setAttachmentFile(file);
            return false;
        },
        fileList: attachmentFile ? [{ uid: "-1", name: attachmentFile.name, status: "done" }] : [],
        accept: allowedExtensions,
        maxCount: 1
    };

    // ============================
    //     Send Email Unified
    // ============================
    const sendEmailUnified = async (includeAttachment) => {
        const formData = form.getFieldsValue();

        const receivers = formData.receivers
            .map(email => email?.trim())
            .filter(Boolean);

        if (!formData.subject) return alert("Please enter a subject!");
        if (receivers.length === 0) return alert("Please enter at least one receiver!");

        const apiFormData = new FormData();
        apiFormData.append("sender", formData.sender);
        apiFormData.append("subject", formData.subject);
        apiFormData.append("htmlContent", htmlContent);
        apiFormData.append("receivers", JSON.stringify(receivers));

        if (includeAttachment && attachmentFile) {
            apiFormData.append("attachment", attachmentFile);
        }

        try {
            const res = await fetch(`http://${window.location.hostname}:3001/send-mail`, {
                method: "POST",
                body: apiFormData
            });

            const data = await res.json();
            data.success
                ? alert(`Email sent ${includeAttachment ? "with" : "without"} attachment!`)
                : alert(data.message || "Failed to send email");
        } catch (err) {
            console.error(err);
            alert("Email sending failed.");
        }
    };

    // ============================
    //     UI Layout (Option C)
    // ============================
    return (
        <Layout className="layout" style={{ minHeight: "80vh" }}>
            <AppHeader />
            <Layout>
                <Sider><Sidebar /></Sider>

                <Content style={{ padding: "16px 24px" }}>
                    <Card
                        style={{
                            maxWidth: 1050,
                            margin: "0 auto",
                            borderRadius: 10,
                            padding: 5
                        }}
                        bordered={true}
                    >
                        <Title level={3} style={{ marginBottom: 10, textAlign: "center",color: "#da0a0aff"}}>
                            {payloadType}
                        </Title>

                        <p style={{ marginBottom: 20, color: "#555", textAlign:"center" }}>{description}</p>

                        <Form
                            layout="vertical"
                            form={form}
                            initialValues={{
                                receivers: ["uday@beltest.co.in"],
                                sender: "soc_10@bel.in",
                                subject: "Critical Security Threat!"
                            }}
                        >
                            {/* Sender + Subject */}
                            <Form.Item label="Sender Email" name="sender" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Email Subject" name="subject" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            {/* Receivers */}
                            <Form.List name="receivers">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.key} style={{ display: "flex",alignItems: "center", marginBottom: 10 }}>
                                                <Form.Item
                                                    {...field}
                                                    label={`Receiver #${index + 1}`}
                                                    style={{ flex: 1 }}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                {index > 0 && (
                                                    <Button danger style={{ marginLeft: 8 }} onClick={() => remove(field.name)}>
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        ))}

                                        <Button type="dashed" onClick={() => add()} block>
                                            + Add Receiver
                                        </Button>
                                    </>
                                )}
                            </Form.List>

                            <Divider />

                            {/* HTML Editor */}
                            <Title level={4} style={{ color: "#fff" }}>
                                Email HTML Content
                            </Title>

                            <textarea
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: 300,
                                    background: "#1e1e1e",     // << NOT WHITE
                                    color: "#0f0",
                                    padding: 12,
                                    borderRadius: 6,
                                    border: "1px solid #5f5b5bff",
                                    fontSize: 14,
                                    lineHeight: "1.5"
                                }}
                            />
                            <Divider />

                            {/* Templates */}
                            <Title level={4} style={{color:"#fff"}} >
                                Load Templates
                            </Title>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                <Button onClick={() => handleTemplateChange("office_365")}className="template-btn">Office 365</Button>
                                <Button onClick={() => handleTemplateChange("zoom_meeting")}className="template-btn">Zoom Meeting</Button>
                                <Button onClick={() => handleTemplateChange("document_sign")}className="template-btn">Document Sign</Button>
                                <Button onClick={() => handleTemplateChange("monday_verify")}className="template-btn">Monday.com</Button>
                                <Button onClick={() => handleTemplateChange("account_review")}className="template-btn">Account Review</Button>
                            </div>

                            <Divider />
                            <Title level={4} style={{ marginBottom: 10, color: "#fff" }}>
                                Upload HTML
                            </Title>
                            <Form.Item label="attcah file(.html)"  >
                                <Upload {...htmlUploadProps} showUploadList={false}>
                                    <Button icon={<FileTextOutlined />}
                                  style={{
                                    color: "#fff",
                                    background: "#1677ff",
                                    borderColor: "#1677ff",
                                }}
                                    >
                                        {htmlFileList[0]?.name ? `Change File (${htmlFileList[0]?.name})` : "Upload HTML"}
                                    </Button>
                                </Upload>
                            </Form.Item>

                            <Divider />

                            {/* Attachment */}
                            <Title level={4} style={{ marginBottom: 10, color: "#fff" }}>
                                Attachment
                            </Title>

                            <Form.Item label={`Attach File (${allowedExtensions})`}>
                                <Upload {...attachmentProps} showUploadList={false}>
                            <Button 
                                icon={<UploadOutlined />} 
                                disabled={!!attachmentFile}
                                style={{
                                    color: "#fff",
                                    background: "#1677ff",
                                    borderColor: "#1677ff",
                                }}
                            >
                                {attachmentFile ? `(${attachmentFile.name})` : "Select Attachment"}
                            </Button>
                                </Upload>

                                {attachmentFile && (
                                    <Button
                                        danger
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        onClick={() => setAttachmentFile(null)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Form.Item>
                            {/* Action Buttons */}
                            <Title level={4} style={{color: "#fff", marginTop:10}}>Send Actions </Title>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                <Button type="primary" onClick={() => setPreviewVisible(true)}>
                                    Preview HTML
                                </Button>

                                <Button onClick={() => sendEmailUnified(false)}>
                                    Send Email (No Attachment)
                                </Button>

                                <Button
                                    type="primary"
                                    disabled={!attachmentFile}
                                    onClick={() => sendEmailUnified(true)}
                                    style={{color:"#fff"}}
                                >
                                    Send Email (With Attachment)
                                </Button>
                            </div>
                        </Form>

                        {/* Preview Modal */}
                        <Modal
                            open={previewVisible}
                            title="Email Preview"
                            footer={null}
                            onCancel={() => setPreviewVisible(false)}
                            width={800}
                        >
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        </Modal>
                    </Card>
                </Content>
            </Layout>

            <Footer className="footer">
                ©2025 Central Research Laboratory. All rights reserved.
            </Footer>
        </Layout>
    );
};

export default PhishingAPT;
