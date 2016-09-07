const SUFFIXES = ['720p', '1080p', '480p', 'hdtv', 'bluray', 'x264', 'dvdrip']

exports.nameFromPTPFileName = (fileName) => {
  const lowercaseName = fileName.toLowerCase().replace(/[\(\)\-\,\s]/g, '.')
  let cutIdx = -1
  SUFFIXES.forEach(suffix => {
    const idx = lowercaseName.indexOf(suffix.toLowerCase())
    if (idx > -1 && (cutIdx < 0 || idx < cutIdx)) {
      cutIdx = idx
    }
  })

  const name = fileName
    .substr(0, cutIdx)
    .split('.')
    .filter(part => (part !== ''))
    .map(part => {
      if (/^\d{4}$/.test(part)) {
        return `(${part})`
      }
      return part
    })
    .join(' ')

  return name || fileName
}

exports.nameComponentsFromSAFileName = (fileName) => {
  return new Promise((resolve, reject) => {
    const components = {}
    const seMatches = /s\d+e\d+/gi.exec(fileName)
    if (!seMatches) {
      return reject('Cant extract season/episode from filename.')
    }
    const eIdx = seMatches[0].toLowerCase().indexOf('e')
    components.seasonInt = +(seMatches[0].substring(1, eIdx))
    components.episodeInt = +(seMatches[0].substring(eIdx + 1))
    components.season = pad(components.seasonInt, 2)
    components.episode = pad(components.episodeInt, 2)
    components.seString = `S${components.season}E${components.episode}`
    components.showName = fileName.substring(0, seMatches.index).replace(/[\(\)\-\,\s]/g, '.').split('.').filter(part => (part !== '')).join(' ')

    return resolve(components)
  })
}

function pad (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
