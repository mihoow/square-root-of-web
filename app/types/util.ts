export type ArrayItem<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Override<
    T extends Record<string, unknown>,
    Y extends Partial<Record<keyof T, unknown>>
> = Omit<T, keyof Y> & Y;

export type Must<T> = {
    [P in keyof T]-?: NonNullable<T[P]>
}
