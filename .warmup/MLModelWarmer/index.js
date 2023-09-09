'use strict';

/** Generated by Serverless WarmUp Plugin **/

const AWS = require('@aws-sdk/client-lambda');
const lambda = new AWS.Lambda({
  apiVersion: '2015-03-31',
  region: 'eu-west-1'
});
const functions = [
  {
    "name": "ml-model-development-ml_model",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"KEEP_LAMBDA_WARM\"}",
      "concurrency": 2
    }
  }
];

function logVerbose(str) {
  
}

function getConcurrency(func, envVars) {
  const functionConcurrency = envVars[`WARMUP_CONCURRENCY_${func.name.toUpperCase().replace(/-/g, '_')}`];

  if (functionConcurrency) {
    const concurrency = parseInt(functionConcurrency);
    logVerbose(`Warming up function: ${func.name} with concurrency: ${concurrency} (from function-specific environment variable)`);
    return concurrency;
  }

  if (envVars.WARMUP_CONCURRENCY) {
    const concurrency = parseInt(envVars.WARMUP_CONCURRENCY);
    logVerbose(`Warming up function: ${func.name} with concurrency: ${concurrency} (from global environment variable)`);
    return concurrency;
  }

  const concurrency = parseInt(func.config.concurrency);
  logVerbose(`Warming up function: ${func.name} with concurrency: ${concurrency}`);
  return concurrency;
}

module.exports.warmUp = async (event, context) => {
  logVerbose('Warm Up Start');

  const invokes = await Promise.all(functions.map(async (func) => {
    const concurrency = getConcurrency(func, process.env);

    const clientContext = func.config.clientContext !== undefined
      ? func.config.clientContext
      : func.config.payload;

    const params = {
      ClientContext: clientContext
        ? Buffer.from(`{"custom":${clientContext}}`).toString('base64')
        : undefined,
      FunctionName: func.name,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Qualifier: func.config.alias || process.env.SERVERLESS_ALIAS,
      Payload: func.config.payload
    };

    try {
      await Promise.all(Array(concurrency).fill(0).map(async () => await lambda.invoke(params)));
      logVerbose(`Warm Up Invoke Success: ${func.name}`);
      return true;
    } catch (e) {
      console.error(`Warm Up Invoke Error: ${func.name}`, e);
      return false;
    }
  }));

  logVerbose(`Warm Up Finished with ${invokes.filter(r => !r).length} invoke errors`);
}