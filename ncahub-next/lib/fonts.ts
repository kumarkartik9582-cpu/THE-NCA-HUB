// Font CSS variables — fonts are loaded via <link> preconnect in layout.tsx
// This avoids build-time Google Fonts CDN fetching (blocked in some environments)
// In production, fonts load from Google Fonts on the client

export const fontHtmlClass = 'fonts-loaded'
