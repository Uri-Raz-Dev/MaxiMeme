'use strict'

function galleryOnInit() {
 renderGallery()
}

function renderGallery() {
 const elGallery = document.querySelector('.gallery')

 const imgs = getImgs()

 const strHtml = imgs.map(img => {
  const { id, url, keywords } = img
  return `
  <a href="index.html" onclick="onImgSelect(${id})"><img src="${url}" class="img" data-id="${id}" data-keywords="${keywords.slice(0, 2).join(' ')}" onclick="onImgSelect(${id})" /></a>
  `
 })
 elGallery.innerHTML = strHtml.join('')
}

// add img