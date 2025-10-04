import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { camera } from '../three/camera';
import { EMode } from '../interface';

export const useRayCaster = (
  divRef: React.RefObject<HTMLDivElement | null>,
  [mode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const rayCasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const pieceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const piece = document.createElement('div');
    piece.className = 'piece';
    pieceRef.current = piece;
  }, []);

  // 鼠标移动
  const mousemoveHandler = useCallback(
    function (event: MouseEvent) {
      const dom = event.currentTarget;
      if (!dom) return;

      const rect = (dom as HTMLDivElement).getBoundingClientRect();
      const rayCaster = rayCasterRef.current;

      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      rayCaster.setFromCamera(mouse, camera);

      const piece = pieceRef.current;
      if (!piece) return;

      // 绘画状态鼠标指针
      if (mode === EMode.select) {
        piece.style.display = 'none';
      } else {
        piece.style.display = 'block';
        piece.style.left = `${event.clientX}px`;
        piece.style.top = `${event.clientY}px`;
      }
    },
    [mode],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom) return;

    divDom.appendChild(pieceRef.current!);
    divDom.addEventListener('mousemove', mousemoveHandler);

    return () => {
      divDom.removeChild(pieceRef.current!);
      divDom.removeEventListener('mousemove', mousemoveHandler);
    };
  }, [mousemoveHandler, divRef]);

  return rayCasterRef;
};
