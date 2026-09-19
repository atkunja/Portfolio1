window.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('a')
    link.href = '/'
    link.textContent = 'Cool side →'
    link.setAttribute('aria-label', 'Switch to the interactive driving portfolio')
    Object.assign(link.style, {
        position: 'fixed',
        zIndex: '9999',
        right: '18px',
        bottom: '18px',
        padding: '11px 16px',
        border: '1px solid rgba(224,164,88,.55)',
        borderRadius: '999px',
        color: '#1c1411',
        background: '#e0a458',
        boxShadow: '0 8px 24px rgba(20,12,8,.45)',
        font: '700 13px system-ui, sans-serif',
        textDecoration: 'none',
    })
    document.body.appendChild(link)
})
