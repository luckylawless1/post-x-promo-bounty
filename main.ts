// Post-X promo entry for make.fun's "Promote make.fun's make-your-own-bounty
// post on X" bounty. The entry itself is the X post: one post of your own
// that quotes make.fun's post (https://x.com/makefunai/status/2124915864336236646)
// or links to it, with a photo of its own attached and your play code in its
// text. This program does nothing but hand the post's address (POST.json) to
// the gate at /output/POST.json, after checking the address is a real X post
// URL — a placeholder or a malformed URL is refused loudly instead of being
// copied through. Node 22, standard library only.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_FILE = 'POST.json';

// A real X post address: https://x.com/<handle>/status/<digits>
// (twitter.com counts the same). The status id is digits only, and real
// post ids run long — anything under 10 digits is a typo or a placeholder.
const POST_URL = /^https:\/\/(x\.com|twitter\.com)\/[^/\s]+\/status\/\d{10,}$/;

const raw = readFileSync(join(BOT_DIR, POST_FILE), 'utf8');
const entry = JSON.parse(raw) as { url?: unknown };

if (typeof entry.url !== 'string' || !POST_URL.test(entry.url)) {
  console.error(
    `POST.json must hold {"url": "https://x.com/<handle>/status/<id>"}, got: ${raw.trim()}`,
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(join(BOT_DIR, POST_FILE), join(OUTPUT_DIR, POST_FILE));
console.log(`Entry post: ${entry.url}`);
