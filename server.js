const express = require('express')
const cors  = require('cors')
const config = require('./app/config')
const setupContactRoutes = require('./app/routes/contact.routes')



const app = express()
setupContactRoutes(app)

app.use(cors({origin : config.app.origins}))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))

app.get("/", (req, res)=>{
    res.json({message: 'Welcome to contact book application.'})
})

const PORT = config.app.port;

app.listen(PORT, ()=>{
    console.log(`Server is running oon port ${PORT}`)

})