import React, { useEffect, useRef, useState } from 'react';
import './styles/App.scss';
import Canvas from './components/Canvas';
import { PongGame } from './components/PongGame';

const App: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gameRef = useRef<PongGame | null>(null);

	const getSearchParam = (param: string, defaultValue: string): string => {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(param) || defaultValue;
	};

	const setSearchParam = (params: Record<string, string>) => {
		const urlParams = new URLSearchParams(window.location.search);
		Object.entries(params).forEach(([key, value]) => {
			urlParams.set(key, value);
		});
		window.history.replaceState(null, '', `?${urlParams.toString()}`);
	};

	const [paddleWidth, setPaddleWidth] = useState(() => parseInt(getSearchParam('paddleWidth', '10')));
	const [paddleHeight, setPaddleHeight] = useState(() => parseInt(getSearchParam('paddleHeight', '60')));
	const [ballRadius, setBallRadius] = useState(() => parseInt(getSearchParam('ballRadius', '5')));
	const [speed, setSpeed] = useState(() => parseInt(getSearchParam('speed', '2')));
	const [noiseType, setNoiseType] = useState<'static' | 'perlin'>(() => (getSearchParam('noiseType', 'static') as 'static' | 'perlin'));
	const [noiseIntensity, setNoiseIntensity] = useState(() => parseFloat(getSearchParam('noiseIntensity', '0.1')));

	useEffect(() => {
		setSearchParam({
			paddleWidth: paddleWidth.toString(),
			paddleHeight: paddleHeight.toString(),
			ballRadius: ballRadius.toString(),
			speed: speed.toString(),
			noiseType,
			noiseIntensity: noiseIntensity.toString(),
		});
	}, [paddleWidth, paddleHeight, ballRadius, speed, noiseType, noiseIntensity]);

	useEffect(() => {
		if (canvasRef.current) {
			gameRef.current = new PongGame(canvasRef.current, { paddleWidth, paddleHeight, ballRadius, speed, noiseType, noiseIntensity });
			gameRef.current.start();

			const handleKeyDown = (event: KeyboardEvent) => {
				switch (event.key) {
					case 'w':
						gameRef.current?.setPaddleLeftDirection(-4);
						break;
					case 's':
						gameRef.current?.setPaddleLeftDirection(4);
						break;
					case 'ArrowUp':
						gameRef.current?.setPaddleRightDirection(-4);
						break;
					case 'ArrowDown':
						gameRef.current?.setPaddleRightDirection(4);
						break;
				}
			};

			const handleKeyUp = (event: KeyboardEvent) => {
				switch (event.key) {
					case 'w':
					case 's':
						gameRef.current?.setPaddleLeftDirection(0);
						break;
					case 'ArrowUp':
					case 'ArrowDown':
						gameRef.current?.setPaddleRightDirection(0);
						break;
				}
			};

			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('keyup', handleKeyUp);
				gameRef.current?.stop();
			};
		}
	}, [paddleWidth, paddleHeight, ballRadius, speed, noiseType, noiseIntensity]);

	const resetGame = () => {
		gameRef.current?.reset();
	};

	return (
		<div className="App">
			<div className="controls">
				<div className="control-group">
					<label>Paddle Width:</label>
					<input
						type="number"
						value={paddleWidth}
						onChange={(e) => setPaddleWidth(parseInt(e.target.value, 10))}
					/>
				</div>
				<div className="control-group">
					<label>Paddle Height:</label>
					<input
						type="number"
						value={paddleHeight}
						onChange={(e) => setPaddleHeight(parseInt(e.target.value, 10))}
					/>
				</div>
				<div className="control-group">
					<label>Ball Radius:</label>
					<input
						type="number"
						value={ballRadius}
						onChange={(e) => setBallRadius(parseInt(e.target.value, 10))}
					/>
				</div>
				<div className="control-group">
					<label>Speed:</label>
					<input
						type="number"
						value={speed}
						onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
					/>
				</div>
				<div className="control-group">
					<label>Noise Type:</label>
					<select value={noiseType} onChange={(e) => setNoiseType(e.target.value as 'static' | 'perlin')}>
						<option value="static">Static</option>
						<option value="perlin">Perlin</option>
					</select>
				</div>
				<div className="control-group">
					<label>Noise Intensity:</label>
					<input
						type="number"
						step="0.01"
						value={noiseIntensity}
						onChange={(e) => setNoiseIntensity(parseFloat(e.target.value))}
					/>
				</div>
				<button onClick={resetGame}>Reset Game</button>
			</div>
			<Canvas ref={canvasRef} width={800} height={600} />
		</div>
	);
};

export default App;
