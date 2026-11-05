# App landing pages

A static website with a page for each app, plus a hub page linking them all. Each page has screenshots, features, install steps and a download button. Plain HTML, CSS and a little JavaScript: no build step, and it runs on any static host.

```
index.html          the hub: all seven apps
flowtask/           FlowTask (Android)
stockpilot/         StockPilot (Android)
scanly/             Scanly (Android)
wallora/            Wallora (Windows)
clipnest/           ClipNest (Windows)
sortify/            Sortify (Windows)
mediavault/         MediaVault (Windows)
assets/             shared styles (base.css) and behaviour (site.js)
config.js           where every Download button points  ← the one file to edit
downloads/          put the installers here (if you host them with the site)
```

## 1. Choose where the installers live

**Option A: next to the site.** Copy the seven files from `setup1.zip` and `setup2.zip` into `downloads/` (names are listed in `downloads/README.txt`). Done; nothing to edit.

**Option B: GitHub Releases (recommended for GitHub Pages).** GitHub refuses files over 100 MB in a normal repository, and six of these are bigger.
1. Create a release on GitHub for each app (or one "downloads" release).
2. Drag the installers into the release.
3. Right-click each uploaded file and copy its link.
4. Paste each link into `config.js`, for example:

```js
wallora: { url: "https://github.com/Wealthometer/wallora/releases/download/v1.1.0/Wallora-1.1.0-x64.exe" },
```

**Option C: Git LFS.** This repository tracks `.apk` and `.exe` files in `downloads/` with Git LFS. Install Git LFS and run `git lfs install`, then add the attributes and downloads (`git add .gitattributes downloads/`) so Git stores them as LFS objects before committing and pushing. Git LFS has separate storage and bandwidth quotas.

## 2. Put the site online

- **GitHub Pages:** push this folder to a repository, then turn on Settings → Pages (deploy from branch, `/` root).
- **Netlify / Vercel / Cloudflare Pages:** drag the folder in, or connect the repository. There's no build command, and the output folder is the root.

Open `index.html` straight from your disk to preview it. Fonts load from Google Fonts, so they need an internet connection.

## Notes

- **Checksums:** each page shows the SHA-256 of its installer, so people can check their download. If you replace an installer, update the hash on that page. To get a file's hash:
  - Windows (PowerShell): `Get-FileHash file.exe`
  - macOS and Linux: `sha256sum file`
- **Platform note:** visitors on the wrong device (an iPhone on an Android page, a Mac on a Windows page) see a short note saying what the download is for.
- **Install steps:** Windows may show a SmartScreen warning because the installers aren't code-signed yet, and Android needs "install unknown apps". Each page walks people through it.
