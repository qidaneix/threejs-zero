import { renderer } from '../three/renderer';
import { camera } from '../three/camera';
import { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

export const useResize = (divRef: React.RefObject<HTMLDivElement | null>) => {
  const resizeObserver = useMemo(() => {
    return new ResizeObserver(
      debounce((entries) => {
        for (const entry of entries) {
          // 元素尺寸变化时触发
          const { width, height } = entry.contentRect;

          // 更新相机的宽高比
          camera.aspect = width / height;
          // 更新相机的投影矩阵
          camera.updateProjectionMatrix();
          // 更新渲染器尺寸
          renderer.setSize(width, height);
        }
      }, 300),
    );
  }, []);

  useEffect(() => {
    const divDom = divRef.current;
    if (!divDom) return;

    // --- 窗口自适应 ---
    resizeObserver.observe(divDom);

    return () => {
      resizeObserver.unobserve(divDom);
    };
  }, [resizeObserver, divRef]);
};
