const {db} = require('../db')
const crypto = require('crypto');

//Data persistence operation of the blog board
const blog = {
    //add blog
    add:  async (blogData) => {
            //user_id blog_type blog_title blog_content create_time
        const user_id = blogData.user_id;
        const blog_type = blogData.blog_type;
        const blog_title = blogData.blog_title;
        const blog_content  = blogData.blog_content;
        const create_time = Date.now(); 

        const sql = `
    insert into t_blog (user_id, blog_type, blog_title, blog_content, create_time) value ('${user_id}', '${blog_type}', '${blog_title}', '${blog_content}', ${create_time})`;

        return await db(sql, blogData)
    },

    //update blog
    update: async (id, blogData = {}) => {
            //title content
        const blog_title = blogData.blog_title;
        const blog_content = blogData.blog_content;
        const update_time = Date.now();

        const sql = `update t_blog set blog_title='${blog_title}', blog_content='${blog_content}', update_time='${update_time}' where id=${id}`;

        return await db(sql, [id, blogData = {}])
    },

    //delete blog
    del: async (id) => {
        //const sql = `update t_blog set is_del=0 where id=${id} and user_id='${user_id}'`;

        return user.update([id, {is_del: 1}])
    },

    //get the information about UserBlog
    getUserBlog: async (userId) => {
        let sql = `select * from t_blog where user_id='${user_id}'`;  //retrieve data from a data table

        return await db(sql, userId)
    },

    //get all blog
    getBlog: async (user_id, keyword) => {
        let sql = `select * from t_blog where 1=1 `;  //retrieve data from a data table

        if(user_id) {
            sql += `and user_id='${user_id}'`;
        }
    
        if(keyword) {
            sql += `and blog_title like '%${keyword}%'`;
        }
    
        return await db(sql);
    },
}


//Exported as an object
module.exports = blog