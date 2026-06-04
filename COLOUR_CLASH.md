# 🎨 Colour Clash

## Overview

**Colour Clash** is a fast-paced reaction game based on the classic **Stroop effect** — a psychological phenomenon where the brain struggles to process conflicting information. In this game, you'll see a colour word (e.g., "RED") displayed in a *different* ink colour (e.g., blue), and you must quickly tap the button matching the **ink colour**, not the word itself!

## How to Play

1. **Start the Game**: Click "Start Game" from the menu
2. **Read the Ink Colour**: You'll see a colour word displayed in a mismatched ink colour
3. **Tap the Correct Button**: Tap the button matching the **ink colour** (not the word)
4. **Beat the Clock**: You have 30 seconds to rack up as many correct answers as possible
5. **Get Faster**: Rounds speed up as you progress — stay sharp!

## Game Rules

- **Time Limit**: 30 seconds per game
- **Scoring**: 10 points per correct match
- **Correct Match**: You tap the button matching the ink colour → +10 points, next round starts
- **Wrong Match**: You tap the wrong button → no points, next round starts
- **Difficulty**: Rounds get progressively faster (starting at 2000ms, down to 600ms minimum)
- **Win Condition**: Maximize your score before time runs out

## Features

- ⚡ **Stroop Effect Challenge**: Fight your brain's natural instinct to read the word
- 🎨 **6 Vibrant Colours**: Red, Blue, Green, Yellow, Purple, Pink
- 📊 **Real-Time Stats**: Track score, streak, and remaining time
- 🎯 **Progressive Difficulty**: Rounds speed up as you play
- ✨ **Smooth Animations**: Visual feedback for correct/wrong answers
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⏰ **Time Pressure**: Visual warning when time is running low (turns red at 5 seconds)

## Scoring & Ratings

Your final rating depends on your score:

| Score | Rating | Emoji |
|-------|--------|-------|
| 30+   | Colour Master! | 🔥 |
| 20-29 | Blazing Fast! | ⚡ |
| 10-19 | Nice Work! | 🎯 |
| <10   | Keep Practicing! | 🎨 |

## Technical Details

### Component Structure
- **ColourClashBoard.jsx**: Main game component with all game logic

### Game States
- `menu`: Initial menu screen with instructions
- `playing`: Active gameplay with colour challenges
- `gameover`: Game ended with final stats

### Key Features
- React hooks for state management (useState, useEffect, useRef)
- 30-second countdown timer with auto-end
- Dynamic round timing that accelerates over time
- Real-time feedback system with animations
- Score popup animations
- Responsive grid layout for colour buttons

## Tips & Tricks

1. **Trust Your Instincts**: The Stroop effect is strong — your brain will try to read the word. Ignore it!
2. **Focus on Colour**: Squint or blur your vision slightly to focus on the colour rather than the text
3. **Stay Calm**: Don't panic as rounds speed up — take a breath and focus
4. **Practice**: The more you play, the better you'll get at overriding the Stroop effect
5. **Use Peripherals**: Try to catch the colour in your peripheral vision before reading the word

## Why "Colour Clash"?

The name captures the essence of the game: a **clash** between two competing pieces of information (the word vs. the colour). Your brain's automatic reading process clashes with your conscious decision to identify the ink colour instead!

## The Stroop Effect

The Stroop effect is a real psychological phenomenon discovered by John Ridley Stroop in 1935. It demonstrates that automatic processes (like reading) can interfere with controlled processes (like identifying colours). This game is a fun, interactive way to experience this fascinating aspect of human cognition!

---

**Challenge yourself and see how fast you can react! Can you beat the Stroop effect?** 🎨⚡
