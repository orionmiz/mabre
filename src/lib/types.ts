// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Modelize<T extends (...args: any) => any> = NonNullable<
  Awaited<ReturnType<T>>
>;
