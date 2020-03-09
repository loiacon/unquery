export enum UnqueryType {
  STRING = 1,
  NUMBER = 1 << 1,
  BOOL = 1 << 2,
  ARRAY = 1 << 3,
  CUSTOM = 1 << 4
}
export type UnqueryArrayTypes = 'comma' | 'bracket' | 'index' | 'none'

export interface UnqueryArrayOptions {
  arrayFormat?: UnqueryArrayTypes
}

export interface UnqueryOptions extends UnqueryArrayOptions {
  skipNull?: boolean
  skipUnknown?: boolean
}

export type UnqueryObject<T extends object> = {
  [k in keyof T]?: T[k]
}

export type UnqueryTypeReturn = {
  type: UnqueryType
  innerType?: UnqueryTypeReturn
  customCallback?(value: string): never
}
