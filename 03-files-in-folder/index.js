const fs = require('fs/promises');
const path = require('node:path');

(async()=>{
  const files = await fs.readdir(__dirname + '/secret-folder', { withFileTypes: true });
  const arrIsFile = files.filter(el=>el.isFile());
  arrIsFile.forEach(el=>{
    fs.stat(`${__dirname}/secret-folder/${el.name}`).then(data=>{
      console.log(`${path.basename(el.name,path.extname(el.name))} - ${path.extname(el.name).slice(1)} - ${data.size}`);
    });  
  });
})();

