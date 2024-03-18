'use strict'

var gImgNum = 1

var gImgs = [{ id: 1, url: `meme-imgs/${gImgNum}.jpg`, keywords: ['cute', 'funny'] }]
_createGallery()

function getImgs() {
 const imgs = gImgs
 return imgs
}


function _createGallery() {
 const imgGallery = gImgs
 var [{ id }] = imgGallery
 gImgNum = 2
 id = 2
 for (let index = gImgNum; index <= 25; index++) {
  imgGallery.push({ id: id++, url: `meme-imgs/${gImgNum++}.jpg`, keywords: ['cute', 'funny'] })
 }

 return imgGallery
}

function getImg(imgId) {
 const selectImg = gImgs.find(img => img.id === imgId)
 return selectImg
}
