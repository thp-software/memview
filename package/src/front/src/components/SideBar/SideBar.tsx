import { FC, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { MemView } from "../../memview/MemView";
import ArrayControlElement from "./SideBarComponents/ArrayControl/ArrayControlElement";
import ArrayType from "./SideBarComponents/ArrayType/ArrayType";
import { MemViewArrayType } from "../../../../shared/enums/ArrayType";

export interface SideBarProps {
  memViewRef: MemView;
}

const SideBar: FC<SideBarProps> = (props) => {
  const [cell, setCell] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [arrays, setArrays] = useState<any[]>([]);

  useEffect(() => {
    setConnectionStatus(props.memViewRef.isConnected);

    props.memViewRef.on("connection_status", onConnectionStatus);
    props.memViewRef.on("cell", onCell);
    props.memViewRef.on("arrays_update", onArraysUpdate);

    return () => {
      props.memViewRef.off("connection_status", onConnectionStatus);
      props.memViewRef.off("cell", onCell);
      props.memViewRef.off("arrays_update", onArraysUpdate);
    };
  }, []);

  const onConnectionStatus = (data: any) => {
    setConnectionStatus(data);
  };

  const onCell = (data: any) => {
    setCell(data);
  };

  const onArraysUpdate = (data: any) => {
    setArrays(data);
    data.forEach((element: any) => {
      if (element.isOnBreakpoint) {
        scrollToDiv(`array-el-${element.id}`);
      }
    });
  };

  const scrollToDiv = (id: string) => {
    const element = document.getElementById(`${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderRenderArrayTime = (deltaTime: number) => {
    if (deltaTime >= 1000) {
      return <div>{(deltaTime / 1000).toFixed(2)} s</div>;
    } else {
      return <div>{deltaTime.toFixed(2)} ms</div>;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "300px",
        height: "100%",
        zIndex: 30,
        backgroundColor: "#000020c0",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Consolas",
        fontSize: "18px",
      }}
    >
      <div
        style={{
          width: "calc(100% - 20px)",
          height: "calc(60px - 20px)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#70707080",
          padding: "10px 10px 10px 10px",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            <img
              src="/logo_small.png"
              width={36}
              height={36}
              style={{ userSelect: "none" }}
              onDragStart={(e: any) => {
                e.preventDefault();
              }}
            />
          </div>
          <div
            style={{
              fontSize: "30px",
              fontFamily: "Consolas",
              alignItems: "center",
              justifyContent: "center",
              color: "#c0c0c080",
            }}
          >
            MemView
          </div>
        </div>
        <a
          data-tooltip-id="memView-wrapper-tooltip"
          data-tooltip-content="Server Status"
          data-tooltip-delay-show={500}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "1px solid black",
              backgroundColor: connectionStatus ? "#60bf60" : "#e05b5b",
            }}
          />
        </a>
      </div>
      <div
        style={{
          width: "100%",
          height: "fit-content",
          maxHeight: "40%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          paddingTop: "10px",
          paddingBottom: "10px",
          alignItems: "center",
          overflowY: "auto",
          backgroundColor: "#00000080",
        }}
      >
        {arrays.map((el) => {
          return (
            <ArrayControlElement
              key={el.id}
              onBreakpointResume={() => {
                props.memViewRef.resumeBreakpoint(el.id);
              }}
              onFocus={() => {
                props.memViewRef.focusArray(el.id);
              }}
              id={el.id}
              lastUpdate={el.lastUpdate}
              iteration={el.iteration}
              type={el.type}
              isOnBreakpoint={el.isOnBreakpoint}
            />
          );
        })}
      </div>
      <>
        <div
          style={{
            width: "calc(100% - 10px)",
            height: "calc(40px - 10px)",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#70707080",
            padding: "5px 5px 5px 5px",
            gap: "20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {cell && (
            <>
              <div
                style={{
                  fontSize: "18px",
                  fontFamily: "Consolas",
                  alignItems: "center",
                }}
              >
                {cell.id.length > 23
                  ? cell.id.substring(0, 20) + "..."
                  : cell.id}
              </div>
              <ArrayType type={cell.type} />
            </>
          )}
        </div>
        <div
          style={{
            width: "calc(100% - 10px)",
            height: "14px",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#60606080",
            padding: "5px 5px 5px 5px",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#aaa",
          }}
        >
          {cell && (
            <>
              {cell.type === MemViewArrayType.Array1d ? (
                <div>Size</div>
              ) : (
                <div>Size</div>
              )}
              <div>
                {cell.size.x} x {cell.size.y}
              </div>
            </>
          )}
        </div>
        <div
          style={{
            width: "calc(100% - 10px)",
            height: "14px",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#60606080",
            padding: "5px 5px 5px 5px",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#aaa",
          }}
        >
          {cell && (
            <>
              <div>Render</div>
              <div>{renderRenderArrayTime(cell.lastRenderTime)}</div>
            </>
          )}
        </div>
        <div>
          <div
            style={{
              width: "calc(100% - 10px)",
              height: "20px",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#50505080",
              padding: "5px 5px 5px 5px",
              justifyContent: "center",
            }}
          >
            {cell && (
              <>
                <div style={{ width: "40%", height: "100%" }}>
                  x: {cell.position.x}
                </div>
                <div style={{ width: "40%", height: "100%" }}>
                  y: {cell.position.y}
                </div>
              </>
            )}
          </div>
          <div
            style={{
              width: "calc(100% - 20px)",
              fontSize: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              margin: "5px 5px 5px 5px",
              padding: "5px 5px 5px 5px",
            }}
          >
            {cell && cell.detailsRaw.length > 0
              ? cell.detailsRaw.map((el: string) => <div>{el}</div>)
              : "No Data"}
          </div>
        </div>
      </>
      <Tooltip id="memView-wrapper-tooltip" />
    </div>
  );
};

export default SideBar;
