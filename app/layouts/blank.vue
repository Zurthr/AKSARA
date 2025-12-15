<template>
  <div class="embed-root antialiased min-h-screen">
    <slot />
  </div>
</template>

<style>
/* Override default body margins for seamless embedding */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Transparent background if you want the parent site color to show */
.embed-root {
  background: transparent;
}

/* Remove any default margins for embed content */
.embed-root * {
  box-sizing: border-box;
}

/* Embed shell */
.embed-root .embed-shell {
  --embed-bg: #f5f7fb;
  --embed-surface: #ffffff;
  --embed-surface-muted: #f8fafc;
  --embed-border: rgba(15, 23, 42, 0.08);
  --embed-text: #0f172a;
  --embed-subtle: #475569;
  --embed-accent: #3557ff;
  min-height: 100vh;
  padding: 24px 18px 28px;
  display: flex;
  justify-content: center;
  background:
    radial-gradient(180% 120% at 10% 10%, rgba(53, 87, 255, 0.08), transparent 45%),
    radial-gradient(150% 120% at 90% 0%, rgba(14, 165, 233, 0.06), transparent 40%),
    var(--embed-bg);
  color: var(--embed-text);
}

.embed-root .embed-shell.theme-dark {
  --embed-bg: #0b1224;
  --embed-surface: #0f172a;
  --embed-surface-muted: #111827;
  --embed-border: rgba(226, 232, 240, 0.08);
  --embed-text: #e2e8f0;
  --embed-subtle: #94a3b8;
  --embed-accent: #7dd3fc;
}

.embed-root .embed-shell.theme-blue {
  --embed-bg: #0f172a;
  --embed-surface: #0d1b33;
  --embed-surface-muted: #10203a;
  --embed-border: rgba(226, 232, 240, 0.1);
  --embed-text: #dbeafe;
  --embed-subtle: #9fb7df;
  --embed-accent: #38bdf8;
}

.embed-root .embed-frame {
  width: min(780px, 100%);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0)), var(--embed-surface);
  border: 1px solid var(--embed-border);
  border-radius: 18px;
  padding: 18px 18px 16px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 70px rgba(15, 23, 42, 0.18),
    0 4px 20px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(6px);
}

.embed-root .embed-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(65% 65% at 15% 20%, rgba(56, 189, 248, 0.08), transparent),
    radial-gradient(55% 55% at 85% 0%, rgba(59, 130, 246, 0.08), transparent);
  pointer-events: none;
}

.embed-root .embed-frame > * {
  position: relative;
  z-index: 1;
}

.embed-root .embed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.embed-root .embed-identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.embed-root .signal-dot {
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, var(--embed-accent), #7c3aed);
  border-radius: 50%;
  box-shadow: 0 0 0 6px rgba(53, 87, 255, 0.08);
}

.embed-root .embed-eyebrow {
  margin: 0;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--embed-subtle);
}

.embed-root .embed-heading {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--embed-text);
}

.embed-root .embed-subtitle {
  margin: 0 0 14px;
  color: var(--embed-subtle);
  font-size: 13px;
}

.embed-root .powered-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(120deg, rgba(53, 87, 255, 0.12), rgba(14, 165, 233, 0.12));
  border: 1px solid rgba(53, 87, 255, 0.25);
  color: var(--embed-text);
  font-size: 11px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: transform 0.16s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.embed-root .powered-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
  border-color: rgba(53, 87, 255, 0.4);
}

.embed-root .powered-logo {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1d4ed8, #38bdf8);
  display: grid;
  place-items: center;
  font-weight: 800;
  color: white;
  font-size: 12px;
}

.embed-root .powered-text {
  font-weight: 700;
}

.embed-root .embed-grid {
  display: grid;
  gap: 12px;
}

.embed-root .embed-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  background: var(--embed-surface);
  border: 1px solid var(--embed-border);
  border-radius: 14px;
  text-decoration: none;
  color: var(--embed-text);
  transition: transform 0.16s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  position: relative;
  overflow: hidden;
}

.embed-root .embed-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 45%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.embed-root .embed-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.14);
  border-color: rgba(53, 87, 255, 0.35);
}

.embed-root .embed-card:hover::before {
  opacity: 1;
}

.embed-root .embed-card .card-body {
  flex: 1;
  min-width: 0;
}

.embed-root .card-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;
}

.embed-root .card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.embed-root .card-description {
  margin: 0 0 6px;
  color: var(--embed-subtle);
  font-size: 13px;
  line-height: 1.45;
}

.embed-root .card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.embed-root .meta-chip {
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--embed-border);
  background: var(--embed-surface-muted);
  font-size: 11px;
  color: var(--embed-text);
}

.embed-root .subtle-chip {
  color: var(--embed-subtle);
}

.embed-root .rating-chip {
  padding: 4px 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

.embed-root .status-pill {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
  text-transform: capitalize;
  border: 1px solid var(--embed-border);
  color: var(--embed-text);
  background: var(--embed-surface-muted);
}

.embed-root .status-pill[data-status="upcoming"] {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.35);
  color: #16a34a;
}

.embed-root .status-pill[data-status="ongoing"] {
  background: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.35);
  color: #0ea5e9;
}

.embed-root .status-pill[data-status="completed"] {
  background: rgba(148, 163, 184, 0.18);
  border-color: rgba(148, 163, 184, 0.3);
  color: #94a3b8;
}

.embed-root .event-card::after,
.embed-root .resource-card::after {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  border-radius: 999px;
}

.embed-root .event-card::after {
  background: linear-gradient(180deg, #f97316, #ef4444);
}

.embed-root .resource-card::after {
  background: linear-gradient(180deg, #22d3ee, #2563eb);
}

.embed-root .cover-thumb {
  width: 64px;
  height: 84px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.16);
}

.embed-root .empty-state {
  text-align: center;
  padding: 24px 12px;
  border-radius: 14px;
  border: 1px dashed var(--embed-border);
  background: var(--embed-surface-muted);
  color: var(--embed-subtle);
  margin-top: 6px;
}

.embed-root .empty-state .emoji {
  font-size: 22px;
  margin-bottom: 6px;
}

/* Enhanced Modern Widget Styling */
.embed-root {
  /* Modern font stack with better rendering */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced card styling with modern depth and shadows */
.embed-root .group {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.75rem;
  position: relative;
}

.embed-root .group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
  border-color: rgba(59, 83, 121, 0.2);
}

/* Subtle gradient overlay on hover for premium feel */
.embed-root .group:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 83, 121, 0.02) 0%, rgba(59, 83, 121, 0.05) 100%);
  border-radius: 0.75rem;
  pointer-events: none;
  z-index: 0;
}

/* Ensure content stays above hover overlay */
.embed-root .group > * {
  position: relative;
  z-index: 1;
}

/* Enhanced header styling */
.embed-root .border-b {
  border-color: rgba(0, 0, 0, 0.08);
  position: relative;
}

.embed-root .border-b::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 83, 121, 0.1), transparent);
}

/* Improved typography with better hierarchy */
.embed-root h2 {
  letter-spacing: 0.05em;
  font-weight: 700;
  background: linear-gradient(135deg, currentColor 0%, rgba(59, 83, 121, 0.8) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.embed-root h3 {
  font-weight: 600;
  line-height: 1.4;
}

/* Enhanced image styling with better shadows */
.embed-root img {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.embed-root img:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}

/* Improved badge and tag styling */
.embed-root .border {
  border-width: 0.5px;
  backdrop-filter: blur(8px);
}

/* Enhanced "Powered by" link with better hover effects */
.embed-root a[href="/"] {
  background: linear-gradient(135deg, rgba(59, 83, 121, 0.1) 0%, rgba(59, 83, 121, 0.05) 100%);
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid rgba(59, 83, 121, 0.1);
}

.embed-root a[href="/"]:hover {
  background: linear-gradient(135deg, rgba(59, 83, 121, 0.15) 0%, rgba(59, 83, 121, 0.08) 100%);
  border-color: rgba(59, 83, 121, 0.2);
}

/* Smooth loading state animation */
.embed-root .text-gray-500 {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Enhanced empty state with better visual appeal */
.embed-root .text-center.py-8 {
  background: linear-gradient(135deg, rgba(59, 83, 121, 0.02) 0%, rgba(59, 83, 121, 0.05) 100%);
  border-radius: 1rem;
  border: 1px dashed rgba(59, 83, 121, 0.2);
}

/* Responsive improvements for mobile embeds */
@media (max-width: 640px) {
  .embed-root .group {
    padding: 0.75rem !important;
  }

  .embed-root .embed-shell {
    padding: 18px 12px 22px;
  }

  .embed-root .embed-frame {
    padding: 14px 14px 12px;
  }

  .embed-root .powered-text {
    display: none;
  }

  .embed-root .embed-card {
    flex-direction: column;
  }

  .embed-root h2 {
    font-size: 0.75rem !important;
  }

  .embed-root h3 {
    font-size: 0.875rem !important;
  }
}

/* Dark theme specific enhancements */
.embed-root .bg-gray-900 .group {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
}

.embed-root .bg-gray-900 .group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Blue theme specific enhancements */
.embed-root .bg-slate-800 .group {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.embed-root .bg-slate-800 .group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}
</style>
