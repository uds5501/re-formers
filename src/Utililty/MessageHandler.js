const { SetCookie, DeleteCookie } = require('./CookieManager')

// for authentication persistance
export const messageHandler = (messageData, stateUpdate) => {
    if (messageData['messageType'] === 'welcome') {
        DeleteCookie(['entryToken'])
        let { userName, colour, entryToken } = messageData['clientObject']
        stateUpdate(userName, colour)
        SetCookie({'entryToken': entryToken})
    } else if (messageData['messageType'] === 'user-joined') {
        console.log("gonna show notif rn", messageData)
        let {userName, userColor} = messageData
        stateUpdate(userName, userColor)
    } else if (messageData['messageType'] === 'updater') {
        console.log("gonna update that top header here")
    }
}