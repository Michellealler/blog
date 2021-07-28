const {db} = require('../db')
const crypto = require('crypto')

//Data persistence operation of the user board
const user = {
    //Obtain user information based on phone number
    getUserByPhone: async (phone) => {
        const sql = 'select id, phone, password, nickname,head_img, personal_sign, level_id from t_user where phone = ? and is_del = 0';
        return await db(sql, [phone])
    },

    //login
    login: async json => {
        const users = await user.getUserByPhone(json.phone);
        if(users.length > 0) {
            const u = users[0]  
            let enpwd = crypto.createHash('md5').update(json.password + json.phone).digest('hex');
            if(u.password === enpwd) {
                return await u;
            }
        }
        return await null;
    },

    //add user information
    add: async (user) => {
        ///{name: '', phone: '', password: ''}
        const sql = 'insert into t_user set ?'
        return await db(sql, user)
    },

    //update user information
    update: async (arr) => {
        //[user, id] ==> [{nickname: '', age:''}, id]
        const sql = "update t_user set ? where id=?"
        return await db(sql, arr)
    },

    //delete user information through a fake opration
    del: (id) => {
        return user.update([{is_del: 1}, id])
    },

    // get all user information
    getAll: async ()=> {
        const sql = 'select id, phone, password, nickname,head_img, personal_sign, level_id from t_user where is_del = 0'
        return await db(sql)
    }
}
module.exports = user