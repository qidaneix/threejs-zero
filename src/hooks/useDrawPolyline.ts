import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { IAnno } from '../interface';
import { EMode } from '../interface';
import { PolylineDrawer } from '../three/object/PolylineDrawer';

export const useDrawPolyline = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  [, setAnnos]: [IAnno[], React.Dispatch<React.SetStateAction<IAnno[]>>],
  [mode, setMode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const drawerRef = useRef<PolylineDrawer | null>(null);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectionRef = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (mode === EMode.drawPolyline) {
      drawerRef.current = new PolylineDrawer(new THREE.Vector3(0, 0, 0));
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
      const polylineDrawer = drawerRef.current;
      const plane = planeRef.current;
      const intersection = intersectionRef.current;

      ray.intersectPlane(plane, intersection);

      polylineDrawer?.updateLastPoint(intersection);
    },
    [rayCasterRef],
  );

  // 鼠标点击
  const clickHandler = useCallback(function () {
    const polylineDrawer = drawerRef.current;
    const intersection = intersectionRef.current;

    polylineDrawer?.addPoint(intersection);
  }, []);

  // 完成绘制
  const keydownHandler = useCallback(
    function (event: KeyboardEvent) {
      if (event.code.toLowerCase() === 'space') {
        const polyline = drawerRef.current!.finish();
        setAnnos((pre) => [...pre, polyline]);
        drawerRef.current?.dispose();
        drawerRef.current = null;
        setMode(EMode.select);
      }
    },
    [setMode, setAnnos],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom || mode !== EMode.drawPolyline) return;

    divDom.addEventListener('mousemove', mousemoveHandler);
    divDom.addEventListener('click', clickHandler);
    divDom.addEventListener('keydown', keydownHandler);

    return () => {
      divDom.removeEventListener('mousemove', mousemoveHandler);
      divDom.removeEventListener('click', clickHandler);
      divDom.removeEventListener('keydown', keydownHandler);
    };
  }, [clickHandler, mousemoveHandler, keydownHandler, mode, divRef]);

  return rayCasterRef;
};
