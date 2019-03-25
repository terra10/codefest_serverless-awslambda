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
        callback(undefined, await postBeer(event));
    } catch (err) {
        callback(err);
    }
}

// Main function logic used by handler, test and local development
export async function postBeer(event: APIGatewayProxyEvent) {
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    };

    try {
        // Let's log whats in the Event:
        console.debug(`postBeer | event: ${JSON.stringify(event)}`);

        // Get the information from the event we need
        const eventBody = JSON.parse(event.body);
        const uniqueId: string = event.requestContext.requestId;

        const expressionAttributeValues = {};
        const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: 't10a-serverless',
            Key: {
                identification: uniqueId
            },
            ExpressionAttributeValues: expressionAttributeValues
        };

        Object.keys(eventBody).forEach(key => expressionAttributeValues[`:${key}`] = eventBody[key]);
        const array = Object.keys(eventBody).map(key => {
            return (`${key} = :${key}`);
        });
        updateParams.UpdateExpression = `set ${array.join(',')}`;
        console.debug('expressionAttributeValues: ' + JSON.stringify(expressionAttributeValues));
        console.debug('updateParams.UpdateExpression: ' + updateParams.UpdateExpression);
        await documentClient.update(updateParams).promise();

        // All goes well
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({id: uniqueId})
        };
    } catch (err) {
        console.error(`Unexpected 500 | ${err.message}`);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({message: err.message})
        };
    }
}
