React Auth Demo Client (Material UI)

Local dev:

1) Start backend (repo root):
   npm run dev

2) Start demo client:
   cd demo-client
   npm install
   npm run dev

Config:

- VITE_API_BASE_URL: defaults to http://localhost:3999
- The client calls Netlify Functions at:
  ${VITE_API_BASE_URL}/.netlify/functions/*
