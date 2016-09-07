const async = require('async')
const path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec

class Media {
  constructor (name, path, scenePath) {
    this.name = name
    this.path = path
    this.ext = ''
    this.scenePath = scenePath
  }

  assertHasExtension (extensions, mediaPath) {
    return new Promise((resolve, reject) => {
      if (!mediaPath) mediaPath = this.path
      if (!Array.isArray(extensions)) extensions = [extensions]
      const mediaExt = path.extname(mediaPath).toLowerCase()
      let extIdx = -1
      async.eachOf(extensions, (extension, idx, callback) => {
        if (extension.toLowerCase() === mediaExt) {
          extIdx = idx
        }
        callback()
      }, error => {
        if (error) return reject(error)
        if (extIdx < 0) return reject(`No matching extension. File extension is '${mediaExt}'`)
        this.ext = extensions[extIdx]
        return resolve(this)
      })
    })
  }

  makePathToFileInFolder (folderPath) {
    return path.join(folderPath, this.name) + this.ext
  }

  linkMediaToPath (linkPath) {
    return new Promise((resolve, reject) => {
      fs.remove(linkPath, error => {
        if (error) return reject(error)
        fs.link(this.path, linkPath, error => {
          if (error) return reject(error)
          return resolve(this)
        })
      })
    })
  }
}

class MediaFile extends Media {
  constructor (fileName, filePath, scenePath) {
    super(fileName, filePath, scenePath)

    this.ext = path.extname(fileName)
    this.name = path.basename(fileName, this.ext)
  }
}

class MediaFolder extends Media {
  constructor (folderName, folderPath, scenePath) {
    super(folderName, folderPath, scenePath)

    this.files = []
  }

  refreshFileList () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.path, (error, files) => {
        if (error) {
          return reject(error)
        }

        this.files = files
        return resolve(this.files)
      })
    })
  }

  findFileWithExtension (extensions) {
    return new Promise((resolve, reject) => {
      this._indexForFileWithExtension(extensions, (error, fileIdx) => {
        if (error) return reject(error)
        if (fileIdx < 0) reject('Cant find file with supplied extensions.')

        this.path = path.join(this.path, this.files[fileIdx])
        this.ext = path.extname(this.files[fileIdx])
        this.name = path.basename(this.files[fileIdx], this.ext)
        return resolve(this)
      })
    })
  }

  unrarIfNecessary () {
    return new Promise((resolve, reject) => {
      this._indexForFileWithExtension('.rar', (error, fileIdx) => {
        if (error) return reject(error)
        if (fileIdx < 0) return resolve(this)

        exec(`unrar e -o+ ${path.join(this.path, this.files[fileIdx])} ${this.path}`, error => {
          if (error) return reject(error)

          this.refreshFileList()
            .then(() => (resolve(this)))
        })
      })
    })
  }

  _indexForFileWithExtension (extensions, callback) {
    if (!Array.isArray(extensions)) extensions = [extensions]
    let fileIdx = -1
    async.eachOf(this.files, (file, idx, callback) => {
      if (extensions.includes(path.extname(file).toLowerCase())) {
        fileIdx = idx
      }
      callback()
    }, error => {
      if (error) return callback(error)
      return callback(null, fileIdx)
    })
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
