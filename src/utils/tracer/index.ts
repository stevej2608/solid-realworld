"use strict";
import { tracerSetup } from './console'
import type { Config, ITransport } from './console'
import { settings } from './settings'

export const close = settings.close
export const setLevel = settings.setLevel
export const getLevel = settings.getLevel
export { tracerSetup, ITransport, Config }

