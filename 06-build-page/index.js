const fs = require('fs');
const path = require('node:path');

async function copyFile(currentPath, copyPath) {
  const files = await fs.promises.readdir(currentPath, { withFileTypes: true });
  files.forEach(async el=>{
    if(!el.isFile()) {
      await fs.promises.mkdir(copyPath+'/'+el.name, {recursive: true});
      await copyFile(currentPath+'/'+el.name, copyPath+'/'+el.name);
      
    } else {
      await fs.promises.copyFile(currentPath+'/'+el.name,copyPath+'/'+el.name );
    }
  });
}

async function clearFile(path) {
  const files = await fs.promises.readdir(path, { withFileTypes: true });
  files.forEach(async el=>{
    if(!el.isFile()) {
      await clearFile(path+'/'+el.name);
      //await fs.promises.rmdir(path+'/'+el.name);
    } else {
      await fs.promises.unlink(path+'/'+el.name);
    }
  });
}
(async()=>{
  //COPY ASSETS --------------------------------------
  await fs.promises.mkdir(__dirname+'/project-dist', {recursive: true});
  const folderCopy = await fs.promises.mkdir(__dirname+'/project-dist/assets', {recursive: true});
  if(folderCopy === undefined) {
    await clearFile(__dirname+'/project-dist/assets');
  }
  copyFile(__dirname+'/assets', __dirname+'/project-dist/assets');
  //CREATE STYLE -----------------------------------
  await fs.promises.writeFile(__dirname+'/project-dist/style.css','', (err)=>{
    if(err) throw new Error();
  });
  const files = await fs.promises.readdir(__dirname + '/styles', { withFileTypes: true });
  const arrIsFile = files.filter(el=>el.isFile()&&path.extname(el.name)==='.css');
  const streamWrite = fs.createWriteStream(__dirname+'/project-dist/style.css');
  for(let file of arrIsFile) {
    const stream = fs.createReadStream(__dirname+'/styles/'+file.name);
    stream.on('data', chunk=>{
      streamWrite.write(chunk);
    });
  }
  //CREATE INDEX.HTML
  let mainPage = await fs.promises.readFile(__dirname+'/template.html');
  const components = await fs.promises.readdir(__dirname + '/components', { withFileTypes: true });
  const arrIsComponents= components.filter(el=>el.isFile()&&path.extname(el.name)==='.html');
  arrIsComponents.forEach(async item=>{
    const component = await fs.promises.readFile(__dirname+'/components/'+item.name);
    mainPage = await mainPage.toString().replace(`{{${path.basename(item.name,path.extname(item.name))}}}`, component);
    await fs.promises.writeFile(__dirname+'/project-dist/index.html',mainPage, (err)=>{
      if(err) throw new Error();
    });
  });
})();
