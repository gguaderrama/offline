'use strict';
const dynamoDb = require('aws-sdk/clients/dynamodb');
// var bodyParser = require('body-parser')

exports.lambdaHandler = async (event, context) => {

    const reqBody = JSON.stringify(event.body)
    try {
        const params = {
            TableName: 'User',
            Item: {
                'pk': '3',
                'name' : 'JOSEFINA 3D'
              }
        };
        const deleteParams = {
            Key: {
                'pk': '1',
            },
            TableName: 'User',
          };
        const docClient = exports.getDynamoDbDocumentClient();
        
        // const response = await docClient.scan(params).promise();

          let response = []
          let messageTest = []
        switch (event.httpMethod) {
            case 'DELETE':
                response = await docClient.delete(deleteParams).promise(); 
                break;
            case 'GET':
                response = await docClient.scan(params).promise().then(function(data) {
                    console.log(data);
                    messageTest = data
                  }).catch(function(err) {
                    console.log(err);
                  });  
                break;         
            case 'POST': 
                 response = await docClient.put(params).promise().then(function(data) {
                    console.log(data);
                  }).catch(function(err) {
                    console.log(err);
                  });  
                break;
            case 'PUT':
                response = await docClient.update(params).promise();  
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }    
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                items: reqBody 
            })
        };
    } catch (err) {
        console.log(err);       
        return {
            'statusCode': 400,
            'body': JSON.stringify({
                items: err +' '+ 'ERROR --------------->'
            })
        };
    }
};

exports.getDynamoDbDocumentClient = () => {
    console.log(process.env.USE_LOCAL_DYNAMODB);
    if (process.env.USE_LOCAL_DYNAMODB) {
        return new dynamoDb.DocumentClient({'endpoint': 'http://dynamo-local:8000'});
    } else {
        return new dynamoDb.DocumentClient();
    }
}
