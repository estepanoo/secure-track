const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
dotenv.config();
const UserRouter = require('./routes/user');
const LuggageRouter = require('./routes/luggage')  

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(cookieParser());
app.use('/auth', UserRouter); 
app.use('/luggage-router', LuggageRouter)

mongoose.connect('mongodb://localhost:27017/secure_track_db')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use('/', router);

const port = process.env.PORT || 3001;  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
