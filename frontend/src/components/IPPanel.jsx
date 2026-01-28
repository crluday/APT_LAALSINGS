import React, { useEffect, useState } from "react";

export default function IPPanels({ targetIP = "", hostOverride = "" }) {
  const [hostIp, setHostIp] = useState("");

  useEffect(() => {
    setHostIp(hostOverride || window.location.host || "127.0.0.1:3000");
  }, [hostOverride]);

  useEffect(() => {
    const css = `
      .twin-wrapper {
        position: relative;
        display: flex;
        gap: 25%;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .panel {
        width: 300px;
        min-width: 220px;
        background: linear-gradient(180deg, #0b1220, #071221);
        color: #e6eef8;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 6px 18px rgba(3,8,15,0.6);
        position: relative;
        z-index: 1;
      }

      .panel-title {
        font-weight: 700;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ip-box {
        background: rgba(255,255,255,0.03);
        padding: 12px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ip-text {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
        font-size: 14px;
        color: #bfe3ff;
      }

      .line-overlay {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        pointer-events: none;
        height: 2px;
        display: flex;
        justify-content: center;
        z-index: 0;
      }

      .dashed-line {
        position: relative;
        width: 100%;
        max-width: 500px;
        height: 2px;
        background: repeating-linear-gradient(to right, red 0 10px, transparent 10px 20px);
        overflow: hidden;
      }

      .moving-arrow {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        animation: moveArrow 2s linear infinite;
      }

      @keyframes moveArrow {
        0% { left: 0%; }
        100% { left: 100%; }
      }

      @media (max-width: 640px) {
        .twin-wrapper { flex-direction: column; gap: 18px; }
        .line-overlay { display: none; }
      }
    `;

    const style = document.createElement("style");
    style.setAttribute("data-ip-panels-css", "true");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="twin-wrapper">
      <div className="panel">
        <div className="panel-title">
          Red Team's Machine <span className="emoji">🐞</span>
        </div>
        <div className="ip-box">
          <div className="ip-text">{hostIp}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          Victim's Machine <span className="emoji">🛡️</span>
        </div>
        <div className="ip-box">
          <div className="ip-text">{targetIP || "\u00A0"}</div>
        </div>
      </div>

      <div className="line-overlay">
        <div className="dashed-line">
          <svg
            className="moving-arrow"
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 5H14" stroke="limegreen" strokeWidth="2" />
            <path d="M14 1L20 5L14 9" stroke="limegreen" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
