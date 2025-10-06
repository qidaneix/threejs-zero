import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { EMode, EObject } from '../interface';
import { Polyline } from '../three/object/Polyline';
import { transformControls } from '../three/controls/transform';
import { DataBase } from '../DataBase';

export const useTransformPolyline = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  focusedAnnoRef: React.RefObject<Polyline | null>,
  [annos]: [Polyline[], React.Dispatch<React.SetStateAction<Polyline[]>>],
  [mode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  // 移动Sprite
  const objectChangeHandler = useCallback(
    function (event) {
      console.log('objectChange', event);
      const transformControls = event.target;
      const { object } = transformControls;
      const focusedAnno = focusedAnnoRef.current;
      if (!focusedAnno) throw new Error('sth wrong');

      const index = focusedAnno.getSprites().indexOf(object);
      if (object instanceof THREE.Sprite && index !== -1) {
        const newVector = object.position.clone();
        // 更新line
        const line = focusedAnno.getLine();
        const array = line.geometry.attributes.position.array;
        array[index * 3] = newVector.x;
        array[index * 3 + 1] = newVector.y;
        array[index * 3 + 2] = newVector.z;
        line.geometry.setAttribute('position', new THREE.BufferAttribute(array, 3));
        const points: [number, number, number][] = [];
        for (let i = 0; i < array.length; i += 3) {
          points.push([Number(array[i]), Number(array[i + 1]), Number(array[i + 2])]);
        }
        DataBase.update(focusedAnno.getId(), { points, type: EObject.polyline });
      }
    },
    [focusedAnnoRef],
  );

  // 鼠标点击
  const clickHandler = useCallback(
    function () {
      const focusedAnno = focusedAnnoRef.current;
      if (!(focusedAnno instanceof Polyline)) return;

      const sprites = focusedAnno.getSprites();
      const rayCaster = rayCasterRef.current;
      const intersections = rayCaster.intersectObjects(sprites);
      if (!intersections?.length) return;

      const sprite = intersections[0].object;
      const oldSprite = transformControls.object;
      if (sprite === oldSprite) return;

      transformControls.detach();
      transformControls.attach(sprite);
    },
    [focusedAnnoRef, rayCasterRef],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom || mode !== EMode.select) return;

    divDom.addEventListener('click', clickHandler);
    transformControls.addEventListener('objectChange', objectChangeHandler);

    return () => {
      divDom.removeEventListener('click', clickHandler);
      transformControls.removeEventListener('objectChange', objectChangeHandler);
    };
  }, [clickHandler, objectChangeHandler, mode, divRef]);
};
