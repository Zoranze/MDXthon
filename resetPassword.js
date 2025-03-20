app.post('/reset-password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).send('Username and new password are required');
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        // Find the user by username
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        // Update the user's password in the database
        await usersCollection.updateOne({ username }, { $set: { password: hashedPassword } });

        // Send success response
        res.status(200).send('Password reset successful');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Internal server error');
    }
});
