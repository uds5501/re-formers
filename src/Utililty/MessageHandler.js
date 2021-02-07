const { SetCookie, DeleteCookie } = require('./CookieManager')

// for authentication persistance
export const messageHandler = (messageData, stateUpdate) => {
    if (messageData['MessageType'] === 'welcome') {
        DeleteCookie(['entryToken'])
        let { userName, colour, entryToken } = messageData['clientObject']
        stateUpdate(userName, colour)
        SetCookie({'entryToken': entryToken})
    } else if (messageData['MessageType'] === 'user-joined') {
        console.log("gonna show notif rn", messageData)
        let {userName, userColor} = messageData
        stateUpdate(userName, userColor)
    } else if (messageData['MessageType'] === 'updater') {
        console.log("gonna update that top header here")
        stateUpdate(messageData['clientList'])
    }
}