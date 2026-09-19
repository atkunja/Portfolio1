const choice = document.querySelector('.js-experience-choice')
const gameButton = document.querySelector('.js-choose-game')
const arenaStatus = document.querySelector('.js-arena-status')
let arenaReady = false
let arenaQueued = false

const enterArena = () =>
{
    choice?.classList.add('is-leaving')
    window.setTimeout(() => choice?.remove(), 600)
}

document.addEventListener('arena-progress', (event) =>
{
    const progress = Math.round(event.detail.progress * 100)
    if(arenaStatus)
        arenaStatus.textContent = `Loading fieldhouse ${progress}%`
})

document.addEventListener('arena-ready', () =>
{
    arenaReady = true
    gameButton?.classList.remove('is-loading')
    if(arenaStatus)
        arenaStatus.textContent = 'Start the match →'
    if(arenaQueued)
        enterArena()
})

gameButton?.addEventListener('click', () => {
    if(arenaReady)
    {
        enterArena()
        return
    }

    arenaQueued = true
    gameButton.classList.add('is-loading')
    if(arenaStatus)
        arenaStatus.textContent = 'Lacing up…'
})
