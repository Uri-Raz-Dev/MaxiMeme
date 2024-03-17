'use strict'
const STOARGE_KEY = 'memesDB'

var gMeme = {
 selectedImgId: 21,
 selectedLineIdx: 0,
 lines: [
  {
   txt: '',
   size: 30,
   color: '',
  },
 ],
}

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMemes() {
 return gMeme
}

function setLineTxt(newText) {
 const memeData = getMemes()
 memeData.lines[memeData.selectedLineIdx].txt = newText
}

function setImg(imgId) {
 const [{ id }] = gImgs
 imgId = id
 gMeme.selectedImgId = imgId
}

function _saveMeme() {
 saveToStorage(STOARGE_KEY, gMeme)
}
