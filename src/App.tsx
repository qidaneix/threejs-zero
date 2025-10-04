import { useCallback, useEffect, useRef } from 'react';
import { renderer } from './three';
import { EMode } from './interface';

const { domElement } = renderer;

const App = () => {
  const ref = useRef<HTMLDivElement>(null);
  const modeRef = useRef<EMode>(EMode.select);

  useEffect(() => {
    const divEle = ref.current;
    if (!divEle) return;

    divEle.replaceChildren();
    divEle.appendChild(domElement);
  }, []);

  // 键盘快捷键
  const keydownHandler = useCallback(function (event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case 'q': {
        modeRef.current = EMode.select;
        break;
      }
      case 'd': {
        modeRef.current = EMode.drawPolyline;
        break;
      }
      case 'b': {
        modeRef.current = EMode.drawBox;
        break;
      }
    }
  }, []);

  useEffect(() => {
    domElement.addEventListener('keydown', keydownHandler);

    return () => {
      domElement.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler]);

  return <div className="app" ref={ref} tabIndex={0} />;
};

export default App;
