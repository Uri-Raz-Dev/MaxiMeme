'use strict'
const STOARGE_KEY = 'memesDB'

var gMeme = {
 selectedImgId: 21,
 selectedLineIdx: 0,
 lines: [
  {
   txt: 'Please enter text here',
   size: 30,
   color: '',
  },
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
 lines.push({
  txt: 'Please enter text here',
  size: 30,
  color: '',
 })
 return lines
}