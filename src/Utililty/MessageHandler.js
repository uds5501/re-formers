const { SetCookie, DeleteCookie } = require('./CookieManager')

// for authentication persistance
export const messageHandler = (messageData, stateUpdate, secondaryCallback) => {
    if (messageData['MessageType'] === 'welcome') {
        DeleteCookie(['entryToken'])
        let { userName, colour, entryToken } = messageData['clientObject']
        stateUpdate(userName, colour)
        SetCookie({'entryToken': entryToken})
    } else if (messageData['MessageType'] === 'user-joined') {
        console.log("gonna show notif rn")
        let {userName, userColor} = messageData
        stateUpdate(userName, userColor, 'login')
    } else if (messageData['MessageType'] === 'updater') {
        console.log("gonna update that top header here")
        stateUpdate(messageData['clientList'])
    } else if (messageData['MessageType'] === 'user-logout') {
        console.log("gonna show logout notif now")
        let {userName, userColor} = messageData
        stateUpdate(userName, userColor, 'logout')
    }
}