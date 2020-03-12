const exec = require('child_process').exec;
const querystring = require("querystring");
const fs = require('fs');
const file = fs.readFileSync('./static/index.html');

const sleep = time => {
    let currentTime = new Date().getTime();
    console.log(currentTime)
}

const start = res => {
    res.writeHead(200, { 'Content-Type': 'html' });
    res.write(file);
    res.end()
}

const upload = (res, postData) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.write(querystring.parse(postData).text);
    res.write(postData);
    res.end()
}

exports.start = start;
exports.upload = upload;