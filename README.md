# Pong Game with Adjustable Settings

This is a basic Pong game implemented in TypeScript and React. The game allows you to adjust various settings such as paddle size, ball size, speed, noise type, and noise intensity. The game settings are encoded in the URL, allowing you to share the specific configuration with others. A live demo of the game can be found [here](gcrois.github.io/kuiperpong/).

## Features

- Adjustable paddle width and height
- Adjustable ball radius
- Adjustable speed of the ball
- Noise effects (static and Perlin noise)
- Adjustable noise intensity
- URL parameters for saving and sharing game configurations

## Controls

- Left Paddle: `W` (up) / `S` (down)
- Right Paddle: `Up Arrow` (up) / `Down Arrow` (down)

## URL Parameters

The game settings are encoded in the URL as query parameters:

- `paddleWidth`: Width of the paddles (default: 10)
- `paddleHeight`: Height of the paddles (default: 60)
- `ballRadius`: Radius of the ball (default: 5)
- `speed`: Speed of the ball (default: 2)
- `noiseType`: Type of noise (`static` or `perlin`) (default: `static`)
- `noiseIntensity`: Intensity of the noise (default: 0.1)

## Getting Started

### Prerequisites

- Node.js
- npm (or yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:gcrois/kuiperpong.git
   cd pong-game
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the game in your browser using the link provided in the console.

## Code Overview

### `src/App.tsx`

The main application component. It handles the settings controls and initializes the `PongGame` instance.

### `src/components/Canvas.tsx`

A simple React component for rendering the canvas element.

### `src/game/PongGame.ts`

The core game logic is implemented in this file. It handles rendering, game mechanics, and noise effects.

## License

This project is licensed under the MIT License.
