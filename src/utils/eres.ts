export const eres = <T>(promise: Promise<T>) => eresGeneric<T>(promise)

export function eresGeneric<T>(promise: Promise<T>): Promise<[null, T] | [any, null]> {
  return promise.then((result: T): [null, T] => [null, result]).catch((err): [any, null] => [err, null])
}
