<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar-inner">
        <NuxtLink to="/" class="brand">
          <div class="brand-main">
            <span class="brand-title">Hi Dev Tools</span>
            <span class="brand-sub">Hỗ trợ Dev · Hi FPT</span>
          </div>
        </NuxtLink>

        <nav class="nav">
          <NuxtLink to="/tinh-nang/request-api-online" class="nav-link">
            Request API
          </NuxtLink>
          <NuxtLink to="/tinh-nang/json-formatter" class="nav-link">
            JSON Formatter
          </NuxtLink>
          <NuxtLink to="/tinh-nang/html-viewer" class="nav-link">
            HTML Viewer
          </NuxtLink>
          <NuxtLink to="/tinh-nang/color-css" class="nav-link">
            Color CSS
          </NuxtLink>
          <NuxtLink to="/tinh-nang/jwt-decoder" class="nav-link">
            JWT Decoder
          </NuxtLink>
          <NuxtLink to="/tinh-nang/md5-generator" class="nav-link">
            MD5 Generator
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <div class="main-inner">
        <NuxtPage />
      </div>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-left">
          <p class="footer-title">Hi Dev Tools</p>
          <p class="footer-text">
            Bộ tool nhỏ hỗ trợ Dev nội bộ Hi FPT: test API, format JSON, preview HTML, decode JWT...
          </p>
        </div>
        <div class="footer-right">
          <p class="footer-meta">API base: {{ apiBase }}</p>
          <p class="footer-meta">SSR · Nuxt 3 · Vue 3</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
</script>

<style>
:root {
  /* Palette lấy cảm hứng từ Long Châu: xanh dương + cam, nền sáng */
  --primary: #0056a6;
  --primary-dark: #003c7a;
  --primary-soft: #e6f0ff;

  --accent: #f7931e;
  --accent-soft: #fff3df;

  --bg: #f5f7fb;
  --bg-soft: #ffffff;
  --card-bg: #ffffff;

  --border-soft: #d7e3f4;

  --text: #0f172a;
  --text-muted: #64748b;

  --danger: #dc2626;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#__nuxt {
  height: 100%;
}

body {
  margin: 0;
  font-family: system, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at top left, #ffffff, var(--bg)),
    radial-gradient(circle at bottom right, #ffffff, var(--bg));
}

/* HEADER */

.topbar {
  background: linear-gradient(90deg, var(--primary-dark), var(--primary));
  color: #ffffff;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.35),
    0 0 0 1px rgba(15, 23, 42, 0.15);
  position: sticky;
  top: 0;
  z-index: 20;
}

.topbar-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-main {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand-sub {
  font-size: 11px;
  opacity: 0.9;
}

.nav {
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.nav-link {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: #e0f2ff;
  border: 1px solid transparent;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: #ffffff;
  color: var(--primary-dark);
  border-color: #ffffff;
}

/* MAIN */

.main {
  flex: 1;
}

.main-inner {
  max-width: 1120px;
  margin: 18px auto 24px;
  padding: 0 16px 24px;
}

/* FOOTER */

.footer {
  border-top: 1px solid var(--border-soft);
  background: #ffffff;
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 16px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--text-muted);
}

.footer-left {
  flex: 1 1 220px;
}

.footer-right {
  flex: 0 0 auto;
  text-align: right;
}

.footer-title {
  margin: 0 0 4px;
  font-weight: 600;
  color: var(--primary-dark);
}

.footer-text {
  margin: 0;
}

.footer-meta {
  margin: 0;
}

/* GLOBAL CARD / PANEL hỗ trợ các page con dùng var(--card-bg) */

.panel,
.tool-page .panel {
  background: var(--card-bg);
  border-radius: 12px;
}

/* Responsive */

@media (max-width: 768px) {
  .topbar-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .nav {
    margin-left: 0;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .nav-link {
    white-space: nowrap;
  }

  .footer-inner {
    flex-direction: column;
    text-align: left;
  }

  .footer-right {
    text-align: left;
  }
}
</style>
