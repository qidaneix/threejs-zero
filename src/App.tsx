import { useEffect, useRef } from "react";
import { domElement } from "./three";

const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = ref.current;
    if (!divEle) return;

    divEle.replaceChildren();
    divEle.appendChild(domElement);
  }, []);

  return <div ref={ref} />;
};

export default App;
