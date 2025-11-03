
# Collaborative Notes App
A standalone, deploy-ready frontend that provides collaborative notes using **localStorage + BroadcastChannel** (no backend required).

## Features
- Create, edit, delete notes
- Markdown editor with toolbar & preview (lazy-loaded)
- Real-time sync across tabs using `BroadcastChannel`
- Version history (timestamps, restore, delete)
- Clean, responsive UI with NextUI v2
- Modular store (Zustand)

## Run
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build
```bash
npm run build
npm start
```


# collaborative-note-app
