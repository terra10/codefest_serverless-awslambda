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
export async function handler(event: APIGatewayProxyEvent, _context: Context, callback: Callback) {
    try {
        callback(undefined, await getBeer(event));
    } catch (err) {
        callback(err);
    }
}

//  Main function logic used by handler, test and local development
export async function getBeer(event: APIGatewayProxyEvent) {

    // console.debug('Received event:', JSON.stringify(event));
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    };

    try {
        const identification = event.pathParameters.identifier;

        const queryParams = {
            TableName: 't10a-serverless',
            Key: {identification}
        };

        const result = await documentClient.get(queryParams).promise();
        if (result.Item) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result.Item)
            };
        }
        console.error('Return 404 | Geen item gevonden');
        return {
            statusCode: 404,
            headers,
            body: undefined
        };
    } catch (err) {
        console.error(`Unexpected 500 | ${err.message} | ${err.detail}`);
        return {
            statusCode: 500,
            headers,
            body: undefined
        };
    }

}
