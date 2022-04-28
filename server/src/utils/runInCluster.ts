const cluster = require('cluster');
const { cpus } = require('os');
const process = require('process');
const { colors } = require('colors.ts');

interface IRunInCluster {
  bootstrap: () => Promise<void>;
  cores?: number;
}

export async function runInCluster({ bootstrap, cores }: IRunInCluster) {
  const numberOfCores = cpus().length;
  cores = cores || 1;
  const coresInUse = cores && cores < numberOfCores ? cores : numberOfCores;

  console.log(
    colors('blue', `number of cores = `) + colors('yellow', `${numberOfCores}`),
  );
  console.log(
    colors('blue', `cores in use = `) + colors('yellow', `${coresInUse}`),
  );
  console.log(
    colors('blue', `cluster is primary = `) +
      colors('yellow', `${cluster.isPrimary}`),
  );

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < coresInUse; ++i) {
      cluster.fork();
    }

    cluster.on('exit', (worker /* , code, signal */) => {
      console.log(`worker ${worker.process.pid} died.`);
    });
  } else {
    bootstrap();
    console.log(`Worker ${process.pid} started`);
  }
}
