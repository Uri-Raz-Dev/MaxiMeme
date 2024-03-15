'use strict'

let gElCanvas
let gCtx

function onInit() {
 gElCanvas = document.querySelector('canvas')
 gCtx = gElCanvas.getContext('2d')

 resizeCanvas()
 renderMeme()
 window.addEventListener('resize', () => {
  resizeCanvas()
  renderMeme()
 })
}

function onSelectImg(elImg) {
 coverCanvasWithImg(elImg)
}


function renderMeme() {
 renderImg()
 renderTxt()
}

function drawImg() {
 const { url } = gImgs
 const img = new Image()
 img.src = url



 img.onload = () =>
  gCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
}

function renderImg() {
 const [{ url }] = gImgs
 const elImg = document.querySelector('.lotr')
 elImg.href = url
 elImg.onload = () =>
  gCtx.drawImage(elImg, 0, 0, elImg.naturalWidth, elImg.naturalHeight)
 coverCanvasWithImg(elImg)
}

function renderTxt() {
 const { lines: [{ txt, size, color }] } = getMeme();

 gCtx.fillStyle = `${color}`;
 gCtx.font = `${size}px Arial`;
 gCtx.fillText(`${txt}`, 80, 50);

}

// function writeText(){
//  gCtx.
// }


function coverCanvasWithImg(elImg) {
 gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
 gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
 const elContainer = document.querySelector('.canvas-container')

 gElCanvas.width = elContainer.clientWidth
}

function downloadCanvas(elLink) {

 elLink.download = 'my-img'

 const dataUrl = gElCanvas.toDataURL()
 elLink.href = dataUrl
}

function drawRect({ offsetX, offsetY }) {
 gCtx.strokeStyle = 'gray'
 gCtx.strokeRect(offsetX, offsetY, 120, 120)

 gCtx.fillStyle = 'orange'
 gCtx.fillRect(offsetX, offsetY, 120, 120)
}
