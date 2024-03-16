'use strict'

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    drawImg()
    renderMeme()
    renderSettings()
    // renderGallery()
}

function renderSettings() {
    const elSettingsContainer = document.querySelector('.settings-container')
    const meme = getMemes()
    var i = 1
    var { selectedLineIdx, lines: [{ txt, size, color }] } = meme
    const strHtml = `
        <label for="txt">Line ${i++}</label>
        <input oninput = "onUpdateTxt(this.value)" data-line-id="${selectedLineIdx++}" id="txt" class="meme-input" type="text">
    `

    elSettingsContainer.innerHTML = strHtml
}



// oninput = "onUpdateTxt(this.value)"

function renderMeme() {
    drawImg()
    drawText()
}

function drawImg() {
    const imgData = getMemes()
    const img = new Image()
    img.src = `meme-imgs/${imgData.selectedImgId}.jpg`
    img.onload = () => {
        resizeCanvas(img)
        window.removeEventListener("resize", () => resizeCanvas(img))
        drawText()
    }
}

function resizeCanvas(img) {
    if (!gElCanvas.width || !gElCanvas.height) {
        const elContainer = document.querySelector(".canvas-container")
        gElCanvas.width = elContainer.clientWidth
        gElCanvas.height = elContainer.clientHeight
    }
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawText() {
    const memeInfo = getMemes()
    const txt = memeInfo.lines[memeInfo.selectedLineIdx].txt
    const fontSize = memeInfo.lines[memeInfo.selectedLineIdx].size
    const txtColor = memeInfo.lines[memeInfo.selectedLineIdx].color

    gCtx.fillStyle = txtColor
    gCtx.font = `${fontSize}px Arial`
    gCtx.textAlign = "center"
    gCtx.fillText(txt, gElCanvas.width / 2, 40)
}


function onUpdateTxt(newText) {
    setLineTxt(newText)
    renderMeme()
}

function onImgSelect(imgId) {
    setImg(imgId)
    renderMeme()
    document.querySelector('.canvas-container').style.display = "block"
}

function onSave() {
    saveToStorage("canvasDB", gElCanvas.toDataURL())
}

function onLoad() {
    const savedImageData = loadFromStorage("canvasDB")
    if (savedImageData) {
        const img = new Image()
        img.onload = function () {
            gCtx.drawImage(img, 0, 0)
        }
        img.src = savedImageData
    }
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function downloadCanvas(elMeme, fileName) {
    elMeme.download = fileName

    const dataUrl = gElCanvas.toDataURL()
    elMeme.href = dataUrl
}

function onSetFillColor(color) {
    gCtx.fillStyle = color
}

function increaseFontSize() {
    const meme = getMemes()
    meme.lines[meme.selectedLineIdx].size += 3
    renderMeme()
}

function decreaseFontSize() {
    const meme = getMemes()
    meme.lines[meme.selectedLineIdx].size -= 3
    renderMeme()
}