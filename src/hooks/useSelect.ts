import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { Polyline } from '../three/object/Polyline';
import { EMode } from '../interface';
import { objectsGroup } from '../three/scene/group';
import { filterIntersections } from '../utils/filterIntersections';
import { camera } from '../three/camera';

export const useSelect = (
  divRef: React.RefObject<HTMLDivElement | null>,
  rayCasterRef: React.RefObject<THREE.Raycaster>,
  [annos]: [Polyline[], React.Dispatch<React.SetStateAction<Polyline[]>>],
  [mode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const hoveredAnnoRef = useRef<Polyline | null>(null);
  const focusedAnnoRef = useRef<Polyline | null>(null);

  const cleanHoveredAnnoRef = useCallback(() => {
    const preAnno = hoveredAnnoRef.current;
    hoveredAnnoRef.current = null;
    if (preAnno !== focusedAnnoRef.current) preAnno?.offHover();
  }, []);

  const cleanFocusedAnnoRef = useCallback(() => {
    const preAnno = focusedAnnoRef.current;
    preAnno?.offFocus();
    focusedAnnoRef.current = null;
  }, []);

  // 鼠标hover
  const mousemoveHandler = useCallback(
    function (event: MouseEvent) {
      cleanHoveredAnnoRef();

      const rayCaster = rayCasterRef.current;
      const objects = objectsGroup.children as THREE.Object3D[];

      const intersections = rayCaster.intersectObjects(objects);
      const filteredIntersections = filterIntersections(
        intersections,
        camera,
        event,
        divRef.current!,
      );
      if (!filteredIntersections?.length) return;

      const hoveredObject3D = filteredIntersections[0].object;
      const anno = annos.find(
        (i) => i.getObject3D().uuid === hoveredObject3D.uuid,
      );
      if (!anno || anno === focusedAnnoRef.current) return;

      anno.onHover();
      hoveredAnnoRef.current = anno;
    },
    [rayCasterRef, annos, cleanHoveredAnnoRef, divRef],
  );

  // 鼠标点击
  const clickHandler = useCallback(
    function () {
      cleanFocusedAnnoRef();

      const anno = hoveredAnnoRef.current;
      if (!anno) return;

      anno.onFocus();
      focusedAnnoRef.current = anno;
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

  return rayCasterRef;
};
