const acting = require('acting')
const media = require('./lib/media.js')
const names = require('./lib/names.js')
const path = require('path')
const fs = require('fs-extra')

const VIDEO_EXTENSIONS = ['.mkv', '.avi', '.mp4']
const FINISHED_PATH = '/home/mst1228/finished'
const MOVIES_PATH = '/home/mst1228/Media/Movies'
const TV_PATH = '/home/mst1228/Media/TV'

acting.scene(path.join(FINISHED_PATH, 'passthepopcorn.me')).newFile(media.mediaFile(mediaFile => {
  mediaFile.assertHasExtension(VIDEO_EXTENSIONS)
    .then(() => (mediaFile.name = names.nameFromPTPFileName(mediaFile.name)))
    .then(() => (mediaFile.makePathToFileInFolder(MOVIES_PATH)))
    .then(finalPath => mediaFile.linkMediaToPath(finalPath))
    .catch(error => {
      console.log(error)
    })
}))

acting.scene(path.join(FINISHED_PATH, 'passthepopcorn.me')).newFolder(media.mediaFolder(mediaFolder => {
  mediaFolder.refreshFileList()
    .then(() => (mediaFolder.findFileWithExtension(VIDEO_EXTENSIONS)))
    .then(() => (mediaFolder.name = names.nameFromPTPFileName(mediaFolder.name)))
    .then(() => (mediaFolder.makePathToFileInFolder(MOVIES_PATH)))
    .then(finalPath => mediaFolder.linkMediaToPath(finalPath))
    .catch(error => {
      console.log(error)
    })
}))

acting.scene(path.join(FINISHED_PATH, 'sceneaccess.eu')).newFolder(media.mediaFolder(mediaFolder => {
  mediaFolder.refreshFileList()
    .then(() => (mediaFolder.unrarIfNecessary()))
    .then(() => (mediaFolder.findFileWithExtension(VIDEO_EXTENSIONS)))
    .then(() => (names.nameComponentsFromSAFileName(mediaFolder.name)))
    .then(nameComponents => {
      mediaFolder.name = `${nameComponents.showName} - ${nameComponents.seString}`
      return new Promise((resolve, reject) => {
        const seasonPath = path.join(TV_PATH, nameComponents.showName, `Season ${nameComponents.season}`)
        fs.mkdirs(seasonPath, error => {
          if (error) return reject(error)
          return resolve(seasonPath)
        })
      })
    })
    .then(seasonPath => (mediaFolder.makePathToFileInFolder(seasonPath)))
    .then(finalPath => mediaFolder.linkMediaToPath(finalPath))
    .catch(error => {
      console.log(error)
    })
}))
