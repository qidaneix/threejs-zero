import { useEffect, useRef } from 'react';
import { Tag } from 'antd';
import { renderer } from './three';
import { useResize } from './hooks/useResize';
import { useSwitchMode } from './hooks/useSwitchMode';
import { useRayCaster } from './hooks/useRayCaster';
import { useDrawPolyline } from './hooks/useDrawPolyline';

const { domElement } = renderer;

const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = ref.current;
    if (!divEle) return;

    divEle.replaceChildren();
    divEle.appendChild(domElement);
  }, []);

  useResize(ref);
  const [mode] = useSwitchMode(ref);
  const rayCasterRef = useRayCaster(ref, mode);
  useDrawPolyline(ref, rayCasterRef, mode);

  return (
    <>
      <div className="app" ref={ref} tabIndex={0} />
      <Tag color="blue" className="tag">
        {mode}
      </Tag>
    </>
  );
};

export default App;
