'use strict'
const STOARGE_KEY = 'memeDB'
var gMeme = {
 selectedImgId: 2,
 selectedLineIdx: 0,
 lines: [
  {
   txt: "",
   size: 30,
   color: "",
  },
 ],
}
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMemes() {
 return gMeme
}

function setLineTxt(newText) {
 let memeData = getMemes()
 memeData.lines[memeData.selectedLineIdx].txt = newText
}

function setImg(imgId) {
 gMeme.selectedImgId = imgId
}
function _savePlace() {
 saveToStorage(STOARGE_KEY, gMeme)
}
