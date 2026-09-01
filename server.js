
require('dotenv').config()


const express = require('express')
const app = express()
const session=require('express-session')
const PORT = process.env.PORT || 3030;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const { Server } = require("socket.io");
const io = new Server(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

process.env.NODE_ENV = 'development';
const passport = require('passport');

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.render('home')
  res.render('pages/auth')
  // res.redirect(`/${uuidV4()}`)
})

app.get('/room', (req,res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/board/:room', (req, res) => {
  res.render('whiteBoard', { roomId: req.params.room })
})

app.get('/logout', (req, res) => {
  res.render('logout')
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

let connections = [];

io.on('connect', socket => {
  connections.push(socket)
  console.log(`${socket.id} connected`)

  socket.on('join-room', (roomId, userId) => {
    socket.roomId = roomId
    socket.userId = userId
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
    })

    //whiteboardwindow
    socket.on('openBoard', () => {
      io.to(roomId).emit('boardOpen')
    })

    // socket.on('closeBoard',()=>{
    //   connections.forEach((con)=>{
    //     con.emit('boardClose')
    //   })
    // })
  })

  // Whiteboard windows register their room via this event so drawing
  // events can be scoped correctly without triggering user-connected.
  socket.on('join-board', (boardRoomId) => {
    socket.roomId = boardRoomId
    socket.join(boardRoomId)
  })

  socket.on('draw', (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('onDraw', { x: data.x, y: data.y })
    }
  })

  socket.on('erase', (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('onErase', { x: data.x, y: data.y })
    }
  })

  socket.on('clear', () => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('onClear')
    }
  })

  socket.on('mouseDown', (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('onDown', { x: data.x, y: data.y })
    }
  })

  // Single disconnect handler per socket. Notifies the room only for
  // video-room sockets (which have userId set via join-room).
  socket.on('disconnect', () => {
    if (socket.roomId && socket.userId) {
      socket.to(socket.roomId).emit('user-disconnected', socket.userId)
    }
    connections = connections.filter((con) => con.id !== socket.id)
  })
})

//authentication
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));

// app.get(`/${uuidV4()}`, function(req, res) {
//   res.render('pages/auth');
// });

var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3030/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    //res.redirect('/success');
    res.render('home')
  });

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
