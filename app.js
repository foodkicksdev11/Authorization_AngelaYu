require('dotenv').config()

// *************************************require all the needed packages***************************************************************//

const express = require('express');

const bodyParser = require('body-parser');

const ejs = require('ejs');

const app = express();

const encrypt = require('mongoose-encryption');

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));




// *************************************require all the needed packages***************************************************************//


// *************************************require Mongoose and build Schema and Model***************************************************************//


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');

}


const userSchema = new mongoose.Schema({

    email: String,
    password: String

});





// *************************************require Mongoose and build Schema and Model***************************************************************//


// ***********************Mongoose-Encryption*********************************//


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })


// ***********************Mongoose-Encryption*********************************//



const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})



app.post('/register', (req, res) => {

    const { username, password } = req.body;
    const newUser = new User ({
        email: username,
        password: password
    })

    newUser.save();

    try {
        res.render('secrets')
        console.log('Registered');
    } catch (error) {
        console.log(error);
    }
})


app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    await User.findOne({email: username})
    
    .then(user => {
        if(!user) {
            res.redirect('/login');
        }else {
            if(user.password === password) {
                res.render('secrets')
            }
        }
    })

    .catch((err) => {
        console.log(err);
      });

})





app.listen(3000, () => {
    console.log("Listening on Port 3000...");
})