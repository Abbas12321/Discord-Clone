import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import mongoData from './mongoData.js'
import Pusher from 'pusher'
// const { MongoClient, ServerApiVersion } = require('mongodb');

// app config
const app = express()
const port = process.env.PORT || 8080

const pusher = new Pusher({
    appId: "1527960",
    key: "8cfb7c12a9dba698e6ce",
    secret: "bde7194844f9f015f773",
    cluster: "ap2",
    useTLS: true
});

// middlewares
app.use(express.json())
app.use(cors())

// db config
mongoose.set('strictQuery', false);       
const mongoURI = `mongodb+srv://admin:bTI7KVu0vno7kyZb@cluster0.aecvwqw.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open' ,() =>{
    console.log('DB Connection')

    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) =>{
        if(change.operationType === 'insert') {
            pusher.trigger('channels', 'newChannels', {
                'change' : change
            });
        } else if (change.operationType === 'update' ){
            pusher.trigger('conversation' , 'newMessage', {
                'change' : change
            });
        } else{
            console.log('Error triggering Pusher')
        }
    })
})

// api routes
app.get('/',(req,res)=>{
    res.status(200).send('hello guys');
})

app.post('/new/channel', (req,res) =>{
    const dbData = req.body

    mongoData.create(dbData, (err, data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.get('/get/channelList',(req,res)=>{
    mongoData.find((err,data) =>{
        if(err) {
            res.status(500).send(err)
        }else{
            let channels = []

            data.map((channelData) =>{
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo)
            })
            res.status(200).send(channels)
        }
    })
})

app.post('/new/message',(req, res) =>{
    const id = req.query.id
    const newMessage = req.body

    mongoData.find(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) =>{
            if(err) {
                console.log("Error saving message...")
                console.log(err)

                res.status(500).send(err)
            }else{
                res.status(201).send(data)
            }
        }
    )
})

app.get('/get/data', (req,res) =>{
    mongoData.find((err, data) =>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.get('/get/conversation', (req,res) =>{
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) =>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

// listed
app.listen(port, ()=>{
    console.log(`server listening to the ${port}`)
})

