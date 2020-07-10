/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UnqueryType {
  STRING = 1,
  NUMBER = 1 << 1,
  BOOL = 1 << 2,
  ARRAY = 1 << 3,
  CUSTOM = 1 << 4,
}
export type UnqueryArrayTypes = 'comma' | 'bracket' | 'index' | 'none'

export type UnqueryArrayOptions = {
  arrayFormat?: UnqueryArrayTypes
}

export type UnqueryOptions = UnqueryArrayOptions & {
  skipNull?: boolean
  skipUnknown?: boolean
}

export type UnqueryObject<T extends GenericObject> = {
  [k in keyof T]?: T[k]
}

export type UnqueryTypeReturn = {
  type: UnqueryType
  innerType?: UnqueryTypeReturn
  customCallback?(value: string): never
}

export type GenericObject<T = any> = Record<string, T>
