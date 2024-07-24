const {ExtensionCommon} = ChromeUtils.importESModule('resource://gre/modules/ExtensionCommon.sys.mjs')
const {ExtensionSupport} = ChromeUtils.importESModule('resource:///modules/ExtensionSupport.sys.mjs')

const EXTENSION_NAME = 'prevColors'
const DEFAULT_COLOR = '#000000'
const LISTENER_ID = 'prevColors.EdColorPicker'

const onLastTextColorChangedCallbacks = []
let needRegister = true

function registerOnColorPicker()
{
    if(!needRegister)
        return
    needRegister = false

    try {
        ExtensionSupport.unregisterWindowListener(LISTENER_ID)
    } catch(e) {
    }
    ExtensionSupport.registerWindowListener(LISTENER_ID, {
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

function registerOnLastTextColorChanged(callback)
{
    registerOnColorPicker()
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

this[EXTENSION_NAME] = class extends ExtensionCommon.ExtensionAPIPersistent {
    PERSISTENT_EVENTS = {
        onLastTextColorChanged({ fire }) {
            return {
                unregister: registerOnLastTextColorChanged(value => fire.async(value)),
                convert: fireToExtensionCallback => fire = fireToExtensionCallback
            }
        }
    }

    getAPI(context) {
        return {
            [EXTENSION_NAME]: {
                setTextColor,
                getLastTextColor,

                onLastTextColorChanged: new ExtensionCommon.EventManager({
                    context,
                    module: EXTENSION_NAME,
                    event: 'onLastTextColorChanged',
                    extensionApi: this
                }).api()
            }
        }
    }
}
