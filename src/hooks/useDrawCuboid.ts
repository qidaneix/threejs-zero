import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { IAnno } from '../interface';
import { EMode } from '../interface';
import { CuboidDrawer } from '../three/object/CuboidDrawer';

export const useDrawCuboid = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  [, setAnnos]: [IAnno[], React.Dispatch<React.SetStateAction<IAnno[]>>],
  [mode, setMode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const drawerRef = useRef<CuboidDrawer | null>(null);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectionRef = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (mode === EMode.drawCuboid) {
      drawerRef.current = new CuboidDrawer(new THREE.Vector3(0, 0, 0));
    } else {
      drawerRef.current?.dispose();
      drawerRef.current = null;
    }
  }, [mode]);

  // 鼠标划过
  const mousemoveHandler = useCallback(
    function () {
      const rayCaster = rayCasterRef.current;
      const { ray } = rayCaster;
      const cuboidDrawer = drawerRef.current;
      const plane = planeRef.current;
      const intersection = intersectionRef.current;

      ray.intersectPlane(plane, intersection);

      cuboidDrawer?.updateLastPoint(intersection);
    },
    [rayCasterRef],
  );

  // 鼠标点击 + 完成绘制
  const clickHandler = useCallback(
    function () {
      const cuboidDrawer = drawerRef.current;
      const intersection = intersectionRef.current;

      cuboidDrawer?.addPoint(intersection);

      const pointsCount = cuboidDrawer?.getPointsCount();
      if (typeof pointsCount === 'number' && pointsCount > 3) {
        const cuboid = drawerRef.current!.finish();
        setAnnos((pre) => [...pre, cuboid]);
        drawerRef.current?.dispose();
        drawerRef.current = null;
        setMode(EMode.select);
      }
    },
    [setAnnos, setMode],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom || mode !== EMode.drawCuboid) return;

    divDom.addEventListener('mousemove', mousemoveHandler);
    divDom.addEventListener('click', clickHandler);

    return () => {
      divDom.removeEventListener('mousemove', mousemoveHandler);
      divDom.removeEventListener('click', clickHandler);
    };
  }, [clickHandler, mousemoveHandler, mode, divRef]);

  return rayCasterRef;
};
