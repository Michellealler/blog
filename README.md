# HF-idary blog system
## Team members
    Haiyan Wu、Hui zhao、Ying wang、Mengqi Wang
## Project introduction
This project is HF-IDARY Blog System, which is modeled after [CSDN](https://www.csdn.net/)Blog System. Is refer to the following two projects [gitee] (https://gitee.com/yflyfox/blog?_from=gitee_search) and [BiliBili] (https://www.bilibili.com/video/BV1KX4y1K7uz?p=18&t=775).
* The project is divided into four sections: user management, blog management, database management and page management.
* User management: provide the phone number to get user information, user login, register, add user information, update user information, delete user information, get all user information and other functions, in './manage/user.js';
* Blog management: add blogs, update blogs, delete blogs, get specific user's blog information, get all blogs and other functions in './manage/blog.js';
* Database management: created four tables, t_user for blog properties, T_USER for user properties, in './blog.sql ', create database connection in './db.js'
* page management: this project adopts [layui] (https://www.layui.com/doc/) template.
  > Layui is a set of open source Web UI solutions, using its own classic modular specifications, and follow the native HTML/CSS/JS development mode, easy to use, just use it.

    EJS is introduced to set the header and tail of the page as templates, which can be used in many pages of the blog. The header file of the page is in '.pages/header. HTML ', and the tail file of the page is in './pages/footer. HTML '. The CSS file is in './static/ CSS /style.css '.

## The development tools
   **Develop software**：`VS Code2019`、`cmd`、`mysql`、`mysql workbench8.0`、`postman`、`Google Chrome`
   **Development of language**：`nodejs`、`express`、`mysql`

## Development steps
#### Front end
1. Use EJS templates and Layui templates
2. Realized functions
   1. Register page
   2. Login page
   3. The initial page
   4. Basic page layout
   5. There are some features that are not implemented in the front end, such as user management and blog management
   
3. The interface display
```
//import ejs
app.engine('.html', require('ejs').__express);


<link rel="stylesheet" href="static/layui/css/layui.css">

<script src="static/layui/layui.all.js"></script>
```
   
#### The back end
1. The background is built by 'Express + MySQL'
2. route
   ```javascript
    module.exports = {
       //1: for page jump
        app.get('/', (req, res) => {  //send a GET request
            res.render('index', {
            title: 'HF-idary'
            })
        })
        app.get('/toLogin', (req, res) => { //Jump the login page
            res.render('login', {
            title: "HF-idary login"
            })
        })
        app.get('/toRegister', (req, res) => { //Jump the register page
            res.render('register', {
            title: "HF-idary register"
            })
        })
        app.get('/userInfo', (req, res) => {  //Jump the personal center
            res.render("user-info", {
            title:"HF-idary personal center"
            })
        })   
        //2. user data processing
        app.get('/user/getUserByPhone', async (req, res) => { //Determine wheter the user information already exists 
            const use = await user.getUserByPhone(req.query.phone)
            if(use.length > 0) {
                res.send(Resp.error("User already exists"))
            } else {
                res.send(Resp.success(null))
        }
        app.get('/getCode', (req, res) => { //get verification code
            let code = Math.floor(Math.random() * 10000);
            req.session.code = code
            console.log("code", code);
            res.send(Resp.success(null))
        })
        app.post('/register', (req, res) => { //register
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
        app.post('/login', (req, res) => {   //login
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
        //3.blog data processing
        //get all blog route
        app.get('/blog/list', async (req, res) => {
            const user_id = req.query.user_id || '';
            const keyword = req.query.keyword || '';  
            const listDataPromise = await blog.getBlog(user_id,keyword); 
            listDataPromise.then(listData => {
            console.log('listData', listData);
            })
        })
        app.get('/blog/detail', async (req, res) => {  //get the information about UserBlog route
            const id = req.query.id; //get data id from data table, then keep in variable id
            const detailDataPromise = await blog.getUserBlog(id); 
            detailDataPromise.then(detailData => {
                console.log('detailData', detailData);
            })
        })
        app.post('/blog/new', async (req, res) => { //add blog route, for POST request, we retrieve the data as a data stream(asynchronous code)
            const user_id = 'Lili';
            req.body.user_id = user_id;
            const blogData = req.body;
            const newBlogDataPromise = blog.add(blogData);
            newBlogDataPromise.then(newblogData => {
                console.log('detailData',newblogData);
            })
        })
        app.post('/blog/update', async (req, res) => {//update blog route
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
       
        app.post('/blog/delete', async (req, res) => {  //Delete blog route
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
   ```

#### Project start
1. Go to the project and install the dependencies
Create a new Blog project file and open it in VS Code
```
//Initialize the project
npm init  
//install express  
yarn add express   
//install mysql  
yarn add mysql      
```

2. Start the project
```
//Run the project  
node add.js  
```

3. Import database tables
- install mysql
- Enter the following command on the command line
//login mysql
mysql - uroot -p
- Open the database
- Run the blog.sql file

4. Browser access[http://localhost:3000](http://localhost:3030)



## Project summary
Through the study of this project, we have a deeper understanding of Web development. Compared with the previous textbook knowledge, we had a deeper understanding of the development of practical projects, which was also a great challenge for us. We had little experience in the development of practical projects before, and we learned a lot from this project. In this project, our team cooperated well, searched for information, analyzed the project structure through the project requirements, and solved the problems in time. However, there were still some problems. For example: our implementation is relatively rough, many functions have not been implemented; We didn't know much about the Web and didn't know how to do it at the beginning, so it took a long time. Through this project, we deeply realized that our knowledge is still comprehensive enough and we have learned too little. We need to spend more time on web learning in the future.
