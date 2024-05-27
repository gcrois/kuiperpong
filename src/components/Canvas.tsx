import React, { useRef, useEffect, forwardRef } from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ width, height }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref ? (ref as React.MutableRefObject<HTMLCanvasElement>).current : canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Initial drawing
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
      }
    }
  }, [width, height, ref]);

  return <canvas ref={ref || canvasRef} width={width} height={height} />;
});

export default Canvas;
