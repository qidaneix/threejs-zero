import { DataBase } from '../DataBase';
import { EObject } from '../interface';
import { useCallback } from 'react';
import { Polyline } from '../three/object/Polyline';
import { Cuboid } from '../three/object/Cuboid';
import { objectsGroup } from '../three/scene/group';
import type { I4Points, IPoint, IAnno } from '../interface';

export const useInit = () => {
  const init = useCallback(() => {
    const annos: IAnno[] = [];
    const list = DataBase.getList();
    objectsGroup.clear();
    list.forEach((obj) => {
      switch (obj.type) {
        case EObject.polyline: {
          const polyline = Polyline.create({
            id: obj.id as string,
            points: obj.points as IPoint[],
          });
          objectsGroup.add(polyline.getLine());
          annos.push(polyline);
          break;
        }
        case EObject.cuboid: {
          const cuboid = Cuboid.create({
            id: obj.id as string,
            points: obj.points as I4Points,
          });
          objectsGroup.add(cuboid.getMash());
          annos.push(cuboid);
          break;
        }
      }
    });

    return annos;
  }, []);

  return init;
};
