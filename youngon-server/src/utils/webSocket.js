const _token = require('./token')
let client = []
const {Userinfo, Chat} = require('../models')

exports.chat = (server) => {
  const WebSocketServer = require('ws').Server
  let wsServer = new WebSocketServer({server})
  wsServer.on('connection', async function (ws) {
    let user = {}
    let chatFiveMes = await Chat.find({})
                                    .sort('-_id').limit(6)
                                    .populate({path: 'user', select: 'avatarUrl'})
    chatFiveMes = chatFiveMes.reverse()
    let data = JSON.stringify({type: 1, people: client.length, chatFiveMes})
    await sendMessage(data, ws)
    ws.on('close', async function close() {
      const {flag} = user
      if (client.length <= 0) return
      await client.forEach(async (item, i) => {
        if (item.index === flag) {
          client.splice(i, 1)
        } else {
          try {
            item.ws.send(JSON.stringify({type: 5, people: client.length}), item.ws)
          } catch (e) {
            console.log('e')
          }
        }
      })
      user = {}
    })
    ws.on('message', async function(message) {
      message = JSON.parse(message)
      if (message.type === 1) {
        let ctx = {}
        let flag = new Date().getTime()
        client.push({'index': flag,'ws': ws})
        user = await _token.istoken(ctx, message.token)
        let userInfo = await Userinfo.findOne({_id: user.infoID})
        let {_id, nickName, avatarUrl} = userInfo
        let chatToken = await _token.creatToken({_id, nickName, avatarUrl, flag})
        let display = {nickName, avatarUrl}
        await sendMessage(JSON.stringify({type: 2, display, chatToken}), ws)
        await sendMessage(JSON.stringify({type: 4, display, people: client.length}))
      } else if (message.type === 2) {
        let ctx = {}
        user = await _token.istoken(ctx, message.chatToken)
        let data = JSON.stringify({type: 3, message: {nickName: user.nickName, avatarUrl: user.avatarUrl, message: message.message}})
        sendMessage(data)
        let chat = new Chat({
          user: user._id,
          message: message.message
        })
        await chat.save()
      } else if (message.type === 3) {
        if (client.length === 0) return
        let ctx = {}
        user = await _token.istoken(ctx, message.chatToken)
      }
    })
  })
}

function sendMessage (data, ws) {
  return new Promise(async (resolve, reject) => {
    if (ws) {
      ws.send(data, function (err) {
        if(!err){
          resolve()
        } else {
          reject()
        }
      })
    } else {
      let flag = []
      await client.forEach(async (item, i) => {
        try {
          item.ws.send(data)
        } catch (e) {
          flag.push(i)
          console.log('e')
        }
      })
      flag = flag.reverse()
      flag.forEach((item, i) => {
	console.log(i)
	client.splice(i, 1)
	})
      resolve()
    }
  })
}
