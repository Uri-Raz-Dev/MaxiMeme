'use strict'

var gElCanvas
var gCtx
var gLine = []
var isDragging = false
var gDragOffsetX, gDragOffsetY

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    const elMemeGen = document.querySelector('.meme-generator-container')
    elMemeGen.style.display = 'none'
    renderMeme()
    renderSettings()
    renderGallery()

    addListeners()
}


function renderSettings() {
    const elSettingsContainer = document.querySelector('.txtline-container')
    const meme = getMemes()
    const strHtml = meme.lines.map((line, idx) => {
        return `
        <input oninput = "onUpdateTxt(this.value)" onclick="onLineSelect(${idx})" data-id="${idx}" id="txt" class="meme-input" placeholder="Text #${idx + 1}" type="text">
        <a class="delete-btn" onclick="onDeleteTxtLine(${idx})">x</a>

        </input>`
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
        const { txt, size, color, posX, posY } = line
        let fontSize = size

        gCtx.font = `${fontSize}px Arial`
        let textWidth = gCtx.measureText(txt).width
        let lineHeight = fontSize * 1.286

        let x = posX || gElCanvas.width / 3.8
        let y = posY || 30 + index * lineHeight

        gCtx.textAlign = 'left'
        gCtx.textBaseline = 'top'
        gCtx.fillStyle = color

        if (txt.trim() !== '') {
            if (index === meme.selectedLineIdx) {
                gCtx.strokeStyle = 'yellow'
                gCtx.strokeRect(x, y, textWidth, lineHeight)
            } else {
                gCtx.strokeStyle = 'transparent'
            }
            gCtx.fillText(txt, x, y)
        } else {
            gCtx.strokeStyle = 'transparent'
        }
    })
}

function onSetColorTxt(elColor) {
    const meme = getMemes()
    meme.lines[meme.selectedLineIdx].color = elColor
    renderMeme()
}

function changeFontSize(elValue) {
    const meme = getMemes()

    if (elValue >= 3) {
        meme.lines[meme.selectedLineIdx].size += elValue
    } else if (elValue <= 3) {
        meme.lines[meme.selectedLineIdx].size -= Math.abs(elValue)
    }

    renderMeme()
}
function onUpdateTxt(elTxt) {
    setLineTxt(elTxt)
    renderMeme()
}

function onDeleteTxtLine(idx) {
    const elTxtLine = document.querySelectorAll('.meme-input')[idx]
    const elDeleteBtn = document.querySelectorAll('.delete-btn')[idx]

    deleteTxtLine(idx)
    elTxtLine.classList.add('hidden');
    elDeleteBtn.classList.add('hidden');
    renderSettings()
    renderMeme();
}
function onImgSelect(id) {
    const elMemeGen = document.querySelector('.meme-generator-container')
    const elGallery = document.querySelector('.gallery')


    elMemeGen.style.display = 'flex'
    elGallery.style.display = 'none'

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
    const meme = getMemes()
    meme.selectedLineIdx = -1
    renderMeme()
}



function onAddTxtLine() {
    addTxtLine()
    renderSettings()
    renderMeme()
}

function onLineSelect(lineIdx) {
    const meme = getMemes()
    meme.selectedLineIdx = lineIdx
    selectText(lineIdx)
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
    renderMeme()
}







function getSelectedLineIdx(x, y) {
    const meme = getMemes()
    const lines = meme.lines
    for (let i = 0; i < lines.length; i++) {
        const { txt, size, color, posX, posY } = lines[i]
        let fontSize = size
        gCtx.font = `${fontSize}px Arial`
        let textWidth = gCtx.measureText(txt).width
        let lineHeight = fontSize * 1.286

        let x1 = posX || gElCanvas.width / 3.8
        let y1 = posY || 30 + i * lineHeight
        let x2 = x1 + textWidth
        let y2 = y1 + lineHeight

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
            return i
        }
    }
    return -1
}


function onMouseDown(event) {
    const mouseX = event.clientX - gElCanvas.getBoundingClientRect().left
    const mouseY = event.clientY - gElCanvas.getBoundingClientRect().top

    const selectedLineIdx = getSelectedLineIdx(mouseX, mouseY)
    if (selectedLineIdx !== -1) {
        selectText(selectedLineIdx)
        isDragging = true
        const meme = getMemes()
        const line = meme.lines[selectedLineIdx]
        gDragOffsetX = mouseX - (line.posX || gElCanvas.width / 3.8)
        gDragOffsetY = mouseY - (line.posY || 30 + selectedLineIdx * (line.size * 1.286))
    }
}


function onTouchStart(event) {
    event.preventDefault()
    const touch = event.touches[0]
    const touchX = touch.clientX - gElCanvas.getBoundingClientRect().left
    const touchY = touch.clientY - gElCanvas.getBoundingClientRect().top

    const selectedLineIdx = getSelectedLineIdx(touchX, touchY)
    if (selectedLineIdx !== -1) {
        selectText(selectedLineIdx)
        isDragging = true
        const meme = getMemes()
        const line = meme.lines[selectedLineIdx]
        gDragOffsetX = touchX - (line.posX || gElCanvas.width / 3.8)
        gDragOffsetY = touchY - (line.posY || 30 + selectedLineIdx * (line.size * 1.286))
    }
}


function onMouseMove(event) {
    if (isDragging) {
        const mouseX = event.clientX - gElCanvas.getBoundingClientRect().left
        const mouseY = event.clientY - gElCanvas.getBoundingClientRect().top

        const meme = getMemes()
        const selectedLineIdx = meme.selectedLineIdx
        const line = meme.lines[selectedLineIdx]
        line.posX = mouseX - gDragOffsetX
        line.posY = mouseY - gDragOffsetY

        renderMeme()
    }
}

function onTouchMove(event) {
    event.preventDefault()
    if (isDragging) {
        const touch = event.touches[0]
        const touchX = touch.clientX - gElCanvas.getBoundingClientRect().left
        const touchY = touch.clientY - gElCanvas.getBoundingClientRect().top

        const meme = getMemes()
        const selectedLineIdx = meme.selectedLineIdx
        const line = meme.lines[selectedLineIdx]
        line.posX = touchX - gDragOffsetX
        line.posY = touchY - gDragOffsetY

        renderMeme()
    }
}

function onMouseUp(event) {
    isDragging = false
}


function onTouchEnd(event) {
    isDragging = false
}

function selectText(lineIdx) {
    const meme = getMemes()
    meme.selectedLineIdx = lineIdx

    renderMeme()


    setTimeout(() => {
        const inputs = document.querySelectorAll('.meme-input')
        inputs.forEach((input, index) => {
            if (index === lineIdx) {
                input.focus()
            } else {
                input.blur()
            }
        })
    }, 0)
}

function addListeners() {
    gElCanvas.addEventListener('mousedown', onMouseDown)
    gElCanvas.addEventListener('touchstart', onTouchStart)
    gElCanvas.addEventListener('mousemove', onMouseMove)
    gElCanvas.addEventListener('touchmove', onTouchMove)
    gElCanvas.addEventListener('mouseup', onMouseUp)
    gElCanvas.addEventListener('touchend', onTouchEnd)
}
