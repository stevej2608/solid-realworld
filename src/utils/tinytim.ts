
// https://github.com/premasagar/tim/

export const tim = (template: string, data: any): string => {
  const start = '{{'
  const end = '}}'
  const path = '[a-z0-9_][\\.a-z0-9_]*' // e.g. config.person.name

  const pattern = new RegExp(start + '\\s*(' + path + ')\\s*' + end, 'gi')

  return template.replace(pattern, (tag, token) => {
    const path = token.split('.') as string[]
    const len = path.length

    let lookup = data, i = 0

    for (; i < len; i++) {
      lookup = lookup[path[i]]
      if (lookup === undefined) {
        throw new Error("tim: '" + path[i] + "' not found in " + tag)
      }
      if (i === len - 1) {
        return lookup
      }
    }
  })
}

