'use strict'

var gElCanvas
var gCtx
var gLine = []
var isDragging = false; // Flag to track if dragging is in progress
var dragOffsetX, dragOffsetY; // Offset to adjust the position while dragging


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')


    renderMeme()
    renderSettings()
    renderGallery()

    gElCanvas.addEventListener('mousedown', onMouseDown);
    gElCanvas.addEventListener('touchstart', onTouchStart);
    gElCanvas.addEventListener('mousemove', onMouseMove);
    gElCanvas.addEventListener('touchmove', onTouchMove);
    gElCanvas.addEventListener('mouseup', onMouseUp);
    gElCanvas.addEventListener('touchend', onTouchEnd);
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
        const { txt, size, color, posX, posY } = line; // Get position properties
        let fontSize = size;

        gCtx.font = `${fontSize}px Arial`;
        let textWidth = gCtx.measureText(txt).width;
        let lineHeight = fontSize * 1.286;

        gCtx.textAlign = 'left';
        gCtx.textBaseline = 'top';
        gCtx.fillStyle = color;

        let x = posX || gElCanvas.width / 3.8; // Use stored position or default position
        let y = posY || 30 + index * lineHeight;

        if (index === meme.selectedLineIdx) {
            gCtx.strokeStyle = 'yellow';
            gCtx.strokeRect(x, y, textWidth, lineHeight);
        } else {
            gCtx.strokeStyle = 'transparent';
        }

        gCtx.fillText(txt, x, y);
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
    selectText(lineIdx);
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

'use strict'

// Add event listener for touch events



function getSelectedLineIdx(x, y) {
    const meme = getMemes();
    const lines = meme.lines;
    for (let i = 0; i < lines.length; i++) {
        const { txt, size, color } = lines[i];
        let fontSize = size;
        gCtx.font = `${fontSize}px Arial`;
        let textWidth = gCtx.measureText(txt).width;
        let lineHeight = fontSize * 1.286;

        let x1 = gElCanvas.width / 3.8;
        let y1 = 30 + i * lineHeight;
        let x2 = x1 + textWidth;
        let y2 = y1 + lineHeight;

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
            return i;
        }
    }
    return -1; // No text element selected
}

function onMouseDown(event) {
    const mouseX = event.clientX - gElCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY - gElCanvas.getBoundingClientRect().top;

    const selectedLineIdx = getSelectedLineIdx(mouseX, mouseY);
    if (selectedLineIdx !== -1) {
        selectText(selectedLineIdx);
        isDragging = true;
        const meme = getMemes();
        const line = meme.lines[selectedLineIdx];
        dragOffsetX = mouseX - (gElCanvas.width / 3.8); // Calculate offset from text position
        dragOffsetY = mouseY - (30 + selectedLineIdx * (line.size * 1.286)); // Calculate offset from text position
    }
}

// Function to handle touch start event
function onTouchStart(event) {
    event.preventDefault(); // Prevent default touch behavior
    const touch = event.touches[0];
    const touchX = touch.clientX - gElCanvas.getBoundingClientRect().left;
    const touchY = touch.clientY - gElCanvas.getBoundingClientRect().top;

    const selectedLineIdx = getSelectedLineIdx(touchX, touchY);
    if (selectedLineIdx !== -1) {
        isDragging = true;
        const meme = getMemes();
        const line = meme.lines[selectedLineIdx];
        dragOffsetX = touchX - (gElCanvas.width / 3.8); // Calculate offset from text position
        dragOffsetY = touchY - (30 + selectedLineIdx * (line.size * 1.286)); // Calculate offset from text position
    }
}

// Function to handle mouse move event
function onMouseMove(event) {
    if (isDragging) {
        const mouseX = event.clientX - gElCanvas.getBoundingClientRect().left;
        const mouseY = event.clientY - gElCanvas.getBoundingClientRect().top;

        const meme = getMemes();
        const selectedLineIdx = meme.selectedLineIdx;
        const line = meme.lines[selectedLineIdx];
        line.posX = mouseX - dragOffsetX; // Update text position based on mouse movement
        line.posY = mouseY - dragOffsetY;

        renderMeme(); // Redraw the canvas after updating text position
    }
}

// Function to handle touch move event
function onTouchMove(event) {
    event.preventDefault(); // Prevent default touch behavior
    if (isDragging) {
        const touch = event.touches[0];
        const touchX = touch.clientX - gElCanvas.getBoundingClientRect().left;
        const touchY = touch.clientY - gElCanvas.getBoundingClientRect().top;

        const meme = getMemes();
        const selectedLineIdx = meme.selectedLineIdx;
        const line = meme.lines[selectedLineIdx];
        line.posX = touchX - dragOffsetX; // Update text position based on touch movement
        line.posY = touchY - dragOffsetY;

        renderMeme(); // Redraw the canvas after updating text position
    }
}

// Function to handle mouse up event
function onMouseUp(event) {
    isDragging = false; // Reset dragging flag on mouse up event
}

// Function to handle touch end event
function onTouchEnd(event) {
    isDragging = false; // Reset dragging flag on touch end event
}

function selectText(lineIdx) {
    const meme = getMemes();
    meme.selectedLineIdx = lineIdx; // Select the clicked text

    // Redraw the canvas with the selected text
    renderMeme();

    // Focus on the corresponding input line after rendering
    setTimeout(() => {
        const inputs = document.querySelectorAll('.meme-input');
        inputs.forEach((input, index) => {
            if (index === lineIdx) {
                input.focus();
            } else {
                input.blur(); // Remove focus from other inputs
            }
        });
    }, 0);
}