// const fs = require('fs');
// function readFile(filename) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filename, (err, data) => {
//             if (err) reject(err);
//             resolve(data);
//         })
//     })
// }
// readFile("./vue.config.js").then((data) => {
//     console.log(data);

// }).catch(err => console.log(err));


// function testable(params) {
//     return function strong(target) {
//         target.params = true
//     }
// }

// @testable("test")
// class shibing {}

// console.log(shibing["test"]);


function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

function setAge(age) {
    return (target, name, descriptor) => {
        descriptor.value = age;
        return descriptor;
    }
}

class Person {
    @readonly
    name() {
        return "tom";
    }

    @setAge(20)
    age() {
        return this.age;
    }
}