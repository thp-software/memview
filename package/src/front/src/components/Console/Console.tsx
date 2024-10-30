import { FC, useEffect, useRef, useState } from "react";
import { MemView } from "../../memview/MemView";
import { LogData } from "../../../../shared/interfaces/LogData";
import { LogLevel } from "../../../../shared/enums/LogLevel";
import { FixedSizeList as List } from "react-window";
import ArrayButton from "../ArrayButton/ArrayButton";
import SVGToBottom from "../../svg/toBottom";
import SVGPlay from "../../svg/play";
import { Tooltip } from "react-tooltip";

export interface ConsoleProps {
  memViewRef: MemView;
}

const Console: FC<ConsoleProps> = (props) => {
  const listRef = useRef<any>();

  const [logs, setLogs] = useState<LogData[]>([]);

  const [isOnBreakpoint, setIsOnBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    props.memViewRef.on("log", onLogs);

    return () => {
      props.memViewRef.off("log", onLogs);
    };
  }, []);

  useEffect(() => {
    if (listRef.current && listRef.current._outerRef) {
      const outerRef = listRef.current._outerRef;

      const { scrollTop, scrollHeight, clientHeight } = outerRef;

      const roundedScrollTop = Math.ceil(scrollTop);
      const roundedScrollHeight = Math.ceil(scrollHeight);
      const roundedClientHeight = Math.ceil(clientHeight);

      const isAtBottom =
        roundedScrollHeight - roundedScrollTop <= roundedClientHeight + 50;

      requestAnimationFrame(() => {
        if (isAtBottom) {
          listRef.current.scrollToItem(logs.length - 1, "start");
        }
      });
    }
  }, [logs]);

  const onLogs = (data: any[]) => {
    data.forEach((line) => {
      if (line.breakpoint) {
        setIsOnBreakpoint(true);
      }
    });
    setLogs((prev: LogData[]) => prev.concat(data));
  };

  const renderLog = (log: LogData) => {
    switch (log.level) {
      case LogLevel.log: {
        return (
          <>
            <span style={{ color: "#888" }}>
              {
                new Date(log.timestamp)
                  .toISOString()
                  .split("T")[1]
                  .split("Z")[0]
              }
            </span>
            {"  "} <span style={{ color: "#ffffff" }}>{log.value}</span>
          </>
        );
      }
      case LogLevel.warn: {
        return (
          <>
            <span style={{ color: "#888" }}>
              {
                new Date(log.timestamp)
                  .toISOString()
                  .split("T")[1]
                  .split("Z")[0]
              }
            </span>
            {"  "} <span style={{ color: "#ffae00" }}>{log.value}</span>
          </>
        );
      }
      case LogLevel.error: {
        return (
          <>
            <span style={{ color: "#888" }}>
              {
                new Date(log.timestamp)
                  .toISOString()
                  .split("T")[1]
                  .split("Z")[0]
              }
            </span>
            {"  "} <span style={{ color: "#ff0000" }}>{log.value}</span>
          </>
        );
      }
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% - 160px)",
        left: "400px",
        width: "calc(100% - 500px)",
        height: "150px",
        zIndex: 30,
        backgroundColor: "#000020c0",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "row",
        fontFamily: "Consolas",
        fontSize: "14px",
        padding: "5px 5px 5px 5px",
        gap: "5px",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div style={{ width: "32px", height: "32px" }}>
          <a
            data-tooltip-id="memView-console-tooltip"
            data-tooltip-content="Resume Breakpoint"
            data-tooltip-delay-show={500}
          >
            <ArrayButton
              isDisabled={!isOnBreakpoint}
              isOnBreakpoint={isOnBreakpoint}
              onClick={() => {
                setIsOnBreakpoint(false);
                props.memViewRef.resumeBreakpointLog();
              }}
            >
              <SVGPlay />
            </ArrayButton>
          </a>
        </div>
        <div style={{ width: "32px", height: "32px" }}>
          <a
            data-tooltip-id="memView-console-tooltip"
            data-tooltip-content="Scroll To Bottom"
            data-tooltip-delay-show={500}
          >
            <ArrayButton
              isDisabled={false}
              isOnBreakpoint={false}
              onClick={() => {
                listRef.current.scrollToItem(logs.length - 1, "start");
              }}
            >
              <SVGToBottom />
            </ArrayButton>
          </a>
        </div>
      </div>
      <List
        ref={listRef}
        height={150}
        itemCount={logs.length}
        itemSize={20}
        width={"calc(100% - 36px)"}
      >
        {({ index, style }) => (
          <div
            style={{
              ...style,
              lineHeight: "20px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {renderLog(logs[index])}
          </div>
        )}
      </List>
      <Tooltip id="memView-console-tooltip" />
    </div>
  );
};

export default Console;
