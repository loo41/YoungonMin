const koa = require('koa');
const koaBody = require('koa-body');
const static = require('koa-static');
const config = require('config');
const router = require('./src/router');
const mongoose = require('mongoose');
const schedule = require("node-schedule");
const server = require('./bin/www');
const {clearSign} = require('./src/utils/clearSign');

const app = new koa();

mongoose.connect(config.get('mongodb'));
mongoose.Promise = global.Promise;

app.use(static(`${__dirname}/views`));

schedule.scheduleJob('0 0 0 * * *', function() {
  clearSign()
})

app.use(async(ctx, next) => {
  try {
	await next();
  } catch (err) {
	console.error(err);
  }
});


app.use(koaBody());

app
	.use(router.routes())
	.use(router.allowedMethods());
	
module.exports = app
