import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as https from 'https';

const documentClient = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
        agent: new https.Agent({
            keepAlive: true
        })
    }
});

// Handler for AWS Lambda
export async function handler(_event: APIGatewayProxyEvent, _context: Context, callback: Callback) {
    try {
        callback(undefined, await getBeers());
    } catch (err) {
        callback(err);
    }
}

//  Main function logic used by handler, test and local development
export async function getBeers() {

    // console.debug('Received event:', JSON.stringify(event));
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    };

    try {
        // A scan for all records
        const params = {
            TableName: 't10a-serverless'
        };
        const response = await documentClient.scan(params).promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.Items)
        };
    }
     catch (err) {
        console.error(`Unexpected 500 | ${err.message} | ${err.detail}`);
        return {
            statusCode: 500,
            headers,
            body: undefined
        };
    }
}
