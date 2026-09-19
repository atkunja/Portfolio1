const choice = document.querySelector('.js-experience-choice')
const gameButton = document.querySelector('.js-choose-game')

gameButton?.addEventListener('click', () => {
    choice?.classList.add('is-leaving')
    window.setTimeout(() => choice?.remove(), 600)
})
