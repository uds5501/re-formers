const { SetCookie, DeleteCookie } = require('./CookieManager')

// for authentication persistance
export const messageHandler = (messageData, stateUpdate) => {
    if (messageData['messageType'] === 'welcome') {
        DeleteCookie(['entryToken'])
        let { userName, colour, entryToken } = messageData['clientObject']
        stateUpdate(userName, colour)
        SetCookie({'entryToken': entryToken})
    }
}