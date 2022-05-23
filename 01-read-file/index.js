const fs = require('fs');

const stream = fs.createReadStream(__dirname+'/text.txt');
stream.on('data', (chunk)=>{
  console.log(chunk.toString());
});