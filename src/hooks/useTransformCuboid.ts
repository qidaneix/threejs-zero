import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { EMode, EObject } from '../interface';
import type { IAnno, I4Points } from '../interface';
import { Cuboid } from '../three/object/Cuboid';
import { transformControls } from '../three/controls/transform';
import { DataBase } from '../DataBase';

export const useTransformCuboid = (
  divRef: React.RefObject<HTMLDivElement | null>,
  focusedAnnoRef: React.RefObject<IAnno | null>,
  [mode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  // 变换
  const objectChangeHandler = useCallback(
    function (event: THREE.Event) {
      const focusedAnno = focusedAnnoRef.current;
      if (!(focusedAnno instanceof Cuboid)) return;

      const transformControls = event.target;
      const { object } = transformControls;
      if (object instanceof THREE.Mesh) {
        const transformMatrix = object.matrix.clone();
        const p0 = new THREE.Vector3(0.5, 0.5, 0.5);
        const p1 = new THREE.Vector3(0.5, -0.5, 0.5);
        const p2 = new THREE.Vector3(0.5, -0.5, -0.5);
        const p6 = new THREE.Vector3(-0.5, -0.5, -0.5);
        p0.applyMatrix4(transformMatrix);
        p1.applyMatrix4(transformMatrix);
        p2.applyMatrix4(transformMatrix);
        p6.applyMatrix4(transformMatrix);

        const points: I4Points = [p0, p1, p2, p6].map((p) => [p.x, p.y, p.z]);

        DataBase.update(focusedAnno.getId(), { points, type: EObject.cuboid });
      }
    },
    [focusedAnnoRef],
  );

  // 键盘快捷键
  const keydownHandler = useCallback(
    function (event: KeyboardEvent) {
      const focusedAnno = focusedAnnoRef.current;
      if (!(focusedAnno instanceof Cuboid)) return;

      if (event.ctrlKey) return;

      switch (event.key.toLowerCase()) {
        case 't': {
          transformControls.setMode('translate');
          break;
        }
        case 'r': {
          transformControls.setMode('rotate');
          break;
        }
        case 's': {
          transformControls.setMode('scale');
          break;
        }
      }
    },
    [focusedAnnoRef],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom || mode !== EMode.select) return;

    divDom.addEventListener('keydown', keydownHandler);
    transformControls.addEventListener('objectChange', objectChangeHandler);

    return () => {
      divDom.addEventListener('keydown', keydownHandler);
      transformControls.removeEventListener('objectChange', objectChangeHandler);
    };
  }, [objectChangeHandler, keydownHandler, mode, divRef]);
};
