import { createNoise2D } from 'simplex-noise';

interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	dy: number;
}

interface Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
}

interface PongGameOptions {
	paddleWidth: number;
	paddleHeight: number;
	ballRadius: number;
	speed: number;
	noiseType: 'static' | 'perlin';
	noiseIntensity: number;
}

export class PongGame {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private paddleLeft: Paddle;
	private paddleRight: Paddle;
	private ball: Ball;
	private speed: number;
	private noiseType: 'static' | 'perlin';
	private noiseIntensity: number;
	private noise2D: (x: number, y: number) => number;
	private animationFrameId: number | null = null;
	private scoreLeft: number;
	private scoreRight: number;
	private frame: number;

	constructor(canvas: HTMLCanvasElement, options: PongGameOptions) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.paddleLeft = { x: 10, y: canvas.height / 2 - options.paddleHeight / 2, width: options.paddleWidth, height: options.paddleHeight, dy: 0 };
		this.paddleRight = { x: canvas.width - options.paddleWidth - 10, y: canvas.height / 2 - options.paddleHeight / 2, width: options.paddleWidth, height: options.paddleHeight, dy: 0 };
		this.ball = { x: canvas.width / 2, y: canvas.height / 2, radius: options.ballRadius, dx: options.speed, dy: options.speed };
		this.speed = options.speed;
		this.noiseType = options.noiseType;
		this.noiseIntensity = options.noiseIntensity;
		this.noise2D = createNoise2D();
		this.scoreLeft = 0;
		this.scoreRight = 0;
		this.frame = 0;
	}

	public start() {
		this.update();
	}

	public reset() {
		this.scoreLeft = 0;
		this.scoreRight = 0;
		this.resetBall();
	}

	private update() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawBlackBackground();
		this.drawPaddle(this.paddleLeft);
		this.drawPaddle(this.paddleRight);
		this.drawBall(this.ball);
		this.drawScores();
		this.drawControls();
		this.applyNoise();
		this.moveBall();
		this.movePaddles();
		this.checkCollisions();
		this.animationFrameId = requestAnimationFrame(() => this.update());
	}

	private drawBlackBackground() {
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// one pixel border around the canvas
		this.context.strokeStyle = 'white';
		this.context.strokeRect(1, 1, this.canvas.width - 1, this.canvas.height - 1);
	}

	private drawPaddle(paddle: Paddle) {
		this.context.fillStyle = 'white';
		this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	}

	private drawBall(ball: Ball) {
		this.context.beginPath();
		this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		this.context.fillStyle = 'white';
		this.context.fill();
		this.context.closePath();
	}

	private drawScores() {
		this.context.font = '48px sans-serif';
		this.context.fillStyle = 'white';
		this.context.textAlign = 'center';
		this.context.fillText(`${this.scoreLeft} - ${this.scoreRight}`, this.canvas.width / 2, 50);
	}

	private drawControls() {
		this.context.font = '16px sans-serif';
		this.context.fillStyle = 'white';
		this.context.textAlign = 'center';
		this.context.fillText('Left Paddle: W/S', this.canvas.width / 4, this.canvas.height - 20);
		this.context.fillText('Right Paddle: Up/Down Arrows', (this.canvas.width / 4) * 3, this.canvas.height - 20);
	}

	private moveBall() {
		this.ball.x += this.ball.dx;
		this.ball.y += this.ball.dy;

		if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
			this.ball.dy *= -1;
		}

		if (this.ball.x + this.ball.radius > this.canvas.width) {
			this.scoreLeft++;
			this.resetBall();
		}

		if (this.ball.x - this.ball.radius < 0) {
			this.scoreRight++;
			this.resetBall();
		}
	}

	private resetBall() {
		this.ball.x = this.canvas.width / 2;
		this.ball.y = this.canvas.height / 2;
		this.ball.dx = this.speed * (Math.random() > 0.5 ? 1 : -1);
		this.ball.dy = this.speed * (Math.random() > 0.5 ? 1 : -1);
	}

	private movePaddles() {
		this.paddleLeft.y += this.paddleLeft.dy;
		this.paddleRight.y += this.paddleRight.dy;

		// Prevent paddles from going out of bounds
		this.paddleLeft.y = Math.max(0, Math.min(this.canvas.height - this.paddleLeft.height, this.paddleLeft.y));
		this.paddleRight.y = Math.max(0, Math.min(this.canvas.height - this.paddleRight.height, this.paddleRight.y));
	}

	private checkCollisions() {
		// Check collision with left paddle
		if (
			this.ball.x - this.ball.radius < this.paddleLeft.x + this.paddleLeft.width &&
			this.ball.y > this.paddleLeft.y &&
			this.ball.y < this.paddleLeft.y + this.paddleLeft.height
		) {
			this.ball.dx *= -1;
			this.ball.x = this.paddleLeft.x + this.paddleLeft.width + this.ball.radius; // Prevent sticking
		}

		// Check collision with right paddle
		if (
			this.ball.x + this.ball.radius > this.paddleRight.x &&
			this.ball.y > this.paddleRight.y &&
			this.ball.y < this.paddleRight.y + this.paddleRight.height
		) {
			this.ball.dx *= -1;
			this.ball.x = this.paddleRight.x - this.ball.radius; // Prevent sticking
		}
	}
	private applyNoise() {
		this.frame++;
		const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		const data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			if (this.noiseType === 'static') {
				if (Math.random() < this.noiseIntensity) {
					// Flip the colors for static noise
					data[i] = 255 - data[i];     // Red
					data[i + 1] = 255 - data[i + 1]; // Green
					data[i + 2] = 255 - data[i + 2]; // Blue
				}
			} else if (this.noiseType === 'perlin') {
				const x = (i / 4) % this.canvas.width;
				const y = Math.floor((i / 4) / this.canvas.width);
				const noiseValue = this.noise2D(x * 0.01, y * 0.01 + this.frame * 0.01) * 0.5 + 0.5;
				if (noiseValue < this.noiseIntensity) {
					// Flip the colors for Perlin noise
					data[i] = 255 - data[i];     // Red
					data[i + 1] = 255 - data[i + 1]; // Green
					data[i + 2] = 255 - data[i + 2]; // Blue
				}
			}
		}
		this.context.putImageData(imageData, 0, 0);
	}


	public setPaddleLeftDirection(dy: number) {
		this.paddleLeft.dy = dy;
	}

	public setPaddleRightDirection(dy: number) {
		this.paddleRight.dy = dy;
	}

	public stop() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}
}
