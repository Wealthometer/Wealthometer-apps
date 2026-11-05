// Shared behaviour for every page: download links from config.js, a note when the visitor's
// device can't run this app, the screenshot lightbox, gallery arrows, copy-the-checksum, and
// sections that rise in as you scroll.
(function () {
  const cfg = window.DOWNLOADS || {};
  const root = new URL(document.documentElement.dataset.root || "./", location.href);

  // Every download button points at the address set for its app in config.js.
  document.querySelectorAll("[data-download]").forEach((a) => {
    const entry = cfg[a.dataset.download];
    if (!entry) return;
    a.href = /^https?:/i.test(entry.url) ? entry.url : new URL(entry.url, root).href;
    if (!/^https?:/i.test(entry.url)) a.setAttribute("download", entry.url.split("/").pop());
  });

  // A gentle heads-up when someone is on a device this app isn't for.
  const ua = navigator.userAgent;
  const platform = document.body.dataset.platform;
  const note = document.querySelector(".platform-note");
  if (note && platform) {
    const onAndroid = /Android/i.test(ua);
    const onIOS = /iPhone|iPad|iPod/i.test(ua);
    const onWindows = /Windows/i.test(ua);
    let msg = "";
    if (platform === "android" && onIOS) msg = "You're on an iPhone or iPad. This download is for Android phones and tablets.";
    else if (platform === "android" && !onAndroid) msg = "This is an Android app. Open this page on your Android phone to install it, or send the file to your phone.";
    else if (platform === "windows" && !onWindows) msg = "This installer is for Windows 10 and 11 (64-bit). Open this page on a Windows PC to install it.";
    if (msg) {
      note.querySelector("span").textContent = msg;
      note.classList.add("show");
    }
  }

  // Lightbox for screenshots.
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = '<img alt="">';
  document.body.appendChild(box);
  const big = box.querySelector("img");
  document.querySelectorAll("[data-zoom]").forEach((b) =>
    b.addEventListener("click", () => {
      big.src = b.dataset.zoom;
      big.alt = b.querySelector("img")?.alt || "";
      box.classList.add("open");
    }),
  );
  const close = () => box.classList.remove("open");
  box.addEventListener("click", close);
  addEventListener("keydown", (e) => e.key === "Escape" && close());

  // Gallery arrows.
  document.querySelectorAll("[data-gallery-prev], [data-gallery-next]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const g = document.getElementById(btn.dataset.galleryPrev || btn.dataset.galleryNext);
      const step = g.firstElementChild ? g.firstElementChild.getBoundingClientRect().width + 22 : 300;
      g.scrollBy({ left: btn.dataset.galleryPrev ? -step : step, behavior: "smooth" });
    }),
  );

  // Copy the SHA-256.
  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        const t = b.textContent;
        b.textContent = "Copied";
        setTimeout(() => (b.textContent = t), 1400);
      } catch {
        /* Clipboard blocked: the hash is still on screen to select. */
      }
    }),
  );

  // Rise in on scroll.
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
})();
