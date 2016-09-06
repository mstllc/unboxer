// Jason.Bourne.2016.HC.720p.HDRip.X264.AC3-EVO.mkv

const acting = require('acting')
const media = require('./lib/media.js')
const path = require('path')

acting.scene(path.join(__dirname, 'passthepopcorn.me')).newFile(media.mediaFile(mediaFile => {
  console.log(mediaFile)
}))
