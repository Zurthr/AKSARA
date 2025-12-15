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