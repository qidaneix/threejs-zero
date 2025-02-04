import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"; // GUI

const eventObj = {
  Fullscreen() {
    // 全屏
    document.body.requestFullscreen();
    console.log("全屏");
  },
  ExitFullscreen() {
    // 退出全屏
    document.exitFullscreen();
    console.log("退出全屏");
  },
};

// 创建GUI
export const gui = new GUI();
gui.add(eventObj, "Fullscreen").name("全屏");
gui.add(eventObj, "ExitFullscreen").name("退出全屏");
