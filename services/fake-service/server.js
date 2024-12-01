const express = require('express');
const app = express();

app.get('/api/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/login', (req, res) => {
    res.send(`Login success! Welcome!`);
});

app.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
});
