const readline = require('readline');
const fs = require('fs');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const stream = fs.createWriteStream(__dirname+'/text.txt');

fs.writeFile(__dirname+'/text.txt','', (err)=>{
  if(err) throw new Error();
  console.log('Приветствие!!!');
});

rl.on('line', (input) => {
  if(input === 'exit') {
    console.log('Прощальное сообщение!');
    rl.close();
  } else {
    stream.write(input+'\r');
    console.log(`Received: ${input}`);
  }
  
});

rl.on('SIGINT', () => {
  console.log('Прощальное сообщение!');
  rl.close();
});
