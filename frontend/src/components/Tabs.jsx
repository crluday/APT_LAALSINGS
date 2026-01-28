import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Tabs({ tabs = [], onSelect }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (tab) => {
    if (onSelect) onSelect(tab);
    navigate(tab.path);
  };

  return (
    <div className="tab-container">
      <style>{`
        .tab-container { margin: 1rem 1rem; }
        .tabs { display: flex; overflow: hidden; background-color: #9b30ff; border-radius: 6px 6px 0 0; }
        .tab { flex: 1; font-size: 20px; padding: 10px; cursor: pointer; color: #f0f4ff; background-color: #000; border: 1px solid transparent; transition: background 0.3s; }
        .tab:hover { background-color: #ff0044; }
        .tab.active { color: #fff; background-color: red; }
      `}</style>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${location.pathname === tab.path ? "active" : ""}`}
            onClick={() => handleClick(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
