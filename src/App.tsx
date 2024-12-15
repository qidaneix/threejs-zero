import { useEffect, useRef } from "react";
import { domElement } from "./three";

function App() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(domElement);
    }
  }, []);

  return <div ref={ref} />;
}

export default App;
