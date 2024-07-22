const {ExtensionCommon} = ChromeUtils.import('resource://gre/modules/ExtensionCommon.jsm')
const {ExtensionSupport} = ChromeUtils.import('resource:///modules/ExtensionSupport.jsm')


const EXTENSION_NAME = 'prevColors'
const DEFAULT_COLOR = '#000000'

const onLastTextColorChangedCallbacks = []
const listenerRegistrations = []


function unregisterOnColorPicker(context)
{
    const i = listenerRegistrations.findIndex(r => r.context === context)
    if(i !== -1)
        listenerRegistrations.splice(i, 1)

    if(listenerRegistrations.length)
        return

    ExtensionSupport.unregisterWindowListener(context.extension.addonData.id)
}

function registerOnColorPicker(context)
{
    const needRegister = !listenerRegistrations.length

    listenerRegistrations.push({context})

    if(!needRegister)
        return

    ExtensionSupport.registerWindowListener(context.extension.addonData.id, {
        chromeURLs: [
            'chrome://messenger/content/messengercompose/EdColorPicker.xhtml'
        ],
        onLoadWindow() {
            colorBefore = getLastTextColor()
        },
        onUnloadWindow() {
            const colorAfter = getLastTextColor()
            if(colorAfter === colorBefore)
                return
            onLastTextColorChangedCallbacks.forEach(c => {
                try{
                    c(colorAfter)
                }catch(e){
                    console.error(e)
                }
            })
        }
    })
}

function registerOnLastTextColorChanged(context, callback)
{
    registerOnColorPicker(context)
    onLastTextColorChangedCallbacks.push(callback)
    return () => {
        const index = onLastTextColorChangedCallbacks.indexOf(callback)
        if (index !== -1)
            onLastTextColorChangedCallbacks.splice(index, 1)
    }
}

function getCurComposeWin()
{
    return Services.wm.getMostRecentWindow('msgcompose')
}

function setTextColor(color)
{
    const win = getCurComposeWin()
    if(!win)
        return
    win.EditorSetTextProperty('font', 'color', color)
}

function getLastTextColor()
{
    const win = getCurComposeWin()
    if(!win)
        return DEFAULT_COLOR
    const colorObj = win.gColorObj
    if(!colorObj)
        return DEFAULT_COLOR
    const color = colorObj.NoDefault ? colorObj.TextColor : colorObj.LastTextColor
    return color || DEFAULT_COLOR
}


this[EXTENSION_NAME] = class extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
        context.callOnClose({
            close() {
                unregisterOnColorPicker(context)
            }
        })

        return {
            [EXTENSION_NAME]: {
                setTextColor,
                getLastTextColor,

                onLastTextColorChanged: new ExtensionCommon.EventManager({
                    context,
                    name: 'onLastTextColorChanged',
                    register: fire => registerOnLastTextColorChanged(context, value => fire.async(value))
                }).api()
            }
        }
    }
}
