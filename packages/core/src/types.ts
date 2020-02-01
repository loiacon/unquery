import { StringifyOptions } from './stringify'

export enum UnqueryType {
  STRING = 1,
  NUMBER = 1 << 1,
  BOOL = 1 << 2,
  ARRAY = 1 << 3,
  DATE = 1 << 4
}
export type UnqueryArrayTypes = 'comma' | 'bracket' | 'index' | 'none'

export interface UnqueryDateOptions {
  pattern?: string
}

export interface UnqueryArrayOptions {
  arrayFormat?: UnqueryArrayTypes
}

export interface UnqueryOptions
  extends UnqueryArrayOptions,
    UnqueryDateOptions {
  parsePattern?: string
  encodePattern?: string
  skipNull?: boolean
  skipUnknown?: boolean
}

export type UnqueryObject<T extends object> = {
  [k in keyof T]?: T[k]
} & {
  stringify: (options?: StringifyOptions) => string
}

export type UnqueryTypeReturn = {
  type: UnqueryType
  innerType?: UnqueryTypeReturn
  pattern?: string
}
