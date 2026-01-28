import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

// External
import ExternalAttacks from "./components/External";
import PortScan from "./external/port-scan";
import BruteForce from "./external/brute-force";
import SSHAttack from "./external/ssh-attack";
import DoSExtAttack from "./external/dos-attack";
import Malware from "./external/malware-attack";

// Internal
import InternalAttacks from "./components/Internal";
import Phishing from "./internal/phishing";
import DataExploitation from "./internal/data-exploitation";
import LateralMovement from "./internal/lateral-movement";
import DoSIntAttack from "./internal/dos-attack";

// APT
import APTAttacks from "./components/APTAttacks";
import PortScans from "./apt/port-scans";
import BruteForces from "./apt/brute-forces";
import SSHAttacks from "./apt/ssh-attacks";
import DoSAPTAttacks from "./apt/dos-attacks";
import MalwareAttacks from "./apt/malware-attacks";
import PhishingAttacks from "./apt/phishing-attacks";
import LateralMovementAttack from "./apt/lateral-movements";
import DataExploitationAttack from "./apt/data-exploitations";
import Payload from "./apt/payload";
import Handler from "./apt/handler";
import PhishingAPT from "./apt/phishingAPT";

// Payloads
import Executable from "./apt/windows/executable";
import Powershell from "./apt/windows/powershell_Launch";
import InstallerLauncher from "./apt/windows/installer";
import BatLauncher from "./apt/windows/batscript";
import MsbuildLauncher from "./apt/windows/msbuild";
import MshtaLauncher from "./apt/windows/mshta";
import Binary from "./apt/linux/Binary";
import Shinstall from "./apt/linux/sh_install";
import WmicLauncher from "./apt/android/wmic";
import WscriptLauncher from "./apt/android/wscript";

// Web
import PortAnalysis from "./web/PortAnalysis";
import AuthStrength from "./web/AuthStrength";
import XSS from "./web/XSS";
import RateLimit from "./web/RateLimit";
import FileSafety from "./web/FileSafety";
import SocialRisk from "./web/SocialRisk";
import DataAccess from "./web/DataAccess";
import AccessPaths from "./web/AccessPaths";

// OWASP
import Injection from "./web/owasp/Injection";
import AccessControl from "./web/owasp/BrokenAccessControl";
import CryptographicFailures from "./web/owasp/CryptographicFailures";
import InsecureDesign from "./web/owasp/InsecureDesign";
import SecurityMisconfiguration from "./web/owasp/SecurityMisconfiguration";
import VulnerableComponents from "./web/owasp/VulnerableComponents";
import AuthFailures from "./web/owasp/AuthFailures";
import IntegrityFailures from "./web/owasp/IntegrityFailures";
import LoggingFailures from "./web/owasp/LoggingFailures";
import SSRF from "./web/owasp/SSRF";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<LoginForm />} />

      {/* 🔐 PROTECTED */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      <Route path="/external" element={<PrivateRoute><ExternalAttacks /></PrivateRoute>} />
      <Route path="/external/port-scan" element={<PrivateRoute><PortScan /></PrivateRoute>} />
      <Route path="/external/brute-force" element={<PrivateRoute><BruteForce /></PrivateRoute>} />
      <Route path="/external/ssh-attack" element={<PrivateRoute><SSHAttack /></PrivateRoute>} />
      <Route path="/external/dos-attack" element={<PrivateRoute><DoSExtAttack /></PrivateRoute>} />
      <Route path="/external/malware-attack" element={<PrivateRoute><Malware /></PrivateRoute>} />

      <Route path="/internal" element={<PrivateRoute><InternalAttacks /></PrivateRoute>} />
      <Route path="/internal/phishing" element={<PrivateRoute><Phishing /></PrivateRoute>} />
      <Route path="/internal/data-exploitation" element={<PrivateRoute><DataExploitation /></PrivateRoute>} />
      <Route path="/internal/lateral-movement" element={<PrivateRoute><LateralMovement /></PrivateRoute>} />
      <Route path="/internal/dos-attack" element={<PrivateRoute><DoSIntAttack /></PrivateRoute>} />

      <Route path="/apt" element={<PrivateRoute><APTAttacks /></PrivateRoute>} />
      <Route path="/apt/port-scans" element={<PrivateRoute><PortScans /></PrivateRoute>} />
      <Route path="/apt/brute-forces" element={<PrivateRoute><BruteForces /></PrivateRoute>} />
      <Route path="/apt/ssh-attacks" element={<PrivateRoute><SSHAttacks /></PrivateRoute>} />
      <Route path="/apt/dos-attacks" element={<PrivateRoute><DoSAPTAttacks /></PrivateRoute>} />
      <Route path="/apt/malware-attacks" element={<PrivateRoute><MalwareAttacks /></PrivateRoute>} />
      <Route path="/apt/phishing-attacks" element={<PrivateRoute><PhishingAttacks /></PrivateRoute>} />
      <Route path="/apt/data-exploitations" element={<PrivateRoute><DataExploitationAttack /></PrivateRoute>} />
      <Route path="/apt/lateral-movements" element={<PrivateRoute><LateralMovementAttack /></PrivateRoute>} />
      <Route path="/apt/payload" element={<PrivateRoute><Payload /></PrivateRoute>} />
      <Route path="/apt/handler" element={<PrivateRoute><Handler /></PrivateRoute>} />
      <Route path="/apt/phishing" element={<PrivateRoute><PhishingAPT /></PrivateRoute>} />

      <Route path="/windows/executable" element={<PrivateRoute><Executable /></PrivateRoute>} />
      <Route path="/windows/powershell" element={<PrivateRoute><Powershell /></PrivateRoute>} />
      <Route path="/windows/installer" element={<PrivateRoute><InstallerLauncher /></PrivateRoute>} />
      <Route path="/windows/bat" element={<PrivateRoute><BatLauncher /></PrivateRoute>} />
      <Route path="/linux/elf" element={<PrivateRoute><Binary /></PrivateRoute>} />
      <Route path="/linux/sh" element={<PrivateRoute><Shinstall /></PrivateRoute>} />
      <Route path="/linux/msbuild" element={<PrivateRoute><MsbuildLauncher /></PrivateRoute>} />
      <Route path="/payload/mshta" element={<PrivateRoute><MshtaLauncher /></PrivateRoute>} />
      <Route path="/payload/wmic" element={<PrivateRoute><WmicLauncher /></PrivateRoute>} />
      <Route path="/payload/wscript" element={<PrivateRoute><WscriptLauncher /></PrivateRoute>} />

      <Route path="/web/port-analysis" element={<PrivateRoute><PortAnalysis /></PrivateRoute>} />
      <Route path="/web/auth-strength" element={<PrivateRoute><AuthStrength /></PrivateRoute>} />
      <Route path="/web/XSS" element={<PrivateRoute><XSS /></PrivateRoute>} />
      <Route path="/web/rate-limit" element={<PrivateRoute><RateLimit /></PrivateRoute>} />
      <Route path="/web/file-safety" element={<PrivateRoute><FileSafety /></PrivateRoute>} />
      <Route path="/web/social-risk" element={<PrivateRoute><SocialRisk /></PrivateRoute>} />
      <Route path="/web/data-access" element={<PrivateRoute><DataAccess /></PrivateRoute>} />
      <Route path="/web/accesspaths" element={<PrivateRoute><AccessPaths /></PrivateRoute>} />

      <Route path="/web/owasp/injection" element={<PrivateRoute><Injection /></PrivateRoute>} />
      <Route path="/web/owasp/access-control" element={<PrivateRoute><AccessControl /></PrivateRoute>} />
      <Route path="/web/owasp/crypto-failures" element={<PrivateRoute><CryptographicFailures /></PrivateRoute>} />
      <Route path="/web/owasp/insecure-design" element={<PrivateRoute><InsecureDesign /></PrivateRoute>} />
      <Route path="/web/owasp/security-misconfig" element={<PrivateRoute><SecurityMisconfiguration /></PrivateRoute>} />
      <Route path="/web/owasp/vulnerable-components" element={<PrivateRoute><VulnerableComponents /></PrivateRoute>} />
      <Route path="/web/owasp/auth-failures" element={<PrivateRoute><AuthFailures /></PrivateRoute>} />
      <Route path="/web/owasp/integrity-failures" element={<PrivateRoute><IntegrityFailures /></PrivateRoute>} />
      <Route path="/web/owasp/logging-failures" element={<PrivateRoute><LoggingFailures /></PrivateRoute>} />
      <Route path="/web/owasp/ssrf" element={<PrivateRoute><SSRF /></PrivateRoute>} />

    </Routes>
  );
}
