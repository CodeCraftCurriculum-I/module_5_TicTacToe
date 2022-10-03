


const sammling = ["A","B"];
const sammling2 = new Array(10);

const DICTIONARY = {
    "en":{"hello":"hi"}
}


function sum(tall1,tall2){
    //let sumAvTall = tall1 + tall2;
    //return sumAvTall;
    let sum = tall1 + tall2;
    
    if(tall1 > tall2){
        sum = tall1 - tall2;
    }

    return tall1 + tall2;
}

let forbruk = 3000;
let nettleie = 400;
let stromRegning = sum(forbruk,nettleie);

console.log(stromRegning)


const A = new Array();
const B = new Array(10);
const C = [];
const D = ["🙂", "🔥", "🚀"];

console.log("A ->", A);
console.log("B ->", B);
console.log("C ->", C);
console.log("D -> ", D);

console.log("D[1] -> ", D[1]); // -> 🔥

for (let i = 0; i < D.length; i++) {
  console.log(D[i]);
}

console.log("---------");

D.pop();
console.log("D -> ", D);
D.push("🛠");
console.log("D -> ", D);
D.reverse();
console.log("D -> ", D);

for (let i in D) {
  console.log(D[i]);
}

for (let item of D) {
  console.log(item);
}


function sum(tall1, tall2) {
    return tall1 + tall2;
  }
  
  // 1 + 2
  sum(1, 2);
  
  // 1+ 2 + 3?
  sum(sum(1, 2), 3);
  
  //----------------------------------
  
  function superSum(...tall) {
    let sum = 0;
    for (let t of tall) {
      sum = sum + t;
    }
    return sum;
  }
  
  console.log(superSum(1, 2, 3));
  console.log(superSum(1, 2, 3, 5, 3, 66, 45));
  
  // ---------------------------------
  
  let collection = [1, 2, 3, 4];
  let [a, b, c, d] = collection;
  console.log(collection);
  console.log(...collection);
  console.log(c);

