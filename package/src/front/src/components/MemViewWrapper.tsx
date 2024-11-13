import { useEffect, useRef, useState } from "react";
import { MemView } from "../memview/MemView";

import SidePanel from "./SideBar/SideBar";
import Console from "./Console/Console";

function MemViewWrapper() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const memViewRef = useRef<MemView | null>(null);
  const [isMemViewReady, setIsMemViewReady] = useState(false);

  const [showSidePanel, setShowSidePanel] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(false);

  useEffect(() => {
    if (containerRef.current) {
      memViewRef.current = new MemView(containerRef.current, window.location);
      setIsMemViewReady(true);

      memViewRef.current.on("options", onOptions);

      setShowSidePanel(memViewRef.current.options.showSideBar);
    }
    return () => {
      if (memViewRef.current) {
        memViewRef.current.off("options", onOptions);
        memViewRef.current.clean();
      }
    };
  }, []);

  const onOptions = (data: any) => {
    setShowSidePanel(data.showSideBar);
    setShowConsole(data.showConsole);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        ref={containerRef}
      />
      {isMemViewReady && memViewRef.current && showSidePanel && (
        <SidePanel memViewRef={memViewRef.current} />
      )}
      {isMemViewReady && memViewRef.current && showConsole && (
        <Console memViewRef={memViewRef.current} />
      )}
    </>
  );
}

export default MemViewWrapper;
