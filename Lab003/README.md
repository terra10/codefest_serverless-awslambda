# TERRA 10 Serverless labs

## Lab 003 - The first real Lambda Service

## The first POST function
* copy the postBeerSimple.ts from this Lab to the /src folder

Let's examine the file:
* first we handle the imports, which are according to tslint alphabitized
* We see the handler used by API Gateway and the Serverless Framework which always contains 3 variables. 
    * context
    * event
    * callback  
* The main logic is placed in the _export async function_ which the handler asynchronously calls (hence the await)
* The main logic starts with setting up the headers for the response
* Then in the try we first retrieve the values from the POST request body
* Second we define the parameters for the AWS SDK call to DynamoDB
* Finally we call the documentClient asynchronously again (the await is always crucial)
* If all goes well we return a 201 and if an error occurs we return a 500

## setup the serverless framework
Add the following lines underneath the functions: segment in your serverless.yml
``` 
postBeer:
  handler: lib/postBeerSimple.handler
  description: POST our new beers in DynamoDB
  events:
    - http:
        method: post
        path: beer
```

We can also delete the Hello example function because we won't be needing it anymores and compile + deploy:
``` 
tsc && sls deploy
```

## API endpoint & REST call
We will need the API endpoint from the AWS stage which is generated, so
* Check the AWS API Gateway: https://eu-west-3.console.aws.amazon.com/apigateway/home#/apis
* Select: dev-t10*-serverless -> Stages -> Dev
* There should be an invoke URL like: https://***********.execute-api.eu-west-3.amazonaws.com/dev
* Use a tool like Postman and fire a POST request to the url + /beer

Request:
``` 
{
  "beer_name": "Heiniken",
  "beer_date": "2019-01-31"
}
```
If all goes "well" you should receive a 500 with response:
``` 
{
    "message": "User: arn:aws:sts::*:assumed-role/t10*-serverless-dev-eu-west-3-lambdaRole/t10a-serverless-dev-postBeer is not authorized to perform: dynamodb:UpdateItem on resource: arn:aws:dynamodb:eu-west-3:*:table/t10*-serverless"
}
```

## AWS Lambda roles
So now we have it. We can execute our first POST Lambda but on runtime it assumes a role which does not have permissions to dynamodb:UpdateItem on our table. So know what ?

Add the following lines underneath the provider: segment in your serverless.yml
``` 
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:UpdateItem
      Resource:
        - arn:aws:dynamodb:${self:provider.region}:*:table/${self:service.name}
```

The Serverless framework will help you to create an AWS IAM Role for the Lambda function and add IAM Policy permissions to insert an item in your database. Manually this is a very labor intensive step and Serverless does it all for you.

So deploy again (we don't need the compile here, but its better to get used to it):
``` 
tsc && sls deploy
```

## Try the API call again
Request:
``` 
{
  "beer_name": "Heiniken",
  "beer_date": "2019-01-31"
}
```
If all goes well you should receive a 201 with response:
``` 
{
    "id": "xxxxxxxxxxxxx"
}
```

## Summary
So let's check:
* Items in DynamoDB table: https://eu-west-3.console.aws.amazon.com/dynamodb
* Logging in CloudWatch: https://eu-west-3.console.aws.amazon.com/cloudwatch
* POST API in API Gateway: https://eu-west-3.console.aws.amazon.com/apigateway

## The second POST function (you can skip this  but shows some advanced features)
Check the reference/postBeerAdvanced.ts file and discover how we can handle JSON objects which might contain optional or unknown elements which we always want to store without doing massive checks in our code.