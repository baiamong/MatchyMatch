# Pinball Game Specification

## Overview

Pinball is a classic arcade-style game where players control flippers to keep a ball in play on a tilted playfield. The objective is to score as many points as possible by hitting targets, bumpers, and ramps before the ball drains.

---

## Game Mechanics

### Ball Physics
- **Gravity**: Ball rolls downward toward the drain due to simulated gravity
- **Velocity**: Ball maintains momentum and speed based on collisions
- **Friction**: Slight friction slows the ball over time
- **Bounce**: Ball bounces off bumpers, walls, and other obstacles with realistic physics

### Flippers
- **Two flippers**: Left and right flippers at the bottom of the playfield
- **Controls**: 
  - Left flipper: `Z` key or left mouse click
  - Right flipper: `M` key or right mouse click
  - Mobile: Tap left/right side of screen
- **Activation**: Flippers rotate upward when activated, propelling the ball
- **Cooldown**: Brief cooldown between flips to prevent rapid-fire abuse

### Playfield Elements

#### Bumpers
- **Standard Bumpers**: Circular targets that bounce the ball and award points
- **Point Value**: 100 points per hit
- **Visual Feedback**: Flash and bounce animation on impact
- **Multiplier**: Bumper hits can increase score multiplier (up to 3x)

#### Ramps
- **Ramp Shots**: Angled paths that guide the ball to specific areas
- **Point Value**: 500-1000 points depending on ramp
- **Combo Bonus**: Hitting multiple ramps in sequence increases multiplier
- **Ramp Completion**: Completing all ramps awards 5000 bonus points

#### Targets
- **Drop Targets**: Targets that drop when hit and reset when all are hit
- **Point Value**: 250 points per target
- **Bank Completion**: Hitting all targets in a bank awards 2000 bonus points

#### Slingshots
- **Side Slingshots**: Spring-loaded targets on sides of playfield
- **Point Value**: 50 points per hit
- **Effect**: Propels ball back into play with high velocity

#### Drain
- **Ball Loss**: Ball drains at bottom center of playfield
- **Game Over**: Player loses one ball when ball drains
- **Tilt Warning**: Excessive tilting can cause game to tilt (loss of current ball)

---

## Scoring System

### Base Points
- Bumper hit: 100 points
- Slingshot hit: 50 points
- Target hit: 250 points
- Ramp shot: 500-1000 points

### Multipliers
- **Bumper Multiplier**: Increases with consecutive bumper hits (1x → 2x → 3x)
- **Ramp Multiplier**: Increases with consecutive ramp shots (1x → 2x → 3x)
- **Combo Multiplier**: Hitting different elements in sequence (up to 5x)

### Bonuses
- **Ramp Bank Completion**: 5000 points
- **Target Bank Completion**: 2000 points
- **Ball Saver**: Extra ball awarded at 50,000 points
- **High Score Bonus**: 10,000 points for beating previous high score

---

## Game States

### Start Screen
- Display title "PINBALL"
- Show high score
- Show current score
- "Press SPACE to Start" or "Click to Start"
- Display controls

### Active Play
- Playfield with ball and flippers
- Current score display (top)
- Balls remaining (top right)
- Multiplier indicator
- Real-time ball physics

### Ball Lost
- "BALL LOST" message
- Brief pause (1 second)
- Auto-launch next ball or show "Press SPACE to launch"
- Balls remaining counter updates

### Game Over
- "GAME OVER" message
- Final score display
- High score comparison
- "Play Again?" prompt
- Option to return to game menu

---

## Lives & Balls

### Ball Count
- Player starts with **3 balls**
- Extra ball awarded at 50,000 points
- Maximum 5 balls per game

### Ball Launch
- Ball auto-launches after 2 seconds of inactivity
- Manual launch: Press SPACE or click launch button
- Launch velocity: Consistent and predictable

---

## Controls

### Desktop
| Action | Key |
|--------|-----|
| Left Flipper | Z |
| Right Flipper | M |
| Launch Ball | SPACE |
| Tilt (slight) | Arrow Up |
| Pause | P |

### Mobile
| Action | Gesture |
|--------|---------|
| Left Flipper | Tap left side |
| Right Flipper | Tap right side |
| Launch Ball | Tap center |
| Pause | Tap pause button |

---

## Tilt Mechanic

### Tilt Meter
- Excessive tilting fills a tilt meter
- Meter displays as a bar or indicator
- Tilt actions: Pressing arrow keys, shaking device (mobile)

### Tilt Consequences
- **Warning**: First tilt warning at 50% meter
- **Tilt**: Game tilts at 100% meter
- **Effect**: Ball immediately drains, ball is lost
- **Reset**: Tilt meter resets when new ball launches

---

## Visual Design

### Playfield
- **Background**: Dark blue or black with gradient
- **Walls**: Bright neon colors (cyan, magenta, yellow)
- **Ball**: Shiny sphere with reflection
- **Flippers**: Bright colored bars (red/blue)
- **Bumpers**: Glowing circles with pulsing animation
- **Targets**: Rectangular shapes with color coding

### UI Elements
- **Score Display**: Large, bold font at top
- **Multiplier Badge**: Shows current multiplier (e.g., "2x")
- **Ball Counter**: Shows remaining balls (e.g., "⚫⚫⚫")
- **High Score**: Displayed at top right
- **Combo Counter**: Shows current combo streak

### Animations
- **Bumper Hit**: Flash + scale animation
- **Ball Drain**: Fade out animation
- **Score Pop-up**: Floating text showing points earned
- **Multiplier Increase**: Pulse animation on multiplier badge
- **Ramp Glow**: Ramp highlights when ball approaches

---

## Sound Design

### Sound Effects
- **Bumper Hit**: Boing/pop sound
- **Flipper Activation**: Whoosh sound
- **Slingshot**: Spring sound
- **Ball Drain**: Sad trombone or drain sound
- **Ramp Shot**: Success chime
- **Multiplier Increase**: Ascending tone
- **Game Over**: Game over jingle

### Background Music
- **Menu**: Upbeat arcade music
- **Gameplay**: Looping arcade-style background music
- **High Score**: Victory fanfare

### Volume Control
- Master volume slider
- Mute button
- Individual sound effect toggle

---

## Difficulty Levels

### Easy
- Larger flippers
- Slower ball speed
- More forgiving physics
- Longer ball saver window
- Extra ball at 30,000 points

### Normal
- Standard flipper size
- Standard ball speed
- Standard physics
- Standard ball saver window
- Extra ball at 50,000 points

### Hard
- Smaller flippers
- Faster ball speed
- Tighter physics
- Shorter ball saver window
- Extra ball at 75,000 points
- Tilt meter fills faster

---

## Persistence & High Scores

### Local Storage
- High score saved to browser localStorage
- High score persists across sessions
- Display "NEW HIGH SCORE!" when beaten

### Score Tracking
- Current session high score
- All-time high score
- Top 5 scores (optional)

---

## Mobile Responsiveness

### Screen Sizes
- **Desktop**: Full playfield display (800x1200px)
- **Tablet**: Scaled playfield (600x900px)
- **Mobile**: Vertical orientation, full-screen playfield

### Touch Controls
- Left/right tap zones clearly defined
- Haptic feedback on flipper activation (if available)
- Responsive touch detection with minimal latency

---

## Accessibility

### Keyboard Navigation
- All controls accessible via keyboard
- No mouse-only mechanics
- Clear visual feedback for all actions

### Color Contrast
- High contrast between elements
- Color-blind friendly palette options
- Text labels for all UI elements

### Screen Reader Support
- Score announcements
- Game state descriptions
- Control instructions

---

## Future Enhancements

- **Multiball Mode**: Multiple balls in play simultaneously
- **Missions**: Specific objectives to complete for bonus points
- **Leaderboard**: Online high score tracking
- **Themes**: Different playfield themes (space, underwater, etc.)
- **Power-ups**: Temporary gameplay modifiers
- **Achievements**: Badges for specific accomplishments
- **Replay System**: Save and replay high-scoring games

---

## Technical Implementation

### Technology Stack
- **Framework**: React
- **Physics Engine**: Babylon.js or Rapier (2D physics)
- **Rendering**: Canvas or WebGL
- **State Management**: React Hooks
- **Audio**: Web Audio API or Howler.js

### Performance Considerations
- 60 FPS target
- Efficient collision detection
- Optimized rendering pipeline
- Mobile performance optimization

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## File Structure

```
src/components/pinball/
├── Pinball.jsx           # Main game component
├── Pinball.css           # Game styles
├── PlayField.jsx         # Playfield rendering
├── Ball.jsx              # Ball physics and rendering
├── Flipper.jsx           # Flipper mechanics
├── Bumper.jsx            # Bumper component
├── Ramp.jsx              # Ramp component
├── Target.jsx            # Target component
├── ScoreDisplay.jsx      # Score UI
├── GameOver.jsx          # Game over screen
└── usePinballPhysics.js  # Physics hook
```

---

## Testing Checklist

- [ ] Ball physics and gravity
- [ ] Flipper activation and timing
- [ ] Collision detection accuracy
- [ ] Score calculation and multipliers
- [ ] Ball drain and game over
- [ ] Tilt mechanic
- [ ] High score persistence
- [ ] Mobile touch controls
- [ ] Sound effects
- [ ] Responsive design
- [ ] Keyboard controls
- [ ] Performance (60 FPS)
- [ ] Accessibility features

---

## Notes

- Game should feel responsive and arcade-like
- Physics should be realistic but forgiving for casual players
- Visual feedback is crucial for player engagement
- Sound design enhances the arcade experience
- Mobile experience should be as smooth as desktop
