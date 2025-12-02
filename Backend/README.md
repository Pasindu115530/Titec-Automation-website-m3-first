# Backend

Minimal backend for the project.

Prerequisites
- Node.js (16+ recommended)

Install

```powershell
Push-Location 'D:\My Projects\Titec-Automation-website-m3-first\Backend'
npm install
Pop-Location
```

Run

- Production:

```powershell
Push-Location 'D:\My Projects\Titec-Automation-website-m3-first\Backend'; npm start; Pop-Location
```

- Development (auto-reload with nodemon):

```powershell
Push-Location 'D:\My Projects\Titec-Automation-website-m3-first\Backend'; npm run dev; Pop-Location
```

Notes
- `nodemon` is installed as a dev dependency and `package.json` scripts use `index.js` as the entrypoint.
