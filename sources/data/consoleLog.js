import * as THREE from 'three/webgpu'

const text = `
╔═ Ayush Kunjadia ═════════════════════════════════════╗
║ Welcome to the developer console.                    ║
║ GitHub   ⇒ https://github.com/atkunja                 ║
║ LinkedIn ⇒ https://www.linkedin.com/in/ayushkunjadia/ ║
║ Mail     ⇒ ayushkun@umich.edu                         ║
╚═══════════════════════════════════════════════════════╝

╔═ Fieldhouse engine ══════════════════════════════════╗
║ Ayush's interactive wrestling portfolio              ║
║ Three.js revision: ${THREE.REVISION}                             ║
╚═══════════════════════════════════════════════════════╝

Add #debug to the URL to access debug mode. Press [V] for the free camera.
`

let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null

for(let i = 0; i < text.length; i++)
{
    const char = text[i]
    const style = char.match(/[╔║═╗╚╝]/) ? 'pipe' : 'letter'

    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'
        finalStyles.push(stylesSet[currentStyle])
    }

    finalText += char
}

export default [ finalText, ...finalStyles ]
