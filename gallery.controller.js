'use strict'


function renderGallery() {
 const elGallery = document.querySelector('.gallery')

 const imgs = getImgs()

 const strHtml = imgs.map(img => {
  const { id, url, keywords } = img
  return `
  <a href="#"><img  src="${url}" class="img" data-id="${id}" data-keywords="${keywords.slice(0, 2).join(' ')}" onclick="onImgSelect(${id})" /></a>
  `
 })
 elGallery.innerHTML = strHtml.join('')
}

function showGallery() {
 const elMemeGen = document.querySelector('.meme-generator-container')
 const elGallery = document.querySelector('.gallery')


 elGallery.style.display = 'flex'
}