app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        // Find the user by username
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Compare the password with the stored hash
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password');
        }

        // If successful, send a success response
        res.status(200).send('Login successful');
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal server error');
    }
});
