import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { findLinePlaneIntersection } from '../utils/findLinePlaneIntersection';
import { EMode } from '../interface';
import { PolylineDrawer } from '../three/object/PolylineDrawer';

export const useDrawPolyline = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  [mode, setMode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const polylineDrawerRef = useRef<PolylineDrawer | null>(null);

  useEffect(() => {
    if (mode === EMode.drawPolyline) {
      polylineDrawerRef.current = new PolylineDrawer(
        new THREE.Vector3(0, 0, 0),
      );
    } else {
      polylineDrawerRef.current?.dispose();
      polylineDrawerRef.current = null;
    }
  }, [mode]);

  // 鼠标划过
  const mousemoveHandler = useCallback(
    function () {
      const rayCaster = rayCasterRef.current;
      const polylineDrawer = polylineDrawerRef.current;

      const ray = rayCaster.ray;
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = findLinePlaneIntersection(ray, plane);

      if (intersection) polylineDrawer?.updateLastPoint(intersection);
    },
    [rayCasterRef],
  );

  // 鼠标点击
  const clickHandler = useCallback(
    function () {
      const rayCaster = rayCasterRef.current;
      const polylineDrawer = polylineDrawerRef.current;

      const ray = rayCaster.ray;
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = findLinePlaneIntersection(ray, plane);

      console.log('intersection', intersection);
      if (intersection) polylineDrawer?.addPoint(intersection);
    },
    [rayCasterRef],
  );

  // 完成绘制
  const keydownHandler = useCallback(
    function (event: KeyboardEvent) {
      if (event.code.toLowerCase() === 'space') {
        polylineDrawerRef.current?.finish();
        polylineDrawerRef.current?.dispose();
        polylineDrawerRef.current = null;
        setMode(EMode.select);
      }
    },
    [setMode],
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
