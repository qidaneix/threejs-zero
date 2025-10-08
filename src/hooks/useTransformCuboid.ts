import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { EMode, EObject } from '../interface';
import type { IAnno } from '../interface';
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
        console.log('event', event);
        // const newVector = object.position.clone();
        // // 更新line
        // const line = focusedAnno.getLine();
        // const array = line.geometry.attributes.position.array;
        // array[index * 3] = newVector.x;
        // array[index * 3 + 1] = newVector.y;
        // array[index * 3 + 2] = newVector.z;
        // line.geometry.setAttribute('position', new THREE.BufferAttribute(array, 3));
        // const points: [number, number, number][] = [];
        // for (let i = 0; i < array.length; i += 3) {
        //   points.push([Number(array[i]), Number(array[i + 1]), Number(array[i + 2])]);
        // }
        // DataBase.update(focusedAnno.getId(), { points, type: EObject.polyline });
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
