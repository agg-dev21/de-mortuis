// Runs one of the De Mortuis tools as a desktop app:
// a tiny local server for the game folder + an Edge/Chrome window in app mode.
// Usage: node launch.cjs env | char
// When the window closes, the server stops too.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');                 // the de-mortuis-game folder
const APPS = {
  env: { page: 'tools/environment-editor.html', title: 'Environment Editor', size: '1500,950' },
  char: { page: 'tools/character-studio.html', title: 'Character Studio', size: '1500,980' },
};
const which = APPS[process.argv[2]] ? process.argv[2] : 'char';
const app = APPS[which];

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.dmchar': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const SAVE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.dmchar', '.json']);
const SAVE_DIRS = ['img', 'characters'];                    // the tools may only write in here

// resolve a client path safely inside ROOT
function safe(rel) {
  const p = path.resolve(ROOT, decodeURIComponent(rel || '').replace(/^[/\\]+/, ''));
  if (p !== ROOT && !p.startsWith(ROOT + path.sep)) return null;
  return p;
}
function canWrite(p) {
  if (!SAVE_EXT.has(path.extname(p).toLowerCase())) return false;
  const rel = path.relative(ROOT, p).split(path.sep);
  return rel.length >= 2 && SAVE_DIRS.includes(rel[0]);
}
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

let port = 0, lastPing = Date.now();
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const origin = req.headers.origin;
  // only our own window may use the API (stops other web pages from writing files)
  if (url.pathname.startsWith('/api/') && origin && origin !== `http://127.0.0.1:${port}`) return json(res, 403, { error: 'forbidden' });

  if (url.pathname === '/api/ping') { lastPing = Date.now(); return json(res, 200, { app: 'dm-tools', root: path.basename(ROOT), which }); }

  if (url.pathname === '/api/list') {
    const dir = safe(url.searchParams.get('dir'));
    if (!dir) return json(res, 400, { error: 'bad path' });
    fs.readdir(dir, { withFileTypes: true }, (err, ents) => {
      if (err) return json(res, 200, []);
      json(res, 200, ents.filter(e => e.isFile()).map(e => { const s = fs.statSync(path.join(dir, e.name)); return { name: e.name, size: s.size, mtime: s.mtimeMs }; }));
    });
    return;
  }

  if (url.pathname === '/api/exists') {
    const p = safe(url.searchParams.get('path'));
    return json(res, 200, { exists: !!p && fs.existsSync(p) });
  }

  if (url.pathname === '/api/save' && req.method === 'POST') {
    const p = safe(url.searchParams.get('path'));
    if (!p || !canWrite(p)) return json(res, 400, { error: 'Can only save images/projects inside img/ or characters/' });
    const chunks = []; let size = 0;
    req.on('data', c => { size += c.length; if (size > 80 * 1024 * 1024) req.destroy(); else chunks.push(c); });
    req.on('end', () => {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      const tmp = p + '.part';
      fs.writeFile(tmp, Buffer.concat(chunks), err => {
        if (err) return json(res, 500, { error: err.message });
        fs.rename(tmp, p, err2 => err2 ? json(res, 500, { error: err2.message }) : json(res, 200, { ok: true, path: path.relative(ROOT, p).replace(/\\/g, '/') }));
      });
    });
    return;
  }

  // static files
  let p = safe(url.pathname === '/' ? app.page : url.pathname);
  if (!p) { res.writeHead(403); return res.end(); }
  fs.stat(p, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(p).pipe(res);
  });
});

function browser() {
  const cands = [
    path.join(process.env['ProgramFiles(x86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env.ProgramFiles || '', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env.ProgramFiles || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  return cands.find(c => c && fs.existsSync(c));
}

server.listen(0, '127.0.0.1', () => {
  port = server.address().port;
  const url = `http://127.0.0.1:${port}/${app.page}`;
  const exe = browser();
  if (!exe || process.env.DM_NO_BROWSER) { console.log('Open this in Chrome or Edge:', url); return; }
  // a separate profile per tool makes the window its own process, so we know when it closes
  const profile = path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'DeMortuisTools', which);
  const child = spawn(exe, [`--app=${url}`, `--user-data-dir=${profile}`, `--window-size=${app.size}`, '--no-first-run', '--no-default-browser-check', '--disable-features=Translate'], { stdio: 'ignore' });
  // The page pings every few seconds. If the browser handed our window to an already-open
  // instance, the child exits at once while the window lives on, so wait for the pings to stop.
  child.on('exit', () => setInterval(() => { if (Date.now() - lastPing > 20000) process.exit(0); }, 5000));
  child.on('error', e => { console.error(e); process.exit(1); });
});
