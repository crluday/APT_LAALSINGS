import React, { useState } from "react";
import { Layout } from "antd";
import UniversalLauncherModal from "./UniversalLauncherModal";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../index.css";
import "../style.css";

const { Content, Sider, Footer } = Layout;

const Payload = () => {
  const [showModal, setShowModal] = useState("");

  const payloads = [
    {
      name: "Binary",
      description: "Uses a generated .NET Framework binary to launch a Grunt.",
    },
    {
      name: "Cscript",
      description:
        "Uses cscript.exe to launch a Grunt using a COM activated Delegate and ActiveXObjects (ala DotNetToJScript). Please note that DotNetToJScript-based launchers may not work on Windows 10 and Windows Server 2016.",
    },
    {
      name: "InstallUtil",
      description:
        "Uses installutil.exe to start a Grunt via Uninstall method.",
    },
    {
      name: "MSBuild",
      description: "Uses msbuild.exe to launch a Grunt using an in-line task.",
    },
    {
      name: "Mshta",
      description:
        "Uses mshta.exe to launch a Grunt using a COM activated Delegate and ActiveXObjects (ala DotNetToJScript). Please note that DotNetToJScript-based launchers may not work on Windows 10 and Windows Server 2016.",
    },
    {
      name: "PowerShell",
      description:
        "Uses powershell.exe to launch a Grunt using [System.Reflection.Assembly]::Load().",
    },
    {
      name: "Regsvr32",
      description:
        "Uses regsvr32.exe to launch a Grunt using a COM activated Delegate and ActiveXObjects (ala DotNetToJScript). Please note that DotNetToJScript-based launchers may not work on Windows 10 and Windows Server 2016.",
    },
    {
      name: "ShellCode",
      description: "Converts a Grunt to ShellCode using Donut.",
    },
    {
      name: "Wmic",
      description:
        "Uses wmic.exe to launch a Grunt using a COM activated Delegate and ActiveXObjects (ala DotNetToJScript). Please note that DotNetToJScript-based launchers may not work on Windows 10 and Windows Server 2016.",
    },
    {
      name: "Wscript",
      description:
        "Uses wscript.exe to launch a Grunt using a COM activated Delegate and ActiveXObjects (ala DotNetToJScript). Please note that DotNetToJScript-based launchers may not work on Windows 10 and Windows Server 2016.",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>
        <Sider>
          <Sidebar />
        </Sider>
        <Layout>
          <Content style={{ marginTop: "1px" }}>
            <div className="payload-container">
              <table className="payload-table">
                <thead>
                  <tr>
                    <th>
                      Name <span className="sort-icon">↑↓</span>
                    </th>
                    <th>
                      Description <span className="sort-icon">↑↓</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payloads.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="payload-link"
                          onClick={() => setShowModal(item.name)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showModal && (
                <UniversalLauncherModal
                  payloadType={showModal}
                  description={
                    payloads.find((p) => p.name === showModal)?.description ||
                    ""
                  }
                  onClose={() => setShowModal("")}
                />
              )}
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

export default Payload;
