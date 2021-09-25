const express = require('express')
const cors  = require('cors')
const config = require('./app/config')
const setupContactRoutes = require('./app/routes/contact.routes')
const {BadRequestError} = require('./app/helpers/errors')

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));


setupContactRoutes(app)

app.get("/", (req, res)=>{
    res.json({message: 'Welcome to contact book application.'})
})

app.use((req, res, next)=>{
    next(new BadRequestError(404, "Resource not found"))
})

app.use((err,req, res, next)=>{
    console.log(err)
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    })
})

app.use(cors({origin : config.app.origins}))



const db = require('./app/models')

db.mongoose.connect(config.db.url)
    .then(()=>{
        console.log("Connected to the database!")
    })
    .catch((err) => {
        console.log("Cannot connect to the database!")
        process.exit()
    })




const PORT = config.app.port;

app.listen(PORT, function(){
    console.log(`Server is running oon port ${PORT}`)

})