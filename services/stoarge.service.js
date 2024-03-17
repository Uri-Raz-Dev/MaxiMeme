'use strict'

function saveToStorage(key, value) {
 const valStr = JSON.stringify(value)
 localStorage.setItem(key, valStr)
}

function loadFromStorage(key) {
 const valStr = localStorage.getItem(key)
 return JSON.parse(valStr)
}