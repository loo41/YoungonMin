const {Chat} = require('../../models')

exports.more = async(ctx) => {
  const {length} = ctx.query
  if (!length) {
	ctx.body = {code: 200, data: []}
   }
  const pageSize = 20
  const data = await Chat
                        .find({})
			.sort('-_id')
                        .skip(length)
                        .limit(pageSize)
                        .populate({path: 'user', select: 'avatarUrl'})
  ctx.body = {code: 200, data}
}
