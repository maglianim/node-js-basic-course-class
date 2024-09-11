const mathUtils = require("./math-utils");

let i = 1;
const rangeSize = 50;
let current = 0;
const end = 5000;
let result = []

otherIncomingRequests();
const reqInterval = setInterval(() => {
    result.push(...longRequestPartitioned(current, current + rangeSize));
    current += rangeSize;
    if (current >= end) {
        clearInterval(reqInterval);
        console.log('result-->', result);
    }
}, 150);


/**
 * DO NOT CHANGE IT
 */
function otherIncomingRequests() {
    setInterval(() => {
        console.log(`Id: ${i++}. Doing new incoming request`);
    }, 50);
}


function longRequestPartitioned(from, to) {
    let id = i++;
    console.log(`Id: ${id}. Starting blocking request. Find primes from ${from} to ${to}`);
    const start = new Date();

    const primes = mathUtils.getPrimeNumbersWithinRange(from, to);

    const end = new Date();
    console.log(`Id: ${id}. Finished blocking request. Elapsed ms: ${end.getTime() - start.getTime()}`);

    return primes;
}

/**
 * DO NOT CHANGE IT
 * @param {*} n
 * @returns
 */
// function longRequest(n) {
//     let id = i++;
//     console.log(`Id: ${id}. Starting blocking request. Find primes from 2 to ${n}`);
//     const start = new Date();

//     const primes = mathUtils.getPrimeNumbersWithinRange(2, n);

//     const end = new Date();
//     console.log(`Id: ${id}. Finished blocking request. Elapsed ms: ${end.getTime() - start.getTime()}`);

//     return primes;
// }