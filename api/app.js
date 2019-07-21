const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-northeast-1',
  endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT,
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  try {
    let result = null;

    if (event.httpMethod === 'POST' && event.path === '/create') {
      result = await createRecord(event);
    } else if (event.httpMethod === 'GET' && event.path === '/') {
      result = await listRecords();
    }

    console.log("result", result)

    response = {
      message: 'success',
      result: result
    };
  } catch (err) {
    console.error(err);
    return err;
  }

  return response;
}

async function listRecords() {
  return await docClient
    .scan({
      TableName: 'Movies'
    })
    .promise();
}

async function createRecord(event) {
  const params = {
    TableName: 'Movies',
    Item: event.body
  };

  return await docClient
    .put(params)
    .promise();
}

// // const axios = require('axios')
// // const url = 'http://checkip.amazonaws.com/';
// let response;

// /**
//  *
//  * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
//  * @param {Object} event - API Gateway Lambda Proxy Input Format
//  *
//  * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
//  * @param {Object} context
//  *
//  * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
//  * @returns {Object} object - API Gateway Lambda Proxy Output Format
//  * 
//  */
// exports.lambdaHandler = async (event, context) => {
//     try {
//         // const ret = await axios(url);
//         response = {
//             'statusCode': 200,
//             'body': JSON.stringify({
//                 message: 'hello world',
//                 // location: ret.data.trim()
//             })
//         }
//     } catch (err) {
//         console.log(err);
//         return err;
//     }

//     return response
// };