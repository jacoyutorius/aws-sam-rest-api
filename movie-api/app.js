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