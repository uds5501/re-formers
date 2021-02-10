import axios from 'axios'
const { SetCookie, DeleteCookie } = require('./CookieManager')
// for authentication persistance
const API_BASE = 'http://localhost:1337'
export const messageHandler = (messageData, stateUpdate, secondaryCallback) => {
  if (messageData['MessageType'] === 'welcome') {
    DeleteCookie(['entryToken'])
    let { userName, colour, entryToken } = messageData['clientObject']
    stateUpdate(userName, colour)
    SetCookie({ 'entryToken': entryToken })
  } else if (messageData['MessageType'] === 'user-joined') {
    console.log("gonna show notif rn")
    let { userName, userColor } = messageData
    stateUpdate(userName, userColor, 'login')
  } else if (messageData['MessageType'] === 'updater') {
    console.log("gonna update that top header here")
    stateUpdate(messageData['clientList'])
  } else if (messageData['MessageType'] === 'user-logout') {
    console.log("gonna show logout notif now")
    let { userName, userColor } = messageData
    stateUpdate(userName, userColor, 'logout')
  } else if (messageData['MessageType'] === 'disconnect') {
    console.log("DISCONNECT MESSAGE IS HERE!")
    stateUpdate()
  } else if (messageData['MessageType'] === 'formUpdater') {
    console.log("Updating forms")
    stateUpdate(messageData['FormData'])
  }
}

export const logoutHandler = async (token) => {
  let postBody = {
    messageType: 'logout',
    entryToken: token,
  }
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
  const resp = await axios.post(API_BASE+'/logout',postBody, headers )
}

export const requestEditLock = async (token, formId) => {
  let postBody = {
    messageType: 'lockrequest',
    entryToken: token,
    formId: formId,
  }
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
  const resp = await axios.post(API_BASE+'/lock', postBody, headers)
  return resp
}

export const sendUnlockMessage = async (token, formId) => {
  let postBody = {
    messageType: 'unlock',
    entryToken: token,
    formId: formId,
  }
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
  const resp = await axios.post(API_BASE+'/unlock', postBody, headers)
  return resp
}