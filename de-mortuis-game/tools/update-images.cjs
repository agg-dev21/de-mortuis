// Update Story Images
// 1. Every picture in img/ is embedded into de-mortuis.twee so it also shows in Twine's Play/Test.
//    A new picture gets its own tag automatically: img/library-night.jpg -> tag a passage "bg-library-night".
// 2. img/title.webp (the logo) is refreshed too.
// 3. de-mortuis.html is rebuilt with Twine's own Harlowe engine.
// The img/ file stays listed before the embedded copy, so the published game always uses the latest file.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TWEE = path.join(ROOT, 'de-mortuis.twee');
const IMG = path.join(ROOT, 'img');
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const report = [];
const out = msg => report.push(msg);

function embedImages(src) {
  const files = fs.readdirSync(IMG).filter(f => MIME[path.extname(f).toLowerCase()] && f !== 'title.webp');
  const tagOf = f => 'bg-' + path.basename(f, path.extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dataUrl = f => `url(data:${MIME[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(path.join(IMG, f)).toString('base64')})`;
  let updated = 0, added = [];
  // refresh rules that point at a file
  src = src.replace(/(tw-story\[tags~="(bg-[\w-]+)"\]\s*\{\s*--bg:\s*)url\("img\/([^"]+)"\)(?:,\s*url\(data:[^)]*\))?(\s*;)/g, (all, pre, tag, file, post) => {
    if (!fs.existsSync(path.join(IMG, file))) return `${pre}url("img/${file}")${post}`;
    updated++; return `${pre}url("img/${file}"), ${dataUrl(file)}${post}`;
  });
  // add rules for pictures that don't have one yet
  const marker = 'tw-story[tags~="bg-black"]';
  for (const f of files) {
    if (src.includes(`url("img/${f}")`)) continue;
    const rule = `tw-story[tags~="${tagOf(f)}"] { --bg: url("img/${f}"), ${dataUrl(f)}; }\n`;
    if (!src.includes(marker)) throw new Error('Could not find where the background rules are in the stylesheet.');
    src = src.replace(marker, rule + marker); added.push(`${f}  ->  tag "${tagOf(f)}"`);
  }
  out(`Pictures embedded: ${updated + added.length}`);
  if (added.length) out('New pictures (tag passages with these):\n  ' + added.join('\n  '));
  // logo
  const logo = path.join(IMG, 'title.webp');
  if (fs.existsSync(logo)) src = src.replace(/(\.logo \{ background: )url\(data:image\/webp;base64,[^)]*\)/, `$1url(data:image/webp;base64,${fs.readFileSync(logo).toString('base64')})`);
  return src;
}

// Twine keeps its story formats inside resources/app.asar; read Harlowe's format.js straight out of it.
function harloweFormat() {
  const asar = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Twine', 'resources', 'app.asar');
  if (!fs.existsSync(asar)) return null;
  const fd = fs.openSync(asar, 'r'), head = Buffer.alloc(16); fs.readSync(fd, head, 0, 16, 0);
  const headerSize = head.readUInt32LE(4), jsonLen = head.readUInt32LE(12), jb = Buffer.alloc(jsonLen);
  fs.readSync(fd, jb, 0, jsonLen, 16);
  const tree = JSON.parse(jb.toString()), base = 8 + headerSize; let best = null;
  (function walk(n, p) {
    for (const k in n.files) {
      const c = n.files[k], q = p + '/' + k;
      if (c.files) walk(c, q);
      else { const m = q.match(/harlowe-(3\.\d+\.\d+)\/format\.js$/); if (m && (!best || m[1] > best.v)) best = { v: m[1], c }; }
    }
  })(tree, '');
  if (!best) return null;
  const buf = Buffer.alloc(best.c.size); fs.readSync(fd, buf, 0, best.c.size, base + Number(best.c.offset));
  let fmt; const window = { storyFormat: f => (fmt = f) }; new Function('window', buf.toString('utf8'))(window);
  return fmt;
}

function build(src, fmt) {
  const parts = src.replace(/\r\n/g, '\n').split(/^:: /m).slice(1);
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  let title = 'Story', data = {}, css = '', js = ''; const passages = [];
  for (const p of parts) {
    const nl = p.indexOf('\n'), head = p.slice(0, nl), body = p.slice(nl + 1).replace(/\s+$/, '');
    const m = head.match(/^(.*?)\s*(?:\[([^\]]*)\])?\s*(\{.*\})?\s*$/), name = m[1].trim(), tags = (m[2] || '').trim().split(/\s+/).filter(Boolean);
    if (name === 'StoryTitle') { title = body.trim(); continue; }
    if (name === 'StoryData') { data = JSON.parse(body); continue; }
    if (tags.includes('stylesheet')) { css += body + '\n'; continue; }
    if (tags.includes('script')) { js += body + '\n'; continue; }
    passages.push({ name, tags, body });
  }
  let start = 0;
  const pd = passages.map((p, i) => { if (p.name === data.start) start = i + 1; return `<tw-passagedata pid="${i + 1}" name="${esc(p.name)}" tags="${esc(p.tags.join(' '))}" position="${(i % 10) * 125},${Math.floor(i / 10) * 125}" size="100,100">${esc(p.body)}</tw-passagedata>`; }).join('');
  const sd = `<tw-storydata name="${esc(title)}" startnode="${start}" creator="Twine" creator-version="2.10.0" ifid="${data.ifid}" zoom="1" format="Harlowe" format-version="${fmt.version}" options="" hidden><style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css">${css}</style><script role="script" id="twine-user-script" type="text/twine-javascript">${js}</script>${pd}</tw-storydata>`;
  return fmt.source.replace(/\{\{STORY_NAME\}\}/g, () => esc(title)).replace(/\{\{STORY_DATA\}\}/g, () => sd);
}

try {
  if (!fs.existsSync(TWEE)) throw new Error('de-mortuis.twee is not in the game folder. In Twine use Build > Export as Twee and save it there.');
  fs.copyFileSync(TWEE, TWEE + '.bak');
  const src = embedImages(fs.readFileSync(TWEE, 'utf8'));
  fs.writeFileSync(TWEE, src);
  out('de-mortuis.twee updated (previous version kept as de-mortuis.twee.bak)');
  const fmt = harloweFormat();
  if (fmt) { fs.writeFileSync(path.join(ROOT, 'de-mortuis.html'), build(src, fmt)); out('de-mortuis.html rebuilt'); }
  else out('Twine not found, so de-mortuis.html was not rebuilt. Publish it from Twine instead.');
  out('\nNext: in Twine, Library > Import > de-mortuis.twee > replace.');
} catch (e) { out('Something went wrong: ' + e.message); process.exitCode = 1; }
const msg = report.join('\n');
console.log(msg);
if (process.argv[2]) fs.writeFileSync(process.argv[2], msg);
