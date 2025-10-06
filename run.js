const express = require('express');
const app = express();
const http = require('http').createServer(app);



app.use(express.static(__dirname));

http.listen(3000, "0.0.0.0", () => {
    console.log('Server is active on http://localhost:3000');
});