'use strict'

var gElCanvas
var gCtx
var gLine = []

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderMeme()
    renderSettings()
    renderGallery()

}

function renderSettings() {
    const elSettingsContainer = document.querySelector('.txtline-container')
    const meme = getMemes()
    var { selectedLineIdx, lines: [{ txt, size, color }] } = meme
    var i = 1
    const strHtml = `
        <label for="txt">Line ${i}</label>
        <input oninput = "onUpdateTxt(this.value)" data-id="${selectedLineIdx}" id="txt" class="meme-input" type="text">
    `

    elSettingsContainer.innerHTML = strHtml
}




function renderMeme() {
    drawImg()
    drawText()
}

function drawImg(id) {
    const { selectedImgId } = getMemes()
    id = selectedImgId
    const img = new Image()
    img.src = `meme-imgs/${id}.jpg`
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

    var textWidth = gCtx.measureText(txt).width
    var lineHeight = fontSize * 1.286;

    gCtx.font = `${fontSize}px Arial`
    gCtx.textAlign = 'left';
    gCtx.textBaseline = 'top';
    gCtx.fillText(txt, gElCanvas.width / 3.8, 30)
    gCtx.strokeRect(gElCanvas.width / 3.8, 30, textWidth, lineHeight);

}

function colorTxt(elColor) {
    const meme = getMemes()
    meme.lines[meme.selectedLineIdx].color = elColor
    const txtColor = meme.lines[meme.selectedLineIdx].color
    gCtx.fillStyle = txtColor
    renderMeme()
}

function changeFontSize(elValue) {
    const meme = getMemes()
    if (elValue >= 3) {
        meme.lines[meme.selectedLineIdx].size += elValue
    } else if (elValue <= -3) {
        meme.lines[meme.selectedLineIdx].size -= Math.abs(elValue)

    }
    renderMeme()
}

function onUpdateTxt(elTxt) {
    // const inputTxt = document.querySelector('#txt1')

    setLineTxt(elTxt)
    // inputTxt.innerText = txt

    renderMeme()
}

function onImgSelect(id) {
    setImg(id)
    drawImg(id)
    renderMeme()
}

function onSave() {
    saveToStorage("canvasDB", gElCanvas.toDataURL())
}

function onLoad() {
    const savedImageData = loadFromStorage("canvasDB")
    if (savedImageData) {
        const img = new Image()
        img.onload = () => {
            gCtx.drawImage(img, 0, 0)
        }
        img.src = savedImageData
    }
}

function onClearCanvas() {
    gLine = []
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function downloadCanvas(elLink) {

    elLink.download = 'my-img'

    const dataUrl = gElCanvas.toDataURL()
    elLink.href = dataUrl
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

