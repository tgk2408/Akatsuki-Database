const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./authVerify');

const app = express();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//setting view engine ejs
app.set('view engine', 'ejs');

//database connection
const dbURI = 'mongodb+srv://newUser1:newPassword1@cluster0.jr4fg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((res) => app.listen(5000))
  .catch((err) => console.log(err));

//routes
app.get('*', checkUser);//* means all routes
app.get('/', (req, res) => res.render('home'));
app.get('/targets', requireAuth, (req, res) => res.render('targets'));

app.use(authRoutes);
