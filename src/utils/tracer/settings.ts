interface Settings {
  level?: number
}

let settings: Settings = {
  level: undefined
}

const close = function () {
  settings.level = Number.MAX_VALUE
}

const setLevel = function (level: number) {
  settings.level = level
}

const getLevel = function () {
  return settings.level
}

export { settings }
export { close }
export { setLevel }
export { getLevel }
