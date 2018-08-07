Number.prototype.positivep = function() {
  return this > 0;
};

Number.prototype.negativep = function() {
  return this < 0;
};

Number.prototype.zerop = function() {
  return this === 0;
};

const _Number = Object.create(Number);
// console.log(new Number(3).toString.toSource());

// const Number = new Proxy(_Number, {
//   get(target, key) {
//     if (key === 'positivep') {

//     }
//   }
// })
