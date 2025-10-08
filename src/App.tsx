import { useEffect, useState, useRef } from 'react';
import { Tag } from 'antd';
import { renderer } from './three';
import { useResize } from './hooks/useResize';
import { useSwitchMode } from './hooks/useSwitchMode';
import { useRayCaster } from './hooks/useRayCaster';
import { useDrawPolyline } from './hooks/useDrawPolyline';
import { useDrawCuboid } from './hooks/useDrawCuboid';
import { useInit } from './hooks/useInit';
import { useSelect } from './hooks/useSelect';
import { useTransformPolyline } from './hooks/useTransformPolyline';
import { useTransformCuboid } from './hooks/useTransformCuboid';
import type { IAnno } from './interface';

const { domElement } = renderer;

const App = () => {
  const ref = useRef<HTMLDivElement>(null);
  const init = useInit();
  const [annos, setAnnos] = useState<IAnno[]>([]);

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
  const focusedAnnoRef = useSelect(ref, rayCasterRef, [annos, setAnnos], [mode, setMode]);
  useTransformPolyline(ref, rayCasterRef, focusedAnnoRef, [mode, setMode]);
  useTransformCuboid(ref, focusedAnnoRef, [mode, setMode]);
  useDrawPolyline(ref, rayCasterRef, [annos, setAnnos], [mode, setMode]);
  useDrawCuboid(ref, rayCasterRef, [annos, setAnnos], [mode, setMode]);

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
