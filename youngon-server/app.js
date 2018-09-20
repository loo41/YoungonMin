const koa = require('koa');
const koaBody = require('koa-body');
const static = require('koa-static');
const config = require('config');
const router = require('./src/router');
const mongoose = require('mongoose');
const schedule = require("node-schedule");
const {clearSign, clearSignWeekRecord} = require('./src/utils/clearSign');

const app = new koa();

mongoose.connect(config.get('mongodb'));
mongoose.Promise = global.Promise;

app.use(static(`${__dirname}/views`));

schedule.scheduleJob('0 0 0 * * *', function() {
  clearSign()
})

schedule.scheduleJob('0 55 23 * * 7', function() {
  clearSignWeekRecord()
})

app.use(async(ctx, next) => {
  try {
	  await next();
  } catch (err) {
	  console.error(err);
  }
});

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE"); 
  ctx.set("Access-Control-Allow-Headers", "token, x-requested-with, accept, x-url-path, Access-Control-Allow-Origin, origin, content-type");
  ctx.set("Access-Control-Expose-Headers", "myData");
  await next()
})

app.use(koaBody());

app
	.use(router.routes())
	.use(router.allowedMethods());
	
module.exports = app
