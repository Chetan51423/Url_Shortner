const express = require("express");
const app = express();

const path = require('path')
const staticRouter = require('./routes/staticRouter');
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const {connectToMongoDB} = require('./connect');
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


app.use(express.json());
app.use(express.urlencoded({extended:false}))
// app.get('/test', async(req, res)=>{
//     const allURLs = await URL.find({});

//     return res.render("home",{urls:allURLs,});
// })

app.use("/url",urlRoute);
app.use("/",staticRouter);
app.get('/url/:shortId',async(req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push:{ 
            visitHistory:{
            timestamp: Date.now(),
        },}
    })

    res.redirect(entry.redirectURL);
})

// app.get('/analytics/:id', (req, res)=>{
//     shortId = req.params.shortId;

// })


app.listen(port, ()=> console.log(`server is started at Port: ${port}`))