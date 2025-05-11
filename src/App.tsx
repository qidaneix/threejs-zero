import { useEffect, useRef } from 'react';
import { init } from './webgpu';

export const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEle = ref.current;
    if (!canvasEle) return;

    init(canvasEle);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas
        width={document.body.clientWidth}
        height={document.body.clientHeight}
        ref={ref}
      />
    </div>
  );
};
