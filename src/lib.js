const MAX_COLORS = 16
const STORAGE_KEY = 'prevColors'

async function getPrevColors()
{
    try{
        const {[STORAGE_KEY]: prevColors} = await browser.storage.local.get(STORAGE_KEY)
        if(Array.isArray(prevColors) && prevColors.length)
            return prevColors
    }catch(e){
    }

    return []
}

async function savePrevColors(prevColors)
{
    try{
        await browser.storage.local.set({[STORAGE_KEY]: prevColors})
    }catch(e){
        console.error(e)
    }
}

async function addPrevColor(color)
{
    const prevColors = await getPrevColors()

    const oldIndex = prevColors.indexOf(color)
    if(oldIndex === 0)
        return
    if(oldIndex !== -1)
        prevColors.splice(oldIndex, 1)

    if(prevColors.unshift(color) > MAX_COLORS)
        prevColors.splice(MAX_COLORS)

    await savePrevColors(prevColors)
}

async function removePrevColor(color)
{
    const prevColors = await getPrevColors()

    const oldIndex = prevColors.indexOf(color)
    if(oldIndex !== -1)
        prevColors.splice(oldIndex, 1)

    await savePrevColors(prevColors)
    return prevColors.length
}
