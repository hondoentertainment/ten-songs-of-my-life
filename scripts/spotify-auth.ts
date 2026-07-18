/**
 * One-time helper to obtain a Spotify refresh token for playlist creation.
 *
 * 1. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
 * 2. Add http://127.0.0.1:3456/callback as a Redirect URI in your Spotify app
 * 3. Run: npm run spotify:auth
 * 4. Paste the printed SPOTIFY_REFRESH_TOKEN into .env.local
 */

import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { URL } from "url";

const PORT = 3456;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
].join(" ");

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local");
  }

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", REDIRECT);
  authUrl.searchParams.set("scope", SCOPES);

  console.log("\nOpen this URL in your browser:\n");
  console.log(authUrl.toString());
  console.log("\nWaiting for callback...\n");

  await new Promise<void>((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
        if (url.pathname !== "/callback") {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error || !code) {
          res.writeHead(400);
          res.end(`Auth failed: ${error ?? "missing code"}`);
          reject(new Error(error ?? "missing code"));
          server.close();
          return;
        }

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT,
        });

        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        if (!tokenRes.ok) {
          const text = await tokenRes.text();
          res.writeHead(500);
          res.end(text);
          reject(new Error(text));
          server.close();
          return;
        }

        const data = (await tokenRes.json()) as {
          refresh_token?: string;
          access_token: string;
        };

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>Spotify auth complete</h1><p>You can close this tab and return to the terminal.</p>",
        );

        console.log("Add this to .env.local:\n");
        console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token ?? "(none returned — re-consent)"}`);
        console.log("");

        server.close();
        resolvePromise();
      } catch (err) {
        reject(err);
        server.close();
      }
    });

    server.listen(PORT);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
