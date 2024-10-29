import { FC } from "react";
import { MemViewArrayType } from "../../../../../../shared/enums/ArrayType";

export interface ArrayTypeProps {
  type: MemViewArrayType;
}

const ArrayType: FC<ArrayTypeProps> = (props) => {
  const renderType = (type: MemViewArrayType) => {
    if (type === MemViewArrayType.Array1d) {
      return (
        <>
          <div
            style={{
              fontSize: "20px",
              position: "relative",
            }}
          >
            1D
          </div>
        </>
      );
    } else if (type === MemViewArrayType.Array2d) {
      return (
        <>
          <div style={{ fontSize: "20px", position: "relative" }}>2D</div>
        </>
      );
    } else if (type === MemViewArrayType.Array2dFlat) {
      return (
        <>
          <div style={{ fontSize: "20px", position: "relative", top: "0px" }}>
            2D
          </div>
          <div style={{ fontSize: "10px", position: "relative", top: "-3px" }}>
            FLAT
          </div>
        </>
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "32px",
        height: "32px",
        alignItems: "center",
        justifyContent: "center",
        color: "#ddd",
        userSelect: "none",
      }}
    >
      {renderType(props.type)}
    </div>
  );
};
export default ArrayType;
