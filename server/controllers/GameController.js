const SocketHelper = require('../helpers/SocketHelper')
const DataMessage = require('../helpers/DataMessage')
const CODE_LENGTH = 6

const generateNewCode = () => {
  let connectCode
  // generate a new code
  let tooManyCount = 10
  do {
    connectCode = randomCharacters(CODE_LENGTH)

    if (tooManyCount-- < 0) {
      throw new Error('Could not generate a unique code')
    }
  } while (
    SocketHelper.getActiveSocketByCode(connectCode, SocketHelper.ROLE_HOST)
  )

  return connectCode
}

/**
 * @param {number?} length
 * @returns {string}
 */
const randomCharacters = length => {
  return Math.random().toString(36).substr(2, length)
}

class GameController {
  /**
   * @param {WebSocket} socket
   * @param {*} req
   * @return {Promise<void>}
   */
  static async socketCreateGame(socket, req) {
    let connectCode = req.params.code ? req.params.code : generateNewCode()
    let recoveryCode = req.params.recoveryCode

    verifyCanConnectToCode(SocketHelper.ROLE_HOST, connectCode, recoveryCode)

    // mark this socket
    const gameMeta = SocketHelper.markSocketWithCode(
      socket,
      connectCode,
      SocketHelper.ROLE_HOST,
    )

    // configure our server side handling
    SocketHelper.configureSocket(socket)

    const existingOpponent = SocketHelper.getActiveSocketByCode(
      connectCode,
      SocketHelper.ROLE_OPPONENT,
    )

    if (!!existingOpponent) {
      // mark this is the new host
      initiateHandshake(socket, existingOpponent)
    } else {
      // notify client we're waiting for opponent
      let successMessage = DataMessage.toSend('connection:waiting', {
        connectCode: connectCode,
        recoveryCode: gameMeta.recoveryCode,
      })

      SocketHelper.pushToSocket(socket, successMessage)
    }
  }

  /**
   * @param {WebSocket} socket
   * @param {*} req
   * @return {Promise<void>}
   */
  static async socketJoinGame(socket, req) {
    let connectCode = req.params.code
    let recoveryCode = req.params.recoveryCode

    verifyCanConnectToCode(
      SocketHelper.ROLE_OPPONENT,
      connectCode,
      recoveryCode,
    )

    let activeGame = SocketHelper.getActiveSocketByCode(
      connectCode,
      SocketHelper.ROLE_HOST,
    )

    if (!activeGame) {
      throw new Error('No game found')
    }

    // mark this socket
    const gameMeta = SocketHelper.markSocketWithCode(
      socket,
      connectCode,
      SocketHelper.ROLE_OPPONENT,
    )

    // configure our server side handling
    SocketHelper.configureSocket(socket)

    // connect them
    initiateHandshake(activeGame, socket)
  }
}

/**
 * @param {WebSocket} hostSocket
 * @param {WebSocket} opponentSocket
 */
function initiateHandshake(hostSocket, opponentSocket) {
  SocketHelper.markSocketsAsConnected(hostSocket, opponentSocket)

  const hostMeta = SocketHelper.getGameMetaFromSocket(hostSocket)
  const opponentMeta = SocketHelper.getGameMetaFromSocket(opponentSocket)

  // this from the Types file
  const readyEventType = 'connection:ready'

  SocketHelper.pushToSocket(
    opponentSocket,
    DataMessage.toSend(readyEventType, opponentMeta),
  )
  SocketHelper.pushToSocket(
    hostSocket,
    DataMessage.toSend(readyEventType, hostMeta),
  )
}

/**
 * @param {string} connectRole
 * @param {string} connectCode
 * @param {string?} recoveryCode
 */
function verifyCanConnectToCode(connectRole, connectCode, recoveryCode) {
  // make sure this code isn't already in use
  let activeOpponent = SocketHelper.getActiveSocketByCode(
    connectCode,
    connectRole,
  )
  if (activeOpponent) {
    if (recoveryCode) {
      let opponentMeta = SocketHelper.getGameMetaFromSocket(activeOpponent)

      if (opponentMeta.recoveryCode !== recoveryCode) {
        // imposter!
        throw new Error('Incorrect recovery code')
      }
    }
    // they've got the hosts recoveryCode, must be the guy. Close the old one
    activeOpponent.close()
  } else {
    throw new Error('Game full')
  }
}

module.exports = GameController
