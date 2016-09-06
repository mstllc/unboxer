exports.chopStringAtIdentifier = (str, id) => {
  let chopIdx = -1
  if (Array.isArray(id)) {
    id.forEach(i => {
      const idx = str.indexOf(i)
      if (idx > -1 && (chopIdx < 0 || idx < chopIdx)) {
        chopIdx = idx
      }
    })
  } else if (typeof id === 'string' || typeof id === 'number') {
    chopIdx = str.indexOf(id)
  }

  if (chopIdx > 0) {
    return str.substr(0, chopIdx)
  } else {
    return str
  }
}


// const ext = path.extname(filePath)
//   const filename = path.basename(filePath, ext)
//   const lowercase = filename.toLowerCase()
//   let chopIdx = filename.lastIndexOf('.')
//   suffixes.forEach(suffix => {
//     const idx = lowercase.indexOf(suffix)
//     if (idx > -1 && (chopIdx < 0 || idx < chopIdx)) {
//       chopIdx = idx
//     }
//   })
//
//   const name = filename
//     .substr(0, chopIdx)
//     .replace(/[\(\)\-\,\s]/g, '.')
//     .split('.')
//     .filter(part => (part !== ''))
//     .map(part => {
//       if (/^\d{4}$/.test(part)) {
//         return `(${part})`
//       }
//       return part
//     })
//     .join(' ')
//
//   return name || filename
