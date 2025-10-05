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
  annos: Polyline[],
  [mode, setMode]: [EMode, React.Dispatch<React.SetStateAction<EMode>>],
) => {
  const hoveredAnnoRef = useRef<Polyline | null>(null);
  const focusedAnnoRef = useRef<Polyline | null>(null);

  const cleanHoveredAnnoRef = useCallback(() => {
    const preAnno = hoveredAnnoRef.current;
    preAnno?.offHover();
    hoveredAnnoRef.current = null;
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
      if (!anno) return;

      anno.onHover();
      hoveredAnnoRef.current = anno;
    },
    [rayCasterRef, annos, cleanHoveredAnnoRef, divRef],
  );

  // 鼠标点击
  // const clickHandler = useCallback(
  //   function () {
  //     const rayCaster = rayCasterRef.current;
  //     const polylineDrawer = polylineDrawerRef.current;

  //     const ray = rayCaster.ray;
  //     const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  //     const intersection = findLinePlaneIntersection(ray, plane);

  //     console.log('intersection', intersection);
  //     if (intersection) polylineDrawer?.addPoint(intersection);
  //   },
  //   [rayCasterRef],
  // );

  // // 完成绘制
  // const keydownHandler = useCallback(
  //   function (event: KeyboardEvent) {
  //     if (event.code.toLowerCase() === 'space') {
  //       polylineDrawerRef.current?.finish();
  //       polylineDrawerRef.current?.dispose();
  //       polylineDrawerRef.current = null;
  //       setMode(EMode.select);
  //     }
  //   },
  //   [setMode],
  // );

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom || mode !== EMode.select) return;

    divDom.addEventListener('mousemove', mousemoveHandler);
    // divDom.addEventListener('click', clickHandler);
    // divDom.addEventListener('keydown', keydownHandler);

    return () => {
      divDom.removeEventListener('mousemove', mousemoveHandler);
      // divDom.removeEventListener('click', clickHandler);
      // divDom.removeEventListener('keydown', keydownHandler);
    };
  }, [mousemoveHandler, mode, divRef]);

  return rayCasterRef;
};
