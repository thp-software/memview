import { getBaseMemViewArrayLogOptions } from "../data/BaseMemViewArrayLogOptions";
import { Anchor } from "../enums/Anchor";
import {
  MemViewMapper,
  MemViewMapperSendable,
} from "../interfaces/MemViewMapper";

export const encodeMapper = (mapper: MemViewMapper): MemViewMapperSendable => {
  try {
    const cellText = replaceAnchorsDynamically(mapper.cellText.toString());

    return {
      cellBackgroundColor: mapper.cellBackgroundColor.toString(),
      cellAtlasIndex: mapper.cellAtlasIndex.toString(),
      cellText,
      details: mapper.details.toString(),
    };
  } catch (e) {
    console.error(`Unable to encode mapper: ${e}`);

    // Fallback to default mapper
    const cellText = replaceAnchorsDynamically(
      getBaseMemViewArrayLogOptions().mapper.cellText.toString()
    );
    return {
      cellBackgroundColor:
        getBaseMemViewArrayLogOptions().mapper.cellBackgroundColor.toString(),
      cellAtlasIndex:
        getBaseMemViewArrayLogOptions().mapper.cellAtlasIndex.toString(),
      cellText,
      details: getBaseMemViewArrayLogOptions().mapper.details.toString(),
    };
  }
};

export const decodeMapper = (mapper: MemViewMapperSendable): MemViewMapper => {
  try {
    return {
      cellBackgroundColor: eval(`(${mapper.cellBackgroundColor})`),
      cellAtlasIndex: eval(`(${mapper.cellAtlasIndex})`),
      cellText: eval(`(${mapper.cellText})`),
      details: eval(`(${mapper.details})`),
    };
  } catch (e) {
    console.error(`Unable to decode mapper: ${e}`);

    // Fallback to default mapper
    return {
      cellBackgroundColor:
        getBaseMemViewArrayLogOptions().mapper.cellBackgroundColor,
      cellAtlasIndex: getBaseMemViewArrayLogOptions().mapper.cellAtlasIndex,
      cellText: getBaseMemViewArrayLogOptions().mapper.cellText,
      details: getBaseMemViewArrayLogOptions().mapper.details,
    };
  }
};

const replaceAnchorsDynamically = (input: string): string => {
  const regex = /import_memview\.Anchor\.(\w+),/g;

  return input.replace(regex, (_, p1) => {
    const replacement = `${Anchor[p1]},`;
    return replacement;
  });
};
