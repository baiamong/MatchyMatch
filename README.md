# Puzzlr — Word Matching Puzzle Game

## 🎮 Play the Game

**Live URL:** [https://baiamong.github.io/MatchyMatch/](https://baiamong.github.io/MatchyMatch/)

The game is automatically deployed to GitHub Pages whenever changes are merged to the main branch. Each deployment randomly selects one puzzle from the library of 20 available puzzles, so the specific puzzle you see may change after updates.

### Direct Game Links

You can link directly to any game in The Arcade by adding a `?game=` parameter to the URL. For example:

- **Kenny's Keno:** [https://baiamong.github.io/MatchyMatch/?game=kennykeno](https://baiamong.github.io/MatchyMatch/?game=kennykeno)
- **Wordle:** [https://baiamong.github.io/MatchyMatch/?game=wordle](https://baiamong.github.io/MatchyMatch/?game=wordle)
- **Snake:** [https://baiamong.github.io/MatchyMatch/?game=snake](https://baiamong.github.io/MatchyMatch/?game=snake)

The game parameter is case-insensitive, so `?game=KennyKeno` and `?game=kennykeno` both work. When you select a game from the picker, the URL automatically updates so you can bookmark or share the link.

**Available game IDs:**
`matchy`, `wordle`, `crunch`, `cross`, `chain`, `scramble`, `anagram`, `sudoku`, `trivia`, `memory`, `puppyfetch`, `catmatch`, `typerace`, `wordsearch`, `mathquiz`, `hangman`, `snake`, `spellingbee`, `2048`, `minesweeper`, `tictactoe`, `barrysblitz`, `gregsegg`, `nathanielninja`, `nickofttime`, `colourclash`, `flipflop`, `diceroll`, `flipcoin`, `kennykeno`, `chess`, `rochellespinner`, `martinimatch`, `manjual`, `latcham`, `geoffsgeometry`

---

## What is Puzzlr?

Puzzlr is a word-matching puzzle game where you group 20 words into 5 categories of 4 words each. Each category has a different difficulty level, marked by color:

- **Yellow** — Easiest
- **Green** — Easy
- **Blue** — Medium
- **Purple** — Hard
- **Pink** — Trickiest (lateral-thinking connections)

You have 5 lives to find all the groups. Select 4 words and submit your guess. If you're correct, the category is revealed. If you're wrong, you lose a life. The game includes a "one away" hint when you're close, and you can shuffle the remaining tiles at any time.

---

## 🚀 Local Development

Want to test changes on your own computer before they go live? Follow these steps:

### Prerequisites
- Node.js version 20 or higher
- npm (comes with Node.js)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Run Locally
Start the development server with hot module replacement (instant updates when you save changes):
```bash
npm run dev
```

Then open the URL shown in your terminal (typically `http://localhost:5173`).

### Build for Production
Create an optimized production build:
```bash
node scripts/pick-puzzle.js && npm run build
```

This randomly selects a puzzle and builds the game into the `dist` folder.

### Preview Production Build
Test the production build locally:
```bash
npm run preview
```

---

## 🧪 Testing

Run the automated test suite:
```bash
npm test
```

Run tests in watch mode (re-runs when files change):
```bash
npm run test:watch
```

Generate a coverage report:
```bash
npm run test:coverage
```

---

## 🔧 Code Quality

Check code style and catch common errors:
```bash
npm run lint
```

---

## 📦 Deployment

The game deploys automatically via GitHub Actions when code is pushed to the `main` branch. The deployment pipeline:

1. **Lints** the code to verify style consistency
2. **Runs tests** to catch bugs
3. **Randomly selects** a puzzle from the library
4. **Builds** the application into static files
5. **Deploys** to GitHub Pages at the URL above

### GitHub Pages Configuration

For deployment to work, GitHub Pages must be enabled in the repository settings:

1. Go to **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to "GitHub Actions"
3. Save the settings

Once configured, every push to `main` will trigger a new deployment.

---

## 📚 Documentation

- **[SPEC.md](SPEC.md)** — Complete game specification and rules
- **[TESTING.md](TESTING.md)** — Testing strategy and guidelines
- **[COLOUR_CLASH.md](COLOUR_CLASH.md)** — Colour Clash game mode documentation
- **[BARRYS_BLITZ.md](BARRYS_BLITZ.md)** — Barry's Blitz game mode documentation
- **[PINBALL.md](PINBALL.md)** — Pinball game mode documentation

---

## 🎯 Project Structure

```
MatchyMatch/
├── src/
│   ├── components/     # React components
│   ├── data/          # Puzzle data and configurations
│   ├── utils/         # Helper functions
│   └── App.jsx        # Main application component
├── scripts/
│   └── pick-puzzle.js # Random puzzle selection for builds
├── public/            # Static assets
├── .github/
│   └── workflows/
│       └── ci.yml     # CI/CD pipeline configuration
└── dist/              # Production build output (generated)
```

---

## 🐛 Troubleshooting

### The live URL shows a 404 error
- Check that GitHub Pages is enabled in repository settings
- Verify the deployment workflow has run successfully (check the Actions tab)
- Confirm the `base` path in `vite.config.js` matches the repository name

### The live URL shows a blank page
- Open browser developer tools (F12) and check the Console tab
- Look for asset loading errors — this usually means the `base` path is incorrect
- The `base` in `vite.config.js` should be `/MatchyMatch/`

### Local development server won't start
- Ensure Node.js version 20 or higher is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check for port conflicts — Vite uses port 5173 by default

### Tests are failing
- Run `npm ci` to ensure dependencies match the lock file exactly
- Check that `jest.config.js` and `jest.setup.js` are present
- Review test output for specific error messages

### Direct game link doesn't work
- Verify the game ID is correct (see list of available game IDs above)
- Game IDs are case-insensitive but must match one of the valid IDs
- Check browser console for any error messages

---

## 😄 A Little Joke

Why did the matching game break up with the memory game?

Because it kept finding someone **else** a perfect match! 🃏
