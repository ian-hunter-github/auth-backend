React Auth Demo Client (Material UI)

Local dev:

1) Start backend (repo root):
   ./scripts/netlify-dev.sh

2) Start demo client:
   cd demo-client
   npm install
   npm run dev

By default (no VITE_API_BASE_URL set), the demo client uses same-origin and Vite proxies:
  /.netlify/functions/*  ->  http://localhost:3999/.netlify/functions/*

Config (optional):

- VITE_API_BASE_URL: if set, the UI will call:
    ${VITE_API_BASE_URL}/.netlify/functions/*
  and Vite proxy target will also use this value.

Example:

  cat > demo-client/.env.local <<'EOF'
  VITE_API_BASE_URL=http://localhost:3999
  EOF
