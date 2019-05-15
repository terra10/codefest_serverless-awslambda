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
        callback(undefined, await postBeerSimple(event));
    } catch (err) {
        callback(err);
    }
}

// Main function logic used by handler, test and local development
export async function postBeerSimple(event: APIGatewayProxyEvent) {

    // Let's build the headers for the response API call
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    };

    try {
        // Let's log whats in the API Gateway Event:
        console.debug(`postBeer | event: ${JSON.stringify(event)}`);

        // Get the information from the event we need like the request body and the unique request id
        const uniqueId: string = event.requestContext.requestId;
        const { beer_name, beer_date } = JSON.parse(event.body);

        // This is the SDK call for an upsert in DynamoDB which require tablename & unique ID for the record
        // with updateExpression and ExpressionAttributeValues all other values (2 in our case) can be stored
        const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: 't10a-serverless',
            Key: {
                identification: uniqueId
            },
            UpdateExpression: 'set beer_name = :item1, beer_date = :item2',
            ExpressionAttributeValues: {
                ':item1': beer_name,
                ':item2': beer_date
            }
        };

        // Execute the update with the documentClient using await for async (wait for response before continue)
        await documentClient.update(updateParams).promise();

        // All goes well so reply with a 201 http code, the headers and a response msg
        return {
            statusCode: 201,
            headers, // we don't need to type out "headers: headers", javascript understands it's the same
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
