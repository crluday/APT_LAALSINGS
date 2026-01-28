import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Listener from "../apt/listeners";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../index.css";

const { Content, Sider, Footer } = Layout;

const Handler = () => {
  const [listeners, setListeners] = useState([]);
  const [activeTab, setActiveTab] = useState("listeners");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchListeners = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/listeners");
      const data = await res.json();

      console.log("Listeners API:", data);

      if (Array.isArray(data)) {
        setListeners(data);
      } else if (data.listeners && Array.isArray(data.listeners)) {
        setListeners(data.listeners);
      } else {
        setListeners([]);
      }
    } catch (err) {
      console.error("Failed to fetch listeners:", err);
    }
  };

  useEffect(() => {
    fetchListeners();
  }, []);

  const handleListenerCreated = (newListener) => {
    setListeners((prev) => [...prev, newListener]);
    setShowCreateForm(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider>
          <Sidebar />
        </Sider>
        <Layout>
          <Content style={{ marginTop: "1px" }}>
            <div className="handler-container">
              <h1 className="handler-title">Listeners</h1>

              {activeTab === "listeners" ? (
                <div className="listeners-section">
                  <table className="listeners-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>LHOST</th>
                        <th>LPORT</th>
                        <th>RPORT</th>
                        <th>RHOST</th>
                        <th>Exploit</th>
                        <th>payload</th>
                        <th>status</th>
                        <th>startTime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listeners.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="empty-msg">
                            No listeners found.
                          </td>
                        </tr>
                      ) : (
                        listeners.map((listener) => (
                          <tr key={listener.id || listener.name}>
                            <td>{listener.name}</td>
                            <td>{listener.type}</td>
                            <td>{listener.status || "Active"}</td>
                            <td>{listener.startTime || "N/A"}</td>
                            <td>
                              {Array.isArray(listener.connectAddresses)
                                ? listener.connectAddresses.join(", ")
                                : listener.lhost || "N/A"}
                            </td>
                            <td>{listener.connectPort || listener.lport}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <button
                    className="create-btn"
                    onClick={() => setShowCreateForm(true)}
                  >
                    + Create
                  </button>

                  <div className="pagination">
                    <span>Page 1 of 1</span>
                    <div className="page-controls">
                      <button>{"<"}</button>
                      <button className="current-page">1</button>
                      <button>{">"}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="profiles-placeholder">
                  <p>Profiles tab under development...</p>
                </div>
              )}
            </div>

            {showCreateForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button
                    className="close-btn"
                    onClick={() => setShowCreateForm(false)}
                  >
                    ✕
                  </button>
                  <Listener onCreate={handleListenerCreated} />
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      <Footer className="footer">
        ©2025 Central Research Laboratory. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default Handler;
