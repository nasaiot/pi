const express = require('express')
const app = express()
const cors = require('cors')
const Raspi = require('raspi-io').RaspiIO
const five = require('johnny-five')
const server_port = 8000

const board = new five.Board({
  io: new Raspi()
})

board.on("ready", function(){
    console.log("ready")
})

app.use(cors())

app.use(function(res,req,next){
    if(board.isReady){
        next()
    }else{
        res.send("board is not ready")
    }
    
})

app.get('/', (req, res) => {
  res.send("hello")
})


// servo

app.get('/servo/:pin/:degree', (req, res) => {
    const pin = `P1-${req.params.pin}`
    let degree = parseInt(req.params.degree)
    board.pinMode(pin,board.MODES.SERVO)
    board.servoWrite(pin,degree)
    res.json({
        err:false,
        msg:{
            pin:pin,
            degree:degree
        }
    })
})


// read

app.get('/digital/:pin', (req, res) => {
    const pin = `P1-${req.params.pin}`
    board.pinMode(pin,board.MODES.INPUT)
    board.digitalRead(pin,function(val){
        console.log(val)
        res.json({
            err:false,
            val:val
        })
    })
})

app.get('/analog/:pin', (req, res) => {
    const pin = `P1-${req.params.pin}`
    board.pinMode(pin,board.MODES.INPUT)
    board.analogRead(pin,function(val){
        console.log(val)
        res.json({
            err:false,
            val:val
        })
    })
})

// write
app.get('/digital/:pin/:value', (req, res) => {
    const pin = `P1-${req.params.pin}`
    let val = parseInt(req.params.value)
    if(!val){
        val=0
    }
    if(val>0){
        val=1
    }
    board.digitalWrite(pin,val)
    res.json({
        err:false,
        msg:{
            pin:pin,
            value:val
        }
    })
})
app.get('/analog/:pin/:value', (req, res) => {
    const pin = `P1-${req.params.pin}`
    let val = parseInt(req.params.value)
    board.analogWrite(pin,val)
    res.json({
        err:false,
        msg:{
            pin:pin,
            value:val
        }
    })
})

app.listen(server_port, '0.0.0.0',() => {
  console.log(`api listening at http://0.0.0.0:${server_port}`)
})