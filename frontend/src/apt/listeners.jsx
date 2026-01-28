import React, { useState } from "react";
import "../index.css";

const Listener = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [lHost, setLHost] = useState("10.229.40.10");
  const [lPort, setLPort] = useState("80");
  const [rPort, setRPort] = useState("80");
  const [rHost, setRHost] = useState(["10.229.40.130"]);
  const [exploit, setExploit] = useState("0");
  const [payload, setPayload] = useState("False");

  const handleAddAddress = () => {
    setRHost([...rHost, ""]);
  };

  const handleRemoveAddress = (index) => {
    const updated = rHost.filter((_, i) => i !== index);
    setRHost(updated);
  };

  const handleChangeAddress = (index, value) => {
    const updated = [...rHost];
    updated[index] = value;
    setRHost(updated);
  };

  const handleSubmit = async () => {
    const listenerData = {
      name: name || Math.random().toString(36).substring(2, 10),
      lHost,
      lPort,
      rPort,
      rHost,
      exploit,
      payload,
      status: "Active",
      startTime: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3001/api/listeners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listenerData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Listener created successfully!");
        if (onCreate) onCreate(data);
      } else {
        alert("Failed to create listener.");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating listener.");
    }
  };

  return (
    <div className="listener-container">
      <h2 className="listener-title">Create Listener</h2>

      <div className="listener-form">
        <label>Name</label>
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option>Binary</option>
          <option>Cscript</option>
          <option>InstallUtil</option>
          <option>MSBuild</option>
          <option>PowerShell</option>
          <option>Regsvr32</option>
          <option>ShellCode</option>
          <option>Wmic</option>
          <option>Wscript</option>
        </select>

        <div className="form-row">
          <div>
            <label>LHOST</label>
            <input
              type="text"
              value={lHost}
              onChange={(e) => setLHost(e.target.value)}
            />
          </div>
          <div>
            <label>LPORT</label>
            <input
              type="number"
              value={lPort}
              onChange={(e) => setLPort(e.target.value)}
            />
          </div>
        </div>

        <label>RPORT</label>
        <input
          type="number"
          value={rPort}
          onChange={(e) => setRPort(e.target.value)}
        />

        <label>RHOST</label>
        {rHost.map((addr, i) => (
          <div className="address-row" key={i}>
            <input
              type="text"
              value={addr}
              onChange={(e) => handleChangeAddress(i, e.target.value)}
            />
            {/* <input type="text" value={`http://${addr}:${rPort}`} disabled /> */}
            {rHost.length > 1 && (
              <button
                className="remove-btn"
                onClick={() => handleRemoveAddress(i)}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button className="add-btn" onClick={handleAddAddress}>
          + Add
        </button>

        <div className="form-row">
          <div>
            <label>Exploit</label>
            <select
              value={exploit}
              onChange={(e) => setExploit(e.target.value)}
            >
              <option>exploit/multi/handler</option>
            </select>
          </div>

          <div>
            <label>Payload</label>
            <select
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            >
              <option>linux/x64/meterpreter/reverse_tcp</option>
            </select>
          </div>
        </div>

        <button className="create-btn" onClick={handleSubmit}>
          + Create
        </button>
      </div>
    </div>
  );
};

export default Listener;
