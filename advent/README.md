# n8n Advent Calendar – 24 Days of Workflows

A snowy three.js advent calendar. Each door hides an n8n workflow challenge.
No build step: three.js and fonts load from CDNs (jsDelivr, Google Fonts).

## Run
```bash
cd advent && python3 -m http.server 8123   # then open http://localhost:8123
```

## URL options
- `?demo=1` or `#demo` unlocks every door (preview)
- `?today=12-07` pretends it is that date

Doors unlock on their real December date. Progress is saved in `localStorage`.
Edit the challenges in `js/challenges.js`.
