'use strict'

var gImgs = [{ id: 1, url: 'meme-imgs/2.jpg', keywords: ['funny', 'cat'] }]
var gMeme = {
 selectedImgId: 5,
 selectedLineIdx: 0,
 lines: [
  {
   txt: 'I sometimes eat Falafel',
   size: 20,
   color: 'red'
  }
 ]
}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
 const meme = gMeme

 return meme
}

