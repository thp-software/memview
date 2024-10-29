export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepPartialExceptFunctions<T> = {
  [P in keyof T]?: T[P] extends (...args: any[]) => any
    ? T[P]
    : T[P] extends object
    ? DeepPartialExceptFunctions<T[P]>
    : T[P];
};
