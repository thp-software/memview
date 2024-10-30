import { KeyCode } from "../enums/KeyCode";

export interface KeyEvent {
  key: KeyCode;
  isPressed: boolean;
}
