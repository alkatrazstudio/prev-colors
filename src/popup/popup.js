function addRowForColor(root, color, onSelect, onRemove)
{
    const row = document.createElement('div')
    row.classList.add('row')

    const colorPanel = document.createElement('div')
    colorPanel.classList.add('color-panel')
    colorPanel.style.backgroundColor = color
    colorPanel.title = color
    colorPanel.addEventListener('click', () => onSelect())
    row.appendChild(colorPanel)

    const btnRemove = document.createElement('div')
    btnRemove.classList.add('btn-remove')
    btnRemove.addEventListener('click', () => onRemove())
    row.appendChild(btnRemove)

    root.appendChild(row)

    return row
}

function addColor(root, color)
{
    const row = addRowForColor(
        root,
        color,
        async () => {
            await browser.prevColors.setTextColor(color)
            await addPrevColor(color)
            window.close()
        },
        async () => {
            const curColorsCount = await removePrevColor(color)
            root.removeChild(row)
            if(!curColorsCount)
                window.close()
        }
    )
}

async function addCurrentColors()
{
    const colors = await getPrevColors()
    if(!colors.length)
    {
        const color = await browser.prevColors.getLastTextColor()
        colors.push(color)
        savePrevColors(colors)
    }

    const root = document.createElement('div')
    root.id = 'root'
    colors.forEach(c => addColor(root, c))
    document.body.appendChild(root)
}

async function setupTheme()
{
    const theme = await browser.theme.getCurrent()

    const bgColor = (theme.colors && theme.colors.popup) ? theme.colors.popup : 'white'
    const fgColor = (theme.colors && theme.colors.popup_text) ? theme.colors.popup_text : 'black'

    document.documentElement.style.setProperty('--bg-color', bgColor)
    document.documentElement.style.setProperty('--fg-color', fgColor)
}

setupTheme()
addCurrentColors()
