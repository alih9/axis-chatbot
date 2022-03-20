const jwt = require('express-jwt');
const secret_key = process.env.SECRET_KEY


const auth = jwt({ secret: secret_key, algorithms: ['HS256'] }).unless({
    path:
        ['/api/show_all_archive_user_chat','/api/show_all_user_chat', '/api/login', '/api/register', '/api/userdata', '/api/customerchatting', '/api/getmessage', '/api/show_all_chat_user', '/api/parent','/api/tenantchatting','/api/checkuseractivation','/api/existuser','/api/getuserdetails','/api/deactivateuserroom','/api/deleteconversation','/api/deletemessage']
});
              
module.exports = auth;