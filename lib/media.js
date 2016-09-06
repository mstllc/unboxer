const path = require('path')

class Media {
  constructor (name, path, scenePath) {
    this._name = name
    this._path = path
    this._scenePath = scenePath
  }
}

class MediaFile extends Media {
  constructor (fileName, filePath, scenePath) {
    super(fileName, filePath, scenePath)

    this._ext = path.extname(fileName)
  }
}

class MediaFolder extends Media {
  constructor (folderName, folderPath, scenePath) {
    super(folderName, folderPath, scenePath)
  }
}

exports.mediaFile = (callback) => {
  return (fileName, filePath, scenePath) => {
    callback(new MediaFile(fileName, filePath, scenePath))
  }
}

exports.mediaFolder = (callback) => {
  return (fileName, filePath, scenePath) => {
    callback(new MediaFolder(fileName, filePath, scenePath))
  }
}
