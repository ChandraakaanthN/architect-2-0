"use client";

import { useState } from "react";
import { MonitorIcon, RefreshCwIcon, SmartphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PREVIEW_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, sans-serif;
    background: linear-gradient(180deg, #f8fafc, #eef2f7);
    height: 100vh;
    position: relative;
  }
  .page {
    padding: 32px;
    color: #334155;
  }
  .page h1 { font-size: 20px; margin: 0 0 6px; color: #0f172a; }
  .page p { font-size: 13px; color: #64748b; max-width: 380px; }
  .widget {
    position: fixed;
    bottom: 16px;
    right: 16px;
    width: 300px;
    border-radius: 14px;
    background: white;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }
  .widget-header {
    padding: 10px 12px;
    font-weight: 600;
    font-size: 13px;
    border-bottom: 1px solid #e2e8f0;
    color: #0f172a;
  }
  .widget-body {
    height: 220px;
    overflow-y: auto;
    padding: 10px 12px;
    font-size: 12.5px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .msg { max-width: 85%; padding: 6px 10px; border-radius: 10px; line-height: 1.4; }
  .msg.bot { background: #f1f5f9; color: #0f172a; align-self: flex-start; }
  .msg.user { background: #0f172a; color: white; align-self: flex-end; }
  .widget-input {
    display: flex;
    gap: 6px;
    padding: 8px;
    border-top: 1px solid #e2e8f0;
  }
  .widget-input input {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 12.5px;
    outline: none;
  }
  .widget-input button {
    border: none;
    background: #0f172a;
    color: white;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 12.5px;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="page">
    <h1>Docs — Getting Started</h1>
    <p>This is your site with the support widget embedded, bottom-right. Try asking it something.</p>
  </div>
  <div class="widget">
    <div class="widget-header">Support Copilot</div>
    <div class="widget-body" id="body">
      <div class="msg bot">Hi! Ask me anything about the docs.</div>
    </div>
    <div class="widget-input">
      <input id="input" placeholder="Ask a question…" />
      <button onclick="send()">Send</button>
    </div>
  </div>
  <script>
    const body = document.getElementById('body');
    const input = document.getElementById('input');
    function addMsg(role, text) {
      const el = document.createElement('div');
      el.className = 'msg ' + role;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
    function send() {
      const text = input.value.trim();
      if (!text) return;
      addMsg('user', text);
      input.value = '';
      setTimeout(() => {
        addMsg('bot', "Based on the docs: you'll find that covered in the Quickstart guide. Want me to escalate to a human instead?");
      }, 500);
    }
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  </script>
</body>
</html>`;

export function PreviewPanel({ ready }: { ready: boolean }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Preview will appear once the UI is built.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1.5">
        <Button
          variant={device === "desktop" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setDevice("desktop")}
        >
          <MonitorIcon />
        </Button>
        <Button
          variant={device === "mobile" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setDevice("mobile")}
        >
          <SmartphoneIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" className="ml-auto" onClick={() => setRefreshKey((k) => k + 1)}>
          <RefreshCwIcon />
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-muted/40 p-4">
        <iframe
          key={refreshKey}
          title="App preview"
          srcDoc={PREVIEW_HTML}
          sandbox="allow-scripts"
          className={`h-full rounded-lg border bg-white shadow-sm transition-all ${
            device === "mobile" ? "w-[375px]" : "w-full"
          }`}
        />
      </div>
    </div>
  );
}
