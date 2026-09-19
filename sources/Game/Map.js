import { clamp } from 'three/src/math/MathUtils.js'
import { Game } from './Game.js'

export class Map
{
    constructor()
    {
        this.game = Game.getInstance()

        this.initiated = false
        this.modal = this.game.modals.items.get('map')
        this.element = this.modal.element.querySelector('.js-map-container')

        this.setTrigger()
        this.setInputs()

        this.modal.events.on('open', () =>
        {
            if(!this.initiated)
                this.init()

            this.texture.update()
        })
    }

    init()
    {
        this.initiated = true
        
        this.setLocations()
        this.setPlayer()
        this.setTexture()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
    }

    setLocations()
    {
        this.locations = {}
        this.locations.items = [
            { name: 'Career Tunnel', respawnName: 'career', offset: { x: 0, y: -0.06 } },
            { name: 'Center Mat', respawnName: 'landing', offset: { x: 0.02, y: 0 } },
            { name: 'Project Showcase', respawnName: 'projects', offset: { x: 0, y: -0.02 } },
            { name: 'Team Bench', respawnName: 'social', offset: { x: -0.01, y: -0.04 } },
        ]

        for(const item of this.locations.items)
        {
            const respawn = this.game.respawns.getByName(item.respawnName)
            const mapPosition = this.worldToMap(respawn.position)
            item.mapPosition = mapPosition

            // HTML
            const html = /* html */`
                <div class="pin"></div>
                <div class="name-container">
                    <div class="name">${item.name}</div>
                </div>
            `

            const element = document.createElement('div')
            element.classList.add('location')
            element.innerHTML = html
            element.style.left = `${(mapPosition.x + item.offset.x)* 100}%`
            element.style.top = `${(mapPosition.y + item.offset.y)* 100}%`
            element.style.zIndex = Math.round(mapPosition.y * 1000)
            
            this.element.append(element)

            element.addEventListener('click', () =>
            {
                this.game.player.respawn(item.respawnName, () =>
                {
                    this.game.view.focusPoint.isTracking = true
                })
                this.game.modals.close()
            })
        }
    }
    
    setPlayer()
    {
        this.player = {}
        this.player.element = this.element.querySelector('.js-player')
        this.player.roundedPosition = { x: 0, y: 0 }
    }
    
    setTexture()
    {
        this.texture = {}
        this.texture.element = this.element.querySelector('.js-texture')
        this.texture.previousNight = null

        this.texture.element.addEventListener('load', () =>
        {
            this.texture.element.classList.add('is-visible')
        })
        
        this.texture.update = () =>
        {
            const isNight = this.game.dayCycles.intervalEvents.get('night').inInterval

            if(isNight !== this.texture.previousNight)
            {
                this.texture.element.classList.remove('is-visible')
                this.texture.previousNight = isNight

                const canvas = document.createElement('canvas')
                canvas.width = 1400
                canvas.height = 1400
                const context = canvas.getContext('2d')
                context.fillStyle = isNight ? '#030b18' : '#071a33'
                context.fillRect(0, 0, canvas.width, canvas.height)

                context.strokeStyle = isNight ? '#13213a' : '#123f78'
                context.lineWidth = 2
                for(let i = 0; i <= 14; i++)
                {
                    const p = i * 100
                    context.beginPath()
                    context.moveTo(p, 0)
                    context.lineTo(p, 1400)
                    context.stroke()
                    context.beginPath()
                    context.moveTo(0, p)
                    context.lineTo(1400, p)
                    context.stroke()
                }

                context.strokeStyle = '#f5662f'
                context.lineWidth = 22
                context.lineJoin = 'round'
                context.beginPath()
                this.locations.items.forEach((item, index) =>
                {
                    const x = item.mapPosition.x * canvas.width
                    const y = item.mapPosition.y * canvas.height
                    if(index === 0)
                        context.moveTo(x, y)
                    else
                        context.lineTo(x, y)
                })
                context.stroke()

                for(const item of this.locations.items)
                {
                    const x = item.mapPosition.x * canvas.width
                    const y = item.mapPosition.y * canvas.height
                    context.fillStyle = '#123f78'
                    context.strokeStyle = '#f4efe4'
                    context.lineWidth = 10
                    context.beginPath()
                    context.arc(x, y, item.respawnName === 'landing' ? 92 : 58, 0, Math.PI * 2)
                    context.fill()
                    context.stroke()
                }

                context.fillStyle = '#f4efe4'
                context.font = '900 68px Arial Black, sans-serif'
                context.textAlign = 'center'
                context.fillText('KUNJADIA FIELDHOUSE', 700, 125)
                context.fillStyle = '#f5662f'
                context.font = '700 30px Arial, sans-serif'
                context.fillText('COMPETITION FLOOR • PROJECT CAMPUS', 700, 174)

                this.texture.element.src = canvas.toDataURL('image/png')
            }
        }
    }

    setTrigger()
    {
        const element = this.game.domElement.querySelector('.js-map-trigger')
        
        element.addEventListener('click', (event) =>
        {
            this.game.modals.open('map')
        })
        element.addEventListener('keydown', (event) =>
        {
            event.preventDefault()
        })
    }

    setInputs()
    {
        // Inputs keyboard
        this.game.inputs.addActions([
            { name: 'map', categories: [ 'modal', 'menu', 'wandering' ], keys: [ 'Keyboard.m', 'Keyboard.KeyM' ] },
        ])
        this.game.inputs.events.on('map', (action) =>
        {
            if(action.active)
            {
                if(!this.modal.isOpen)
                    this.game.modals.open('map')
                else
                    this.game.modals.close()
            }
        })
    }

    worldToMap(coordinates)
    {
        let x = coordinates.x
        let y = typeof coordinates.z !== 'undefined' ? coordinates.z : coordinates.y

        x /= this.game.terrain.size
        y /= this.game.terrain.size

        x += 0.5
        y += 0.5

        x = clamp(x, 0, 1)
        y = clamp(y, 0, 1)

        return { x, y }
    }

    update()
    {
        if(!this.modal.isOpen)
            return

        const playerRoundedX = Math.round(this.game.player.position.x)
        const playerRoundedY = Math.round(this.game.player.position.z)

        if(playerRoundedX !== this.player.roundedPosition.x || playerRoundedY !== this.player.roundedPosition.y)
        {
            this.player.roundedPosition.x = playerRoundedX
            this.player.roundedPosition.y = playerRoundedY

            const playerCoordinates = this.worldToMap(this.player.roundedPosition)
            const x = Math.round(playerCoordinates.x * 1000) / 10
            const y = Math.round(playerCoordinates.y * 1000) / 10

            this.player.element.style.left = `${x}%`
            this.player.element.style.top = `${y}%`
            this.player.element.style.transform = `rotate(${-this.game.physicalVehicle.yRotation}rad)`
        }
    }
}
