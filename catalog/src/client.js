/* globals document, window */
/* eslint-disable no-use-before-define */
import renderPage from './page/render'
import API from './services/api'

const $app = document.getElementById('app')

window.addEventListener('popstate', () => {
  rerender(window.location.pathname.substr(1))
})

function handleClickOption(e) {
  e.preventDefault()
  const sku = e.currentTarget.getAttribute('data-sku')

  // Send sku to the 'sku' message queue on Redis
  API
  .postSKUToMessageQueue(sku)
  .then(() => {
    window.history.pushState(null, null, sku)
    rerender(sku)
  })
}

function addListeners() {
  const $btns = $app.querySelectorAll('#options a')
  Array.prototype.forEach.call($btns, $btn => (
    $btn.addEventListener('click', handleClickOption)
  ))
}

function removeListeners() {
  const $btns = $app.querySelectorAll('#options a')
  Array.prototype.forEach.call($btns, $btn => (
    $btn.removeEventListener('click', handleClickOption)
  ))
}

function rerender(sku) {
  removeListeners()
  $app.innerHTML = renderPage(sku)
  addListeners()
}

addListeners()
