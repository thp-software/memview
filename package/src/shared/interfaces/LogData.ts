import { LogLevel } from "../enums/LogLevel";

export interface LogData {
  timestamp: number;
  value: string;
  level: LogLevel;
  breakpoint: boolean;
}
