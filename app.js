const express = require('express');
const app = express();  
const port = 8888;

app.use(express.static('public'));

app.get('', (req, res) => {
    res.sendFile(__dirname + 'index-3(1).html');
})

app.get('/logged', (req, res) => {
    res.sendFile(__dirname + 'index-3(2).html');
})

app.listen(port, () => console.info(`App listening on port: ${port}`));