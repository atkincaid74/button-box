# Button Box Project

## Overview
A silly web app mimicking the "big button box" app from early iPhone days. Each button plays a sound when pressed. Built as a PWA for "add to home screen" functionality.

## Tech Stack
- Vanilla HTML/CSS/JS
- PWA with service worker
- Google Cloud Storage for hosting
- GitHub Actions for deployment

## Project Structure
```
/
├── index.html          # Main app file
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── sounds/            # Audio files directory
│   └── *.mp3         # Sound files
├── .gitignore
├── .gcloudignore
└── .github/workflows/ # GitHub Actions
```

## Buttons List
1. Boys Roll
2. Girls Roll
3. Здравствуйте
4. GMAFBP
5. нет
6. Pig Out
7. Double Leaning Jowler
8. Kids back down the mines ✓ (has MP3)
9. Enough
10. YEAHHHHH
11. Towel
12. Bop Em

## Development Commands
- Test locally: Open index.html in browser
- Deploy: Push to main branch (auto-deploys via GitHub Actions)

## Deployment
- Google Cloud Storage bucket with static hosting
- Custom domain support available
- GitHub Actions handles automatic deployment on push to main

## Notes
- Sounds should be in MP3 format
- Some buttons may use pictures instead of text
- Mobile-first responsive design
- Touch-friendly button sizes