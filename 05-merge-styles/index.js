const fs = require('fs');
const path = require('node:path');

(async()=>{
  await fs.promises.writeFile(__dirname+'/project-dist/bundle.css','', (err)=>{
    if(err) throw new Error();
  });
  const files = await fs.promises.readdir(__dirname + '/styles', { withFileTypes: true });
  const arrIsFile = files.filter(el=>el.isFile()&&path.extname(el.name)==='.css');
  const streamWrite = fs.createWriteStream(__dirname+'/project-dist/bundle.css');
  for(let file of arrIsFile) {
    const stream = fs.createReadStream(__dirname+'/styles/'+file.name);
    stream.on('data', chunk=>{
      streamWrite.write(chunk);
    });
  }
})();