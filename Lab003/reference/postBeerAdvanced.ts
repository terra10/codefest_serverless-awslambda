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
        callback(undefined, await postBeerAdvanced(event));
    } catch (err) {
        callback(err);
    }
}

// Main function logic used by handler, test and local development
export async function postBeerAdvanced(event: APIGatewayProxyEvent) {

    // Let's build the headers for the response API call
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    };

    try {
        // Let's log whats in the API Gateway Event:
        console.debug(`postBeer | event: ${JSON.stringify(event)}`);

        // Get the information from the event we need like the request body and the unique request id
        const eventBody = JSON.parse(event.body);
        const uniqueId: string = event.requestContext.requestId;

        // We are going to initiate the updateParams object here
        //   which we strong type to AWS.DynamoDB.DocumentClient.UpdateItemInput to get some TypeScript magic
        //   we define the DynamoDB Tablename + the unique key and it's new value
        //   the ExpressionAttributeValues is empty for know since we don't know how many elements the POST will contain
        const expressionAttributeValues = {};
        const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: 't10a-serverless',
            Key: {
                identification: uniqueId
            },
            ExpressionAttributeValues: expressionAttributeValues
        };

        // Here is the magic where we loop over all the elements in the POST message eventBody
        // This key (each element) will be used to build up the expressionAttributeValues
        // And will end up something like { item1: value1, item2: value2}
        Object.keys(eventBody).forEach(key => expressionAttributeValues[`:${key}`] = eventBody[key]);
        // Next we will loop again, yes this can be more efficiently done, to build the UpdateExpression
        // This will end up something like: "set item1 = :value1,item2 = :value2"
        const array = Object.keys(eventBody).map(key => {
            return (`${key} = :${key}`);
        });
        updateParams.UpdateExpression = `set ${array.join(',')}`;
        // Let's take a look at both dynamic objects which are required for the AWS.DynamoDB.DocumentClient.UpdateItemInput
        console.debug('expressionAttributeValues: ' + JSON.stringify(expressionAttributeValues));
        console.debug('updateParams.UpdateExpression: ' + updateParams.UpdateExpression);
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
