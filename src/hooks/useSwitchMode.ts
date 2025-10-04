import { useCallback, useEffect, useState } from 'react';
import { EMode } from '../interface';

export const useSwitchMode = (
  divRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [mode, setMode] = useState<EMode>(EMode.select);

  // 键盘快捷键
  const keydownHandler = useCallback(function (event: KeyboardEvent) {
    switch (event.code.toLowerCase()) {
      case 'escape': {
        setMode(EMode.select);
        return;
      }
    }

    if (!event.ctrlKey) return;

    switch (event.key.toLowerCase()) {
      case 'q': {
        setMode(EMode.select);
        break;
      }
      case 'd': {
        setMode(EMode.drawPolyline);
        break;
      }
      case 'b': {
        setMode(EMode.drawBox);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom) return;

    divDom.addEventListener('keydown', keydownHandler);

    return () => {
      divDom.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler, divRef]);

  return [mode, setMode] as const;
};
