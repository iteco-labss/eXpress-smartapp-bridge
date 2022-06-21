/** @ignore */
const log = (...args: ReadonlyArray<unknown>) => {
  const text = args.map((arg: unknown): string => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ')
  alert(text)
}

export default log
