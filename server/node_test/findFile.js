const fs = require('fs');
const data = fs.readFileSync('./static/textB.txt');
console.log(data.toString());
console.log("程序执行结束!");


const fs = require("fs");
fs.readFile('./static/textB.txt',(err, data) => {
  if (err) return console.error(err);
  console.log(data.toString());
});

console.log("程序执行结束!");
