export enum Zoom {
  Divide64 = 0,
  Divide32 = 1,
  Divide16 = 2,
  Divide8 = 3,
  Divide4 = 4,
  Divide2 = 5,
  Base = 6,
  Multiply2 = 7,
  Multiply4 = 8,
  Multiply8 = 9,
}

export const zooms: number[] = [
  0.015625, 0.03125, 0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8,
];
