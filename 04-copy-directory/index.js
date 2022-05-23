const fs = require('fs/promises');

async function copyFile(currentPath, copyPath) {
  const files = await fs.readdir(currentPath, { withFileTypes: true });
  files.forEach(el=>{
    if(!el.isFile()) {
      fs.mkdir(copyPath+'/'+el.name, {recursive: true}).then(()=>{
        copyFile(currentPath+'/'+el.name, copyPath+'/'+el.name);
      });
      
    } else {
      fs.copyFile(currentPath+'/'+el.name,copyPath+'/'+el.name );
    }
  });
}

async function clearFile(path) {
  const files = await fs.readdir(path, { withFileTypes: true });

  files.forEach(el=>{
    if(!el.isFile()) {
      clearFile(path+'/'+el.name).then(()=>{
        fs.rmdir(path+'/'+el.name, {}, err => {
          if(err) throw err;
        });
      });
    } else {
      fs.unlink(path+'/'+el.name);
    }
  });
}
(async()=>{
  const folderCopy = await fs.mkdir(__dirname+'/files-copy', {recursive: true});
  if(folderCopy === undefined) {
    await clearFile(__dirname+'/files-copy');
  }
  copyFile(__dirname+'/files', __dirname+'/files-copy');
})();
