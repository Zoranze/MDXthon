const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = 'mongodb+srv://awotarowashaan:oZvjZnyjlaQQlAUw@testingcluster.ltvtgqi.mongodb.net/'; // Update this to your MongoDB URI
const dbName = 'TestingCluster'; // Replace with your database name
const collectionName = ers''us; // Replace with your collection name

let client;
let db;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = async () => {
    if (db) return db;
    try {
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(dbName);
        console.log('Connected to Database');
        return db;
    } catch (error) {
        console.error('Could not connect to the database:', error);
        throw error;
    }
};

// Handle sign-up form submission
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const db = await connectDB();
        const usersCollection = db.collection(collectionName);

        const user = await usersCollection.findOne({ username: username });

        if (user) {
            res.send('Username already exists. Please choose a different one.');
        } else {
            const hash = await bcrypt.hash(password, 10);
            await usersCollection.insertOne({ username, email, password: hash });
            console.log('User added');
            res.redirect('/dashboard.html');
        }
    } catch (err) {
        console.error(err);
        res.send('Error occurred during sign-up.');
    }
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await connectDB();
        const usersCollection = db.collection(collectionName);

        const user = await usersCollection.findOne({ username: username });

        if (!user) {
            res.send('User not found. Please sign up.');
        } else {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                res.redirect('/dashboard.html');
            } else {
                res.send('Incorrect password.');
            }
        }
    } catch (err) {
        console.error(err);
        res.send('Error occurred during login.');
    }
});

// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
