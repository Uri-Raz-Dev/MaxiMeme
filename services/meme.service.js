'use strict'
const STOARGE_KEY = 'memesDB'
var gMeme = {
  selectedImgId: 21,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Enter Text Here',
      size: 32,
      color: 'black',
      fontFamily: 'Impact',
      posX: 0,
      posY: 0,
    }

  ],
}
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMemes() {
  return gMeme
}

function setLineTxt(lineTxt) {
  const meme = gMeme
  meme.lines[meme.selectedLineIdx].txt = lineTxt
}

function setImg(imgId) {

  const imgs = gImgs.find(img => {
    if (img.id === imgId)
      gMeme.selectedImgId = imgId
  })
  return imgs
}

function _saveMeme() {
  saveToStorage(STOARGE_KEY, gMeme)
}

function getLine(lineId) {
  const selectLine = gImgs.find(line => line.selectedLineIdx === lineId)
  return selectLine
}

function addTxtLine() {
  const { lines } = gMeme
  if (lines.length >= 10) return
  lines.push({
    txt: 'Enter Text Here',
    size: 32,
    color: 'black',
    fontFamily: 'Impact',

  })
  return lines
}

function deleteTxtLine(idx) {
  const { lines } = gMeme
  if (lines.length <= 1) return
  lines.splice(idx, 1)

  return lines
}




