// const cluster = require('cluster')
// const http = require('http')
// const { cpus } = require('os')
// const process = require('process')

// const numCPUs = cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   http
//     .createServer((req, res) => {
//       res.writeHead(200);
//       res.end('hello world\n');
//     })
//     .listen(8000);

//   console.log(`Worker ${process.pid} started`);
// }

// function* createTestGenerator(a1) {
//   console.log('IN 1: next1:', a1);

//   const yield1Result = yield 'yield1 + ' + a1
//   console.log('IN 2: yield1Result:', yield1Result);

//   const yield2Result = yield 'yield2 + ' + yield1Result
//   console.log('IN 3: yield2Result:', yield2Result);

//   return 'return + ' + yield2Result
// }

// const testGenerator = createTestGenerator('value1')
// console.log('OUT 0: after create generator');

// const result1 = testGenerator.next('value2')
// console.log('OUT 1: ', result1.value);

// const result2 = testGenerator.next('value3')
// console.log('OUT 2: ', result2.value);

// const result3 = testGenerator.next('value4')
// console.log('OUT 3: ', result3.value);

// const result4 = testGenerator.next('value5')
// console.log('OUT 4: ', result4.value);

// //OUT 0: after create generator
// //IN 1: next1: value1
// //OUT 1: yield1 + value1
// //IN 2: yield1Result: value3
// //OUT 2: yield2 + value3
// //IN 3: yield2Result: value4
// //OUT 3: return + value4
// //OUT 4: undefined

class SoleraOAuthService {
  static instance = null
  static token = null
  constructor(token) {
    if (!SoleraOAuthService.instance) {
      console.log(`Creating Solera OAuth instance...`);
      SoleraOAuthService.instance = this;
      this.initClient = new Promise(SoleraOAuthService.initService);
    }
    else if (token && token !== SoleraOAuthService.token) {
      console.log(`Updating Solera OAuth instance with new token...`);
      SoleraOAuthService.instance = this;
      SoleraOAuthService.token = token;
      this.initClient = new Promise((resolve, reject) => SoleraOAuthService.initService(resolve, reject, token));
    }
    return SoleraOAuthService.instance;
  }

  static async initService(resolve, reject, token) {
    const instance = {
      token: SoleraOAuthService.token
    }
    resolve(instance);
  }
}

const getInstance = async (token) => {
  const instance = await new SoleraOAuthService(token).initClient
  console.log('instance=', instance);
  return instance
}

const ins1 = getInstance()
const ins2 = getInstance('test-token++++1')
// const ins3 = getInstance('test-token++++2')
const ins3 = new Promise((resolve) => {
  setTimeout(() => resolve(getInstance('test-token++++2')), 3000)
})
const ins4 = getInstance()
Promise.all([ins1, ins2, ins3, ins4]).then(([ins1, ins2, ins3, ins4]) => {
  console.log('ins1=', ins1);
  console.log('ins2=', ins2);
  console.log('ins3=', ins3);
  console.log('ins1 === ins2', ins1 === ins2);
  console.log('ins2 === ins3', ins2 === ins3);
  console.log('ins3 === ins4', ins3 === ins4);
  console.log('SoleraOAuthService.token in=', SoleraOAuthService.token);
})

console.log('SoleraOAuthService.token out=', SoleraOAuthService.token);