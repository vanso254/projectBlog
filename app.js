const express=require('express')
const path=require('path')
const passport=require('passport')
const session=require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const blogRouter=require('./server/routes/articleRouter.js')
const adminRouter=require('./server/routes/adminRouter.js')
const commentRouter=require('./server/routes/commentsRouter.js')
const connectToMongoDB = require('./server/database/mongodb')
const app=express()
const MongoStore = require('connect-mongo')

//connecting the mongoDb database using mongoose library
connectToMongoDB();

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
};

const mongoStore = MongoStore.create({ mongoUrl: 'mongodb://localhost/freeLanceBlog_DB'});
const mysqlStoreOptions = {
    host: 'localhost',
    port: 3306,
    user: 'vansoKenya',
    password: 'rootme',
    database: 'adminUsers',
};

const mysqlStore = new MySQLStore(mysqlStoreOptions);

// Middleware to use MongoDB session store for paths not starting with "/admin"
app.use((req, res, next) => {
    if (!req.path.startsWith('/admin')) {
        sessionConfig.store = mongoStore;
    }
    next();
}, session(sessionConfig));

// Middleware to use MySQL session store for paths starting with "/admin"
app.use('/admin', session({
    ...sessionConfig,
    store: mysqlStore,
}));

// app.use(session({
//     //secret: process.env.SECRET,
//     secret: 'some secret',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: 'mongodb://localhost/freeLanceBlog_DB' }),
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
//     }
// }));

app.use(passport.initialize());
app.use(passport.session())

//This line enables the use of a form to pass data to the database
app.use(express.urlencoded({extended:false}))

//Adding a public folder
app.set(express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')))
app.use('/uploads', express.static(path.resolve(__dirname, 'public/uploads')))

// tinyMce editor
app.use('/tinymce', express.static(path.join(__dirname, 'public/assets')));
app.use('/tinymceConfig', express.static(path.join(__dirname, 'public/assets/tinyMceEditor.js')));

//Adding the Froala path for css and js
app.use('/froalacss',express.static(__dirname+'/node_modules/froala-editor/css/froala_editor.css'))
app.use('/froalajs',express.static(__dirname+'/node_modules/froala-editor/js/froala_editor.min.js'))

//Setting up the router
app.use('/', blogRouter,commentRouter)
app.use('/admin',adminRouter)

app.listen(4000)