import { MemViewLogOptions } from "../interfaces/MemViewLogOptions";
import { DeepPartial } from "../types/DeepPartial";

export const getBaseMemViewLogOptions = (): MemViewLogOptions => {
  return {
    doubleLog: false,
    isBreakpoint: false,
  };
};

export const mergeBaseMemViewLogOptions = (
  toMerge?: DeepPartial<MemViewLogOptions>
): MemViewLogOptions => {
  const base: MemViewLogOptions = getBaseMemViewLogOptions();
  if (toMerge) {
    return {
      ...base,
      ...toMerge,
    };
  } else {
    return base;
  }
};
