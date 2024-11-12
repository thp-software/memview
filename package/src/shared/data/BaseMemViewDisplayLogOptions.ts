import { MemViewDisplayLogOptions } from "../interfaces/MemViewDisplayLogOptions";
import { DeepPartial } from "../types/DeepPartial";

export const getBaseMemViewDisplayLogOptions = (): MemViewDisplayLogOptions => {
  return {
    isSync: false,
    isBreakpoint: false,
    waitFor: 1,
    position: { x: 0, y: 0 },
    backgroundColor: "#505050",
    elements: [],
  };
};

export const mergeBaseMemViewDisplayLogOptions = (
  toMerge?: Partial<MemViewDisplayLogOptions>
): MemViewDisplayLogOptions => {
  const base: MemViewDisplayLogOptions = getBaseMemViewDisplayLogOptions();
  if (toMerge) {
    return {
      ...base,
      ...toMerge,
      position: {
        ...base.position,
        ...toMerge.position,
      },
      elements: toMerge.elements ? toMerge.elements : base.elements,
    };
  } else {
    return base;
  }
};
