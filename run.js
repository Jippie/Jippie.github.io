const express = require('express');
const app = express();
const http = require('http').createServer(app);



app.use(express.static(__dirname));

/*keep untill solved
let swamp = "swamp"

app.get(`/${swamp}`, (req, res) => {
    res.sendFile(__dirname + "/swamp.html");
});

//keep untill solved
let snake = "snake"

app.get(`/${snake}`, (req, res) => {
    res.sendFile(__dirname + "/snake.html");
});*/

app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(`${__dirname}/${page}.html`);
});

http.listen(3000, "0.0.0.0", () => {
    console.log('Server is active on http://localhost:3000');
});