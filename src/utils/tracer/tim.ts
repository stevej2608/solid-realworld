/**
 * Tim (lite)
 * github.com/premasagar/tim
 *
 * A tiny, secure JavaScript micro-templating script.
 *
 * by Premasagar Rose
 * dharmafly.com
 * license
 * opensource.org/licenses/mit-license.php
 *
 * creates global object
 * tim
 *
 * v0.3.0
 */

export function tim(template: string, data: any) {
  const start = '{{'
  const end = '}}'
  const path = '[a-z0-9_$][\\.a-z0-9_]*' // e.g. config.person.name
  const pattern = new RegExp(start + '\\s*(' + path + ')\\s*' + end, 'gi')

  // Merge data into the template string
  return template.replace(pattern, function (tag, token) {
    const pathArray = token.split('.')
    let lookup = data
    for (let i = 0; i < pathArray.length; i++) {
      lookup = lookup[pathArray[i]]

      // Property not found
      if (lookup === undefined) {
        throw `tim: '${pathArray[i]}' not found in ${tag}`
      }

      // Return the required value
      if (i === pathArray.length - 1) {
        return lookup
      }
    }
  })
}
