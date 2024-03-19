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
    const strHtml = meme.lines.map((line, idx) => {
        return `
        <label for="txt">Line ${idx + 1}</label>
        <input oninput = "onUpdateTxt(this.value)" onclick="onLineSelect(${idx})" data-id="${idx}" id="txt" class="meme-input" placeholder="please add text here" type="text"></input>`
    })
    elSettingsContainer.innerHTML = strHtml.join('')
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
    const meme = getMemes()
    const lines = meme.lines
    lines.forEach((line, index) => {
        const { txt, size, color } = line
        let fontSize = size

        gCtx.font = `${fontSize}px Arial`
        let textWidth = gCtx.measureText(txt).width
        let lineHeight = fontSize * 1.286

        gCtx.textAlign = 'left'
        gCtx.textBaseline = 'top'
        gCtx.fillStyle = color

        let x = gElCanvas.width / 3.8
        let y = 30 + index * lineHeight

        if (index === meme.selectedLineIdx) {
            gCtx.strokeStyle = 'yellow'
            gCtx.strokeRect(x, y, textWidth, lineHeight)
        } else {
            gCtx.strokeStyle = 'transparent'
        }

        gCtx.fillText(txt, x, y)
    });
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
    } else if (elValue <= +3) {
        meme.lines[meme.selectedLineIdx].size -= Math.abs(elValue)

    }
    renderMeme()
}

function onUpdateTxt(elTxt) {

    setLineTxt(elTxt)

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
    gCtx.strokeStyle = 'transparent'
}

function onSetFillColor(color) {
    gCtx.fillStyle = color
}

function onAddTxtLine() {
    addTxtLine()
    renderSettings()
    renderMeme()
}

function onLineSelect(lineIdx) {
    const meme = getMemes()
    meme.selectedLineIdx = lineIdx
    renderMeme()
}

function onSwitchLine() {
    const inputs = document.querySelectorAll('.meme-input')
    const currentIdx = gMeme.selectedLineIdx
    const nextIdx = (currentIdx + 1) % inputs.length

    inputs[currentIdx].blur()
    inputs[nextIdx].focus()

    gMeme.selectedLineIdx = nextIdx


    inputs[nextIdx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
}