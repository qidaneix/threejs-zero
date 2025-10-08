import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { IAnno } from '../interface';
import { EMode } from '../interface';
import { objectsGroup } from '../three/scene/group';
import { transformControls } from '../three/controls/transform';
import { Cuboid } from '../three/object/Cuboid';

export const useSelect = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  [annos]: [IAnno[], React.Dispatch<React.SetStateAction<IAnno[]>>],
  [mode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const hoveredAnnoRef = useRef<IAnno | null>(null);
  const focusedAnnoRef = useRef<IAnno | null>(null);

  const cleanHoveredAnnoRef = useCallback(() => {
    const preAnno = hoveredAnnoRef.current;
    preAnno?.offHover();
    hoveredAnnoRef.current = null;
  }, []);

  const cleanFocusedAnnoRef = useCallback(() => {
    const preAnno = focusedAnnoRef.current;
    preAnno?.offFocus();
    focusedAnnoRef.current = null;
  }, []);

  // 鼠标hover
  const mousemoveHandler = useCallback(
    function () {
      cleanHoveredAnnoRef();

      const rayCaster = rayCasterRef.current;
      const objects = objectsGroup.children as THREE.Object3D[];

      const intersections = rayCaster.intersectObjects(objects);
      if (!intersections?.length) return;

      // TODO polyline选中更精准
      // const filteredIntersections = filterIntersections(
      //   intersections,
      //   camera,
      //   event,
      //   divRef.current!,
      // );
      // if (!filteredIntersections?.length) return;
      // const hoveredObject3D = filteredIntersections[0].object;

      const hoveredObject3D = intersections[0].object;
      const anno = annos.find((i) => i.getObject3D().uuid === hoveredObject3D.uuid);
      if (!anno) return;

      anno.onHover();
      hoveredAnnoRef.current = anno;
    },
    [rayCasterRef, annos, cleanHoveredAnnoRef],
  );

  // 鼠标点击
  const clickHandler = useCallback(
    function () {
      if (transformControls.dragging) return;

      const anno = hoveredAnnoRef.current;
      if (anno === focusedAnnoRef.current) return;

      cleanFocusedAnnoRef();
      if (!anno) return;

      anno.onFocus();
      focusedAnnoRef.current = anno;

      if (anno instanceof Cuboid) {
        transformControls.attach(anno.getMash());
      }
    },
    [cleanFocusedAnnoRef],
  );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom || mode !== EMode.select) return;

    divDom.addEventListener('mousemove', mousemoveHandler);
    divDom.addEventListener('click', clickHandler);

    return () => {
      divDom.removeEventListener('mousemove', mousemoveHandler);
      divDom.removeEventListener('click', clickHandler);
    };
  }, [mousemoveHandler, clickHandler, mode, divRef]);

  return focusedAnnoRef;
};
