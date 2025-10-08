import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { camera } from '../three/camera';

export const useRayCaster = (divRef: React.RefObject<HTMLDivElement | null>) => {
  const rayCasterRef = useRef(new THREE.Raycaster());

  // 鼠标移动
  const mousemoveHandler = useCallback(function (event: MouseEvent) {
    const dom = event.currentTarget;
    if (!dom) return;

    const rect = (dom as HTMLDivElement).getBoundingClientRect();
    const rayCaster = rayCasterRef.current;

    // 原坐标
    const mouse = new THREE.Vector2(event.clientX - rect.left, event.clientY - rect.top);
    // 转换矩阵
    /* prettier-ignore */
    const matrix = new THREE.Matrix3(
        (2 / rect.width), 0, -1,
        0, (-2 / rect.height), 1,
        0, 0, 1,
      );
    /* prettier-ignore */
    // 目标坐标
    mouse.applyMatrix3(matrix);
    rayCaster.setFromCamera(mouse, camera);
  }, []);

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom) return;

    divDom.addEventListener('mousemove', mousemoveHandler);

    return () => {
      divDom.removeEventListener('mousemove', mousemoveHandler);
    };
  }, [mousemoveHandler, divRef]);

  return rayCasterRef;
};
