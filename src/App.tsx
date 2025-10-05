import { useEffect, useState, useRef } from 'react';
import { Tag } from 'antd';
import { renderer } from './three';
import { useResize } from './hooks/useResize';
import { useSwitchMode } from './hooks/useSwitchMode';
import { useRayCaster } from './hooks/useRayCaster';
import { useDrawPolyline } from './hooks/useDrawPolyline';
import { useInit } from './hooks/useInit';
import { useSelect } from './hooks/useSelect';
import { Polyline } from './three/object/Polyline';

const { domElement } = renderer;

const App = () => {
  const ref = useRef<HTMLDivElement>(null);
  const init = useInit();
  const [annos, setAnnos] = useState<Polyline[]>([]);

  useEffect(() => {
    const divEle = ref.current;
    if (!divEle) return;

    divEle.replaceChildren();
    divEle.appendChild(domElement);
    setAnnos(init());
  }, []);

  useResize(ref);
  const rayCasterRef = useRayCaster(ref);
  const [mode, setMode] = useSwitchMode(ref);
  useSelect(ref, rayCasterRef, annos, [mode, setMode]);
  useDrawPolyline(ref, rayCasterRef, [mode, setMode]);

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
