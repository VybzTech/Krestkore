# Deployment

Two branches, one Netlify site.

| Branch | What happens on push | Where it lands |
| ------ | -------------------- | -------------- |
| `main` | CI runs, then a Netlify **branch deploy** | `main--<site>.netlify.app` — staging, `noindex` |
| `prod` | CI runs, then a Netlify **production deploy** | Your Whogohost domain |

Nothing deploys unless typecheck, lint, tests and build all pass first. Until
the Netlify secrets exist, the deploy job verifies the build and stops with a
notice instead of failing.

---

## 1. Create the Netlify site

1. Netlify → **Add new site → Import an existing project → GitHub** → pick
   `VybzTech/Krestkore`.
2. Build command `npm run build`, publish directory `dist`. (Both are already
   in `netlify.toml`.)
3. **Site configuration → Build & deploy → Continuous deployment:**
   - Set **Production branch** to `prod`.
     Netlify defaults this to `main`. Leaving it would attach your live domain
     to the staging branch, which is backwards.
   - **Stop builds** (or set the build command to `echo skipped`).
     GitHub Actions does the building. If Netlify also auto-builds you get two
     builds per push, and they can race.

## 2. Add the two GitHub secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Where to get it |
| ------ | --------------- |
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → **New access token** |
| `NETLIFY_SITE_ID` | Site configuration → General → **Site ID** (an API ID/UUID) |

## 3. Create the production branch

```bash
git checkout -b prod
git push -u origin prod
```

From then on: work on `main`, review the preview URL, then promote.

```bash
git checkout prod
git merge --ff-only main
git push          # this is the release
git checkout main
```

Because `prod` only ever fast-forwards from `main`, what you tested on staging
is byte-for-byte what goes live.

## 4. Point the Whogohost domain at Netlify

Do this **after** the first successful `prod` deploy, so there is something to
serve.

1. Netlify → **Domain management → Add a domain** → enter your domain.
2. Netlify will then show you the exact DNS records or nameservers to use.
   **Copy the values from that screen.** They are per-site and Netlify has
   changed them before, so do not reuse values from any guide, including this
   one.
3. In Whogohost (cPanel → *Zone Editor*, or the domain's DNS panel), apply what
   Netlify showed you. You will be choosing one of two routes:

   - **Netlify DNS (simpler).** Replace the nameservers at Whogohost with the
     four Netlify gives you. Netlify then manages the whole zone and issues
     HTTPS automatically.
     Caveat: this moves *all* DNS, so if your email (MX records) is on
     Whogohost, recreate those records in Netlify first or mail will stop.

   - **External DNS (keeps Whogohost in charge).** Keep Whogohost's
     nameservers and add just the records Netlify lists — typically an `A` (or
     `ALIAS`/`ANAME`) record for the apex and a `CNAME` for `www`. Safer when
     Whogohost hosts your email.

4. Back in Netlify, wait for the domain to verify, then confirm **HTTPS →
   Let's Encrypt certificate** is issued. Propagation is usually minutes but
   can take up to 24h.
5. Set the primary domain (apex or `www`) so the other redirects to it.

## 5. Check it worked

```bash
curl -sI https://<your-domain> | head -n 12
```

Expect `HTTP/2 200` and the security headers.

Then confirm indexing is the right way round. Netlify sends `X-Robots-Tag:
noindex` on previews and branch deploys automatically, and `netlify.toml`
deliberately sets no robots header of its own, so:

```bash
# Live domain: must print NOTHING.
curl -sI https://<your-domain> | grep -i x-robots-tag

# Staging: must print noindex.
curl -sI https://main--<site>.netlify.app | grep -i x-robots-tag
```

If the live domain prints `noindex`, stop and fix it before announcing the
site: Google will drop it from the index.

---

## Notes

- **Formspree** is called directly from the browser, so no server env vars are
  needed. The endpoint lives in `src/data/site.ts`. The CSP in `netlify.toml`
  allows `connect-src https://formspree.io`; if you move to another form
  backend, update the CSP or submissions will be blocked silently.
- **Rollback:** Netlify → Deploys → pick a previous production deploy →
  *Publish deploy*. Instant, no rebuild.
- **The CSP is strict.** Adding an analytics or chat script means adding its
  origin to `script-src`/`connect-src` in `netlify.toml`, or it will be blocked.
