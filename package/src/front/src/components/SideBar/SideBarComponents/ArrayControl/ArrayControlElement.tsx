import { FC, useEffect, useRef } from "react";
import "./ArrayControlElement.css";
import ArrayType from "../ArrayType/ArrayType";
import ArrayButton from "../../../ArrayButton/ArrayButton";
import { Tooltip } from "react-tooltip";
import { MemViewArrayType } from "../../../../../../shared/enums/ArrayType";
import SVGUpdate from "../../../../svg/update";
import SVGFocus from "../../../../svg/focus";
import SVGPlay from "../../../../svg/play";

export interface ArrayControlElementProps {
  id: string;
  type: MemViewArrayType;
  lastUpdate: number;
  isOnBreakpoint: boolean;
  iteration: number;
  onFocus: (id: string) => void;
  onBreakpointResume: (id: string) => void;
}

const ArrayControlElement: FC<ArrayControlElementProps> = (props) => {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (borderRef.current) {
      borderRef.current.classList.remove("fade-out-border");

      void borderRef.current.offsetWidth;

      borderRef.current.classList.add("fade-out-border");
    }
  }, [props.lastUpdate]);

  return (
    <>
      <div
        id={`array-el-${props.id}`}
        ref={borderRef}
        style={{
          width: "calc(100% - 12px)",
          height: "80px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "calc(100% - 10px)",
            height: "40px",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#777",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "5px",
            paddingRight: "5px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "28px",
              fontSize: "16px",
              fontFamily: "Consolas",
              alignItems: "center",
              backgroundColor: "#00000020",
              paddingLeft: "4px",
              paddingRight: "4px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              marginRight: "5px",
            }}
          >
            {props.id.length > 23
              ? props.id.substring(0, 20) + "..."
              : props.id}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <ArrayType type={props.type} />
            </div>
          </div>
        </div>
        <div
          style={{
            width: "calc(100% - 8px)",
            height: "40px",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#333",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "4px",
            paddingRight: "4px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              flexDirection: "row",
              gap: "5px",
            }}
          >
            <a
              data-tooltip-id="array-control-tooltip"
              data-tooltip-content="Log Count"
              data-tooltip-delay-show={500}
            >
              <div
                style={{
                  width: "30px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SVGUpdate />
              </div>
            </a>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
                textAlign: "left",
              }}
            >
              {props.iteration}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
            <div style={{ width: "30px", height: "30px" }}>
              <a
                data-tooltip-id="array-control-tooltip"
                data-tooltip-content="Focus this array"
                data-tooltip-delay-show={500}
              >
                <ArrayButton
                  isDisabled={false}
                  isOnBreakpoint={false}
                  onClick={() => {
                    props.onFocus(props.id);
                  }}
                >
                  <SVGFocus />
                </ArrayButton>
              </a>
            </div>
            <div style={{ width: "30px", height: "30px" }}>
              <a
                data-tooltip-id="array-control-tooltip"
                data-tooltip-content="Resume breakpoint"
                data-tooltip-delay-show={500}
              >
                <ArrayButton
                  isDisabled={!props.isOnBreakpoint}
                  isOnBreakpoint={props.isOnBreakpoint}
                  onClick={() => {
                    props.onBreakpointResume(props.id);
                  }}
                >
                  <SVGPlay />
                </ArrayButton>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="array-control-tooltip" />
    </>
  );
};

export default ArrayControlElement;
