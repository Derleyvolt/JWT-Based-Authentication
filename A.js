const elapsed = Date.now();

let x = 10;

for(var i = 0; i < 10000; i++) {
    x = x + i;
}

console.log(x);

const current = Date.now();

console.log(new Date(elapsed) < new Date(current));