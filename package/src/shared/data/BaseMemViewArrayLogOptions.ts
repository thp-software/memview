import { MemViewArrayLogOptions } from "../interfaces/MemViewArrayLogOptions";
import { DeepPartialExceptFunctions } from "../types/DeepPartial";

export const getBaseMemViewArrayLogOptions = (): MemViewArrayLogOptions => {
  return {
    isSync: false,
    isBreakpoint: false,
    waitFor: 1,
    position: { x: 0, y: 0 },
    output: {
      onHover: () => {},
      onMouseDown: () => {},
      onMouseUp: () => {},
    },
    mapper: {
      cellBackgroundColor: () => {
        return "#333";
      },
      cellAtlasIndex: () => {
        return { x: 0, y: 0 };
      },
      cellText: () => {
        return [];
      },
      details: () => {
        return [];
      },
    },
  };
};

export const mergeBaseMemViewArrayLogOptions = (
  toMerge?: DeepPartialExceptFunctions<MemViewArrayLogOptions>
): MemViewArrayLogOptions => {
  const base: MemViewArrayLogOptions = getBaseMemViewArrayLogOptions();
  if (toMerge) {
    return {
      ...base,
      ...toMerge,
      position: {
        ...base.position,
        ...toMerge.position,
      },
      output: {
        ...base.output,
        ...toMerge.output,
      },
      mapper: {
        ...base.mapper,
        ...toMerge.mapper,
      },
    };
  } else {
    return base;
  }
};
