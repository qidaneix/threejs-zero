import { useEffect, useRef } from 'react';
import { renderer } from './three';

const { domElement } = renderer;

export const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = ref.current;
    if (!divEle) return;

    divEle.replaceChildren();
    divEle.appendChild(domElement);
  }, []);

  return <div ref={ref} />;
};
