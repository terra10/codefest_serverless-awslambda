# TERRA 10 Serverless labs

## Lab 006 - Get all beers

## GET me some beers
When we understand the postBeerSimple typescript from [Lab003](../Lab003) and the _functions_ segment in the serverless.yml we can now build a simple GET to retrieve all records. 

Look at below code example to create the params for the documentClient.scan and the execution.

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

Create a src/getBeers.ts and use above code. Run `tsc` and make sure to add the function:
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

Please note the IAM role segment in serverless.yml where we now also need dynamodb:Scan as an added role.

## Test
Compile and deploy (`tsc && serverless deploy`). Then use Postman to execute a GET on /beer to get the list of beers.

## Solution
If you want check the /solution/getBeers.ts.