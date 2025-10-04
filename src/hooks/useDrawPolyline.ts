import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { findLinePlaneIntersection } from '../utils/findLinePlaneIntersection';
import { EMode } from '../interface';

export const useDrawPolyline = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  mode: EMode,
) => {
  // 键盘快捷键
  const clickHandler = useCallback(
    function (event: MouseEvent) {
      const dom = event.currentTarget;
      if (mode !== EMode.drawPolyline || !dom) return;

      const rayCaster = rayCasterRef.current;

      const ray = rayCaster.ray;
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = findLinePlaneIntersection(ray, plane);
      console.log('intersection', intersection);
    },
    [mode, rayCasterRef],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom) return;

    divDom.addEventListener('click', clickHandler);

    return () => {
      divDom.removeEventListener('click', clickHandler);
    };
  }, [clickHandler, divRef]);

  return rayCasterRef;
};
