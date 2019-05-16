# TERRA 10 Serverless labs

## Lab 003 - The first real Lambda Service

## The first POST function
* copy the postBeerSimple.ts from this Lab to the /src folder

Let's examine the file:
* First we handle the imports, which are sorted in alphabetical order as tslint dictates.
* We see the handler used by API Gateway and the Serverless Framework which always contains 3 variables. 
    * context
    * event
    * callback  
* The main logic is placed in the _export async function_ which the handler asynchronously calls (hence the await).
* The main logic starts with setting up the headers for the response.
* Then in the try we first retrieve the values from the POST request body.
* Secondly we define the parameters for the AWS SDK call to DynamoDB.
* Finally we call the documentClient asynchronously again (the await is always crucial).
* If all goes well we return a 201 and if an error occurs we return a 500.

## Set up the serverless framework
Add the following lines below the _functions_ segment in your serverless.yml
``` 
postBeer:
  handler: lib/postBeerSimple.handler
  description: POST our new beers in DynamoDB
  events:
    - http:
        method: post
        path: beer
```

We can also delete the Hello example function because we won't be needing it anymore and compile & deploy:
``` 
tsc && sls deploy
```

## API endpoint & REST call
We will need the API endpoint from the AWS stage which is generated, so
* Check the AWS API Gateway: https://eu-central-1.console.aws.amazon.com/apigateway/home#/apis
* Select: dev-t10*-serverless -> Stages -> Dev
* There should be an invoke URL like: https://***********.execute-api.eu-central-1.amazonaws.com/dev
* Use a tool like Postman and fire a POST request to the url + /beer

Request:
``` 
{
  "beer_name": "Heineken",
  "beer_date": "2019-01-31"
}
```
If all goes "well" you should receive a 500 with response:
``` 
{
    "message": "User: arn:aws:sts::*:assumed-role/t10*-serverless-dev-eu-central-1-lambdaRole/t10a-serverless-dev-postBeer is not authorized to perform: dynamodb:UpdateItem on resource: arn:aws:dynamodb:eu-central-1:*:table/t10*-serverless"
}
```

## AWS Lambda roles
So now we have it. We can execute our first POST Lambda but on runtime it assumes a role which does not have permissions to dynamodb:UpdateItem on our table. So now what?

Well, add the role and permissions of course!

Add the following lines below the _provider_ segment in your serverless.yml:
``` 
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:UpdateItem
      Resource:
        - arn:aws:dynamodb:${self:provider.region}:*:table/${self:service.name}
```

The Serverless framework will help you to create an AWS IAM Role for the Lambda function and add IAM Policy permissions to insert an item in your database. This would be a very labour intensive step when done manually, but the Serverless framework does it all for you.

So deploy again (we don't need the compile here, but it's better to get used to doing it anyway):
``` 
tsc && sls deploy
```

## Try the API call again
Request:
``` 
{
  "beer_name": "Heineken",
  "beer_date": "2019-01-31"
}
```
If all goes well you should receive a 201 with a response:
``` 
{
    "id": "xxxxxxxxxxxxx"
}
```

## Summary
So let's check:
* Items in DynamoDB table: https://eu-central-1.console.aws.amazon.com/dynamodb
* Logging in CloudWatch: https://eu-central-1.console.aws.amazon.com/cloudwatch
* POST API in API Gateway: https://eu-central-1.console.aws.amazon.com/apigateway

## The second POST function (you can skip this but it shows some advanced features)
Check the reference/postBeerAdvanced.ts file and see how we can handle JSON objects which might contain optional or unknown elements which we always want to store without doing massive amounts of checks in our code.