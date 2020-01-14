import { stringify } from './stringify'
import { addLocationURL, clearLocationURL } from './locationURL'

export enum UnqueryType {
  string = 1,
  number,
  bool,
  array,
  date
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
  skipNull?: boolean
  skipUnknown?: boolean
}

export type UnqueryObject<T extends object> = {
  [k in keyof T]?: T[k]
} & {
  stringify: typeof stringify
  addLocationURL: typeof addLocationURL
  clearLocationURL: typeof clearLocationURL
}

export type UnqueryTypeReturn = {
  type: UnqueryType
  innerType?: UnqueryTypeReturn
  pattern?: string
}
