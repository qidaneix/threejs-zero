import { useEffect, useRef } from 'react';
import { main } from './WebGL';

const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = ref.current;
    if (!divEle) return;

    main(divEle);
  });

  return <div className="app" ref={ref} tabIndex={0} />;
};

export default App;
