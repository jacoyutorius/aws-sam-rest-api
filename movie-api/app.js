const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-northeast-1',
  endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT,
});

console.log("DYNAMODB_LOCAL_ENDPOINT", process.env.DYNAMODB_LOCAL_ENDPOINT);

const docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  try {
    let result = null;

    console.log("event.httpMethod", event.httpMethod)
    console.log("event.path", event.path)
    console.log("result", result)

    if (event.httpMethod === 'POST' && event.path === '/movies/create') {
      result = await createRecord(event);
    } else if (event.httpMethod === 'GET' && event.path === '/movies') {
      result = await listRecords();
    }

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'success',
        result
      })
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
    Item: JSON.parse(event.body)
  };

  return await docClient
    .put(params)
    .promise();
}