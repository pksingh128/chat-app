
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const moment = require('moment');


const PORT = process.env.PORT || 8080
http.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})

//middleware to render public file
app.use(express.static(path.join(__dirname, 'public')));

const users = {};

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})


//socket
const io = require('socket.io')(http);

io.on('connection', (socket)=>{
    console.log("connected..")
    //if any new user joins, let other users connected to the server know.
    socket.on('new-user-joined',({name}) =>{
        //console.log("new user",name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    
    //if someone sends the message, broadcast to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]});
    });


//if someone leave the chat let other know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


socket.on('typing', ({name}) => {
    
    socket.broadcast.emit('typing', name);
})
})