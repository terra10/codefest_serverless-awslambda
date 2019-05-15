# TERRA 10 Serverless labs

## Lab 006 - Get all beers

## GET me some beers
If we understand the postBeerSimple typescript from lab003 and the functions segment in the serverless.yml we will now build a simple GET to retrieve all records. 

Look at below code example to create the params for the cocumentClient.scan and the execution.

```
    try {
        // a scan for all records
        const params = {
            TableName: 't10a-serverless'
        };
        const response = await documentClient.scan(params.promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.Items)
        };
    }
```

Create a src/getBeers.ts and use above example. Run tsc and make sure to add the function w
```
  getBeers:
    handler: lib/getBeers.handler
    description: GET all beers
    events:
      - http:
          method: get
          path: beer
          private: true
```

Remember the IAM role segment in serverless.yml where we now also need dynamodb:Scan

## Test
Compile and deploy (tsc && serverless deploy). Then use Postmen to execute a GET on /beer to get the list of beers

## Solution
If you want check the /solution/getBeers.ts