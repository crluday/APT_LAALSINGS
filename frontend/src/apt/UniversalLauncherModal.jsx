import React, { useState, useEffect } from "react";
import "../index.css";

const backendUrl = "http://localhost:3001";

const UniversalLauncherModal = ({
  payloadType = "Binary",
  description = "",
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("Generate");

  const [formData, setFormData] = useState({
    Listener: "10.229.40.10",
    CommType: "HTTP",
    ConnectAttempts: "5000",
    KillDate: "12/31/2025 12:00 AM",
    Architecture: "x86",
  });

  const [lhost, setLhost] = useState("127.0.0.1");
  const [lport, setLport] = useState("4444");

  const [launcherCode, setLauncherCode] = useState("");
  const [generated, setGenerated] = useState(false);

  const [hosting, setHosting] = useState(false);
  // const [hostedUrl, setHostedUrl] = useState("");
  // const [hostedFilename, setHostedFilename] = useState("");
  // const [showTerminal, setShowTerminal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const buildStagerCode = (payloadTypeParam, fd, lhostParam, lportParam) => {
    return `${payloadTypeParam} simulated launcher Listener: ${fd.Listener}, CommType: ${fd.CommType} LHOST: ${lhostParam}, LPORT: ${lportParam} }`;
  };

  // Generate button handler
  const handleGenerate = () => {
    const code = buildStagerCode(payloadType, formData, lhost, lport);
    setLauncherCode(code);
    setGenerated(true);
    setHostedUrl("");
    setHostedFilename("");
    setShowTerminal(false);
    alert(`${payloadType} payload generated (simulation).`);
  };

  // Local download
  const handleDownload = () => {
    if (!generated) {
      alert("Please generate before downloading.");
      return;
    }
    let extension = "txt";
    const pt = (payloadType || "").toLowerCase();
    if (pt === "powershell") extension = "ps1";
    else if (pt === "cscript" || pt === "wscript") extension = "vbs";
    else if (pt === "shellcode") extension = "bin";
    else if (pt === "binary" || pt === "installutil" || pt === "msbuild")
      extension = "exe";

    const blob = new Blob([launcherCode], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${payloadType}_Launcher.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const handleHost = async () => {
    if (!generated) {
      alert("Generate the payload first.");
      return;
    }

    // setHosting(true);
    // setHostedUrl("");
    // setHostedFilename("");
    // setShowTerminal(false);

    try {
      const payload = {
        payloadType,
        content: launcherCode,
      };

      const resp = await fetch(`${backendUrl}/api/host`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        let errMsg = `Host failed (${resp.status})`;
        try {
          const j = await resp.json();
          errMsg = j.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await resp.json();
      // setHostedUrl(data.url || "");
      // setHostedFilename(data.filename || "");
      setActiveTab("Host");
      // setShowTerminal(true);
      alert(
        "Payload hosted (simulation) — hosted URL: " +
          (data.url || "(not returned)")
      );
    } catch (err) {
      console.error("Host error:", err);
      alert("Hosting failed: " + (err?.message || err));
      // setShowTerminal(false);
    } finally {
      // setHosting(false);
    }
  };

  useEffect(() => {
    if (generated) {
      const code = buildStagerCode(payloadType, formData, lhost, lport);
      setLauncherCode(code);
    }
  }, [lhost, lport]);

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{payloadType} Launcher</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="tab-content" style={{ minHeight: 220 }}>
          {activeTab === "Generate" && (
            <div className="form-section">
              <h3>{payloadType} launched successfully</h3>
              <p className="description">{description}</p>

              <div className="form-grid">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <label>{key}</label>
                    {key === "CommType" || key === "Architecture" ? (
                      <select
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                      >
                        {key === "CommType" ? (
                          <>
                            <option>HTTP</option>
                            <option>SMB</option>
                            <option>TCP</option>
                          </>
                        ) : (
                          <>
                            <option>x86</option>
                            <option>x64</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}

                {/* LHOST / LPORT inputs */}
                <div>
                  <label>LHOST</label>
                  <input
                    type="text"
                    value={lhost}
                    onChange={(e) => setLhost(e.target.value)}
                    placeholder="e.g. 192.168.1.10"
                  />
                </div>
                <div>
                  <label>LPORT</label>
                  <input
                    type="text"
                    value={lport}
                    onChange={(e) => setLport(e.target.value)}
                    placeholder="e.g. 4444"
                  />
                </div>
              </div>

              <div className="button-row" style={{ marginTop: 16 }}>
                <button className="generate-btn" onClick={handleGenerate}>
                  ⚡ Generate
                </button>

                <button
                  className="generate-btn"
                  onClick={handleHost}
                  disabled={hosting}
                  title={
                    generated
                      ? "Host generated payload to backend"
                      : "Generate before hosting"
                  }
                  style={{ marginLeft: 8 }}
                >
                  {hosting ? "Hosting..." : "Host"}
                </button>

                <button
                  className="download-btn"
                  onClick={handleDownload}
                  style={{ marginLeft: 8 }}
                >
                  ⬇ Download
                </button>
              </div>

              <div className="launcher-section" style={{ marginTop: 12 }}>
                <label>Launcher</label>
                <input
                  type="text"
                  value={generated ? `${payloadType}_Launcher` : ""}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalLauncherModal;
