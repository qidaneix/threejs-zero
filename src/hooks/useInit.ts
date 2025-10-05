import { DataBase } from '../DataBase';
import { EObject } from '../interface';
import { useCallback } from 'react';
import { Polyline } from '../three/object/Polyline';
import { objectsGroup } from '../three/scene/group';

export const useInit = () => {
  const init = useCallback(() => {
    const annos: Polyline[] = [];
    const list = DataBase.getList();
    objectsGroup.clear();
    list.forEach((obj) => {
      switch (obj.type) {
        case EObject.polyline: {
          const polyline = Polyline.create(
            obj.points as [number, number, number][],
          );
          objectsGroup.add(polyline.getObject3D());
          annos.push(polyline);
          break;
        }
      }
    });

    return annos;
  }, []);

  return init;
};
