import { FC, ReactNode, useEffect, useRef } from "react";
import "./ArrayButton.css";

export interface ArrayButtonProps {
  children: ReactNode;
  isDisabled: boolean;
  isOnBreakpoint: boolean;
  onClick: () => void;
}

const ArrayButton: FC<ArrayButtonProps> = (props) => {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (borderRef.current) {
      if (!props.isOnBreakpoint) {
        borderRef.current.classList.remove("button-fade-out-border-breakpoint");

        void borderRef.current.offsetWidth;

        borderRef.current.classList.add("button-no-border");
      }

      if (props.isOnBreakpoint) {
        borderRef.current.classList.remove("button-no-border");
        borderRef.current.classList.add("button-fade-out-border-breakpoint");
      }
    }
  }, [props.isOnBreakpoint]);

  return (
    <div
      ref={borderRef}
      style={{
        width: "calc(100% - 4px)",
        height: "calc(100% - 4px)",
      }}
    >
      <button
        className="array-button"
        disabled={props.isDisabled}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
};
export default ArrayButton;
