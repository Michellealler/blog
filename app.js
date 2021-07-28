const express = require('express')
const util = require('./util')
const user = require('./manage/user')
const blog = require('./manage/blog')
const crypto = require('crypto')
const app = express()
const path = require('path')

const cookieSession = require('cookie-session')

//set the static resource path
app.use('/static', express.static(__dirname + '/static'));

//import ejs
app.engine('.html', require('ejs').__express);

//set up the specific route
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'html');
app.use(cookieSession({
    name:'session',
    secret: 'user',
    maxAge: 24 * 60 * 60 * 1000
}))

/**
 * 1: for page jump
 * 2: for user data processing
 * 3: for blog data processing
 */

//send a GET request
app.get('/', (req, res) => {
    // util.read('pages/index.html')
    //     .then(res => {
    //         res.write(res)
    //         res.end()
    //     })
    res.render('index', {
        title: 'HF-idary'
    })
})

//Jump the login page
app.get('/toLogin', (req, res) => {
    // const data = await util.read('pages/login.html')
    // res.end(data);
    res.render('login', {
        title: "HF-idary login"
    })
})

//Jump the register page
app.get('/toRegister', (req, res) => {
    res.render('register', {
        title: "HF-idary register"
    })
})

//Jump the personal center
app.get('/userInfo', (req, res) => {
    res.render("user-info", {
        title:"HF-idary personal center"
    })
})


class Resp {
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    static success(data) {
        return new Resp(2000, "The required is successful", data);
    }
    static error(msg) {
        msg = msg ? msg : "The required failed";
       return new Resp(5000, msg, null); 
    }
    static nologin() {
        return new Resp(5010, "User not login", null);
    }
}

// -----------------------user data processing----------------------------
//Determine wheter the user information already exists 
app.get('/user/getUserByPhone', async (req, res) => {

    //call the method to return database data
   const use = await user.getUserByPhone(req.query.phone)
   if(use.length > 0) {
       res.send(Resp.error("User already exists"))
   } else {
       res.send(Resp.success(null))
   }

})

//get verification code
app.get('/getCode', (req, res) => {
    let code = Math.floor(Math.random() * 10000);
    req.session.code = code
    console.log("code", code);
    res.send(Resp.success(null))
})

//register
app.post('/register', (req, res) => {
    let json = null;
    req.on('data', (chunk) => {
        const str = Buffer.from(chunk).toString()
        json= JSON.parse(str)
    })
    req.on('end',async () => {
        if(json.code != req.session.code) {
            res.send(Resp.error("The code error"))
        } else {
            let password = crypto.createHash('md5').update(json.password + json.phone).digest('hex');
            let d = {phone: json.phone, password}
            let u = await user.add(d)
            console.log(u);
            if(u.affectedRows > 0) {
                res.send(Resp.success())
            } else {
                res.send(Resp.error("Server error, please repeat later"))
            }
        }
    })
})

//login
app.post('/login', (req, res) => {
   let json = null;
    req.on('data', (chunk) => {
        const str = Buffer.from(chunk).toString()
        json= JSON.parse(str)
    })
    req.on('end', async () => {
        console.log("json:" , json);
        const u = await user.login(json);
        if(u != null) {
            req.session.userId = u.id
            res.send(Resp.success(u))
        } else {
            // res.send({code: 5000, msg: "The user name or passwoed error", data: null})
            res.send(Resp.error("The user name or passwoed error"))
        }
    })
})

// app.get('/addUser', (req, res) => {
//     user.del('15')
//     .then(res => {
//         console.log(res)
//     })
// })


//----------------------------blog data processing--------------------------

//Define the logic for managing the blog
//get all blog route
app.get('/blog/list', async (req, res) => {
    const user_id = req.query.user_id || '';  //get data user_id from data table, then keep in variable user_id 
    const keyword = req.query.keyword || '';  //get data keyword from data table, then keep in variable keyword
    const listDataPromise = await blog.getBlog(user_id,keyword); //it receives the keywords, get Promise and it's defined in './manage/blog.js'
    listDataPromise.then(listData => {
        console.log('listData', listData);
    })
})

//get the information about UserBlog route
app.get('/blog/detail', async (req, res) => {
    const id = req.query.id; //get data id from data table, then keep in variable id
    const detailDataPromise = await blog.getUserBlog(id); 
    detailDataPromise.then(detailData => {
        console.log('detailData', detailData);
    })
})

//add blog route, for POST request, we retrieve the data as a data stream(asynchronous code)
app.post('/blog/new', async (req, res) => {
    const user_id = 'Lili';
    req.body.user_id = user_id;
    const blogData = req.body;
    const newBlogDataPromise = blog.add(blogData);
    newBlogDataPromise.then(newblogData => {
        console.log('detailData',newblogData);
    })
})

//update blog route
app.post('/blog/update', async (req, res) => {
    const id = req.query.id; //get data id from data table, then keep in variable id
    const blogData = req.body;
    const updateBlogDataPromise = blog.update(id, blogData);
    updateBlogDataPromise.then(updateBlogData => {
        if(updateBlogData) {
            res.send(Resp.success(updateBlogData));
        }else{
            res.send(Resp.error("Failed to update blog!"));
        }
    })
})


//Delete blog route
app.post('/blog/delete', async (req, res) => {
    const id = req.query.id;
    const user_id = 'Lili';
    req.body.user_id = user_id;
    const deleteBlogDataPromise = blog.del(id,user_id);
    deleteBlogDataPromise.then(deleteBlogData => {
        if(deleteBlogData) {
            res.send(Resp.success(deleteBlogData));
        }else{
            res.send(Resp.error("Failed to delete blog!"));
        }
    })
})

//Listen on the server port
app.listen(3000, () => {
    console.log("server is start");
})