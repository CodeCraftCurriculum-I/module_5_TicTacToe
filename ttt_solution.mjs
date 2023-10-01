//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout
});
//#endregion

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const brett = [
  [0,0,0],
  [0,0,0],
  [0,0,0]
];

const spillerSymbolA = "X";
const spillerSymbolB = "O";

const spillerVerdiA = 1;
const spillerVerdiB = -1;

let fortsattSpill = true;
let aktivSpiller = spillerVerdiA; 

while(fortsattSpill){

  console.clear();
  visSpilleBrett(brett);
  const trekk = await sporeSpillerOmTrekk(brett);
  
  const rad = trekk[0];
  const kollne = trekk[1];
  brett[rad][kollne] = aktivSpiller;


  aktivSpiller = aktivSpiller * -1;
  let resultat = harNoenVunnet(brett);
  if(resultat !== 0){
    fortsattSpill = false;
    console.clear();
  visSpilleBrett(brett);
    console.log("Spiller " + resultat + " vant ");
  }
}

function harNoenVunnet(brett){

  // rader...
  for(let radPos = 0; radPos < brett.length; radPos++){
    const rad = brett[radPos];
    let sum = 0;
    for(let kolonePos = 0; kolonePos < brett.length; kolonePos++){
        sum = sum + rad[kolonePos];
    }

    if(sum === 3){
      return spillerVerdiA;
    } else if (sum === -3){
      return spillerVerdiB;
    }
  }

  // Koloner 
  for(let kolonePos = 0; kolonePos < brett.length; kolonePos++){
    let sum = 0;
    for(let radPos = 0; radPos < brett.length; radPos++){
      let rad = brett[radPos];
      sum = sum + rad[kolonePos];
    }

    if(sum === 3){
      return spillerVerdiA;
    } else if (sum === -3){
      return spillerVerdiB;
    }

  }

  return 0;
}

async function sporeSpillerOmTrekk(brett){
  let trekk = [];
  
  do{
   
    console.log(`Spiller ${aktivSpiller === spillerVerdiA ? 1:2}(${aktivSpiller === spillerVerdiA ? spillerSymbolA:spillerSymbolB}) det er din tur`)

    let playerSelection = await rl.question("Hvor setter du merket ditt? (rad kolone) ")
    playerSelection = playerSelection.trim();
    trekk = playerSelection.split(" ");
    if(trekk.length !== 2){
      trekk = playerSelection.split(",");
    }

    trekk[0] = trekk[0] -1; 
    trekk[1] = trekk[1] -1;

  } while( !erTrekkGyldig(trekk,brett))
  return trekk;
}

function erTrekkGyldig(trekk, brett){
  if(trekk.length != 2){
    return false;
  }

  const rad = trekk[0];
  const kollone = trekk[1];
  return brett[rad][kollone] === 0;
}

function visSpilleBrett(brett){

  console.log("    1   2   3  ");
  console.log("  ╔═══╦═══╦═══╗");

  for(let radPos = 0; radPos < brett.length; radPos++){
    const rad = brett[radPos];
    console.log(`${radPos+1} ║ ${visningForCelle(rad[0])} ║ ${visningForCelle(rad[1])} ║ ${visningForCelle(rad[2])} ║`)
    if(radPos < brett.length-1){
      console.log(`  ╠═══╬═══╬═══╣`);  
    }
  }

  console.log(`  ╚═══╩═══╩═══╝`);
}

function visningForCelle(celle){
  if(celle === spillerVerdiA){
    return GREEN + spillerSymbolA + RESET;
  } else if(celle === spillerVerdiB){
    return RED + spillerSymbolB + RESET;
  }
  return " ";
}





