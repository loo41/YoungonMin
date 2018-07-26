const Router = require('koa-router');
const controller = require('./controllers');

const router = new Router({
  prefix: ''
});

const { a_Admin, a_Nav, a_User, a_Ntcted, c_Client, c_Ntcted, c_User, c_Sign, c_Gz, c_Chat } = controller
const { upload } = require('./utils/upload')



/**
 * @author loo4p
 * @extends admin
 */

router
      .post('/Wadmin/login', a_Admin.login)
      .get('/Wadmin/get_info', a_Admin.info)
      .post('/Wadmin/register', a_Admin.register)
      .get('/Wadmin/admin_list', a_Admin.adminList)
      .get(`/Wadmin/delect_admin`, a_Admin.delectAdmin)
      .post(`/Wadmin/change_user`, a_Admin.changeUser)
      .post(`/Wadmin/update_swiper`, a_Nav.update)
      .post(`/Wadmin/delect_image`, a_Nav.delect)
      .get(`/Wadmin/swiper_info`, a_Nav.info)
      .get(`/Wadmin/swiper_init`, a_Nav.init)
      .post(`/Wadmin/upload`, upload.single('nav'), a_Nav.upload)


router
      .get(`/Wadmin/youngon_list`, a_User.list)
      .get(`/Wadmin/is_youngon`, a_User.isYoungon)
      .post(`/Wadmin/add_youngon`, a_User.add)
      .get(`/Wadmin/delect_youngon`, a_User.delect)
      .post(`/Wadmin/update_youngon`, a_User.update)
      .get(`/Wadmin/delect_user`, a_User.delectUser)
      .get(`/Wadmin/userlist`, a_User.userList)

router
      .post(`/Wadmin/up-trends`, a_Ntcted.upTends)
      .post(`/Wadmin/up-notice`, a_Ntcted.upNotice)
      .post(`/Wadmin/update-content`, a_Ntcted.update)
      .get(`/Wadmin/delect-info`, a_Ntcted.delect)
      .get(`/Wadmin/get-list`, a_Ntcted.list)
      .post(`/Wadmin/upload-set`, upload.single('set'), a_Ntcted.upload)


/**
 * 
 * @author loo4p
 * @extends client
 * 
 */

router
      .get(`/Wclient/login`, c_Client.login)
      .post(`/Wclient/register`, c_Client.register)
      .get(`/Wclient/youngon-person`, c_Client.youngonPerson)
      .get(`/Wclient/swiperInfo`, c_Client.createIndexData)
      .get(`/Wclient/search-youngon`, c_Client.search)

router
      .get(`/Wclient/trends`, c_Ntcted.trendsList)
      .get(`/Wclient/content`, c_Ntcted.getContent)
      .get(`/Wclient/notice-list`, c_Ntcted.noticeList)
      .get(`/Wclient/search-notice`, c_Ntcted.search)

router
      .get(`/Wclient/user-detailed`, c_User.info)
      .post(`/Wclient/upload`, upload.single('img'), a_Nav.upload)
      .post(`/Wclient/update-info`, c_User.update)



router
      .post(`/Wclient/gz-list`, c_Gz.list)
      .get(`/Wclient/get-userinfo`, c_User.getUserInfo)
      .get(`/Wclient/sign-info`, c_Sign.info)
      .post(`/Wclient/sign`, c_Sign.sign)
      .post(`/Wclient/sign-out`, c_Sign.signOut)
      .post(`/Wclient/apply`, c_Sign.apply)
      .post (`/Wclient/add-share`, c_Sign.addJoke)
      .get(`/Wclient/more-chat`, c_Chat.more)



module.exports = router