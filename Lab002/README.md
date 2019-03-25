# TERRA 10 Serverless labs

## Lab 002 - The first build & deploy

## Preparing
We will need some more AWS magic so let's import the aws-sdk lib 
* run: _npm install aws-sdk_
* check the dependencies and devDependencies in package.json 
This time we don't use the --save-dev because we will need this lib on run-time

## Database
We are going to store and get data from a DynamoDB table. We will provide with a AWS CloudFormation script containing the resources for the DynamoDB table.
* copy /Lab002/reference/resource-dynamodb.yml to ./resources
* edit the serverless.yml file and add a resources segment with a reference to the yml:
``` 
resources:
    - ${file(resources/resources-dynamodb.yml)}
```
We just told serverless that the project also includes some custom AWS CloudFormation resources on top of the generated serverless. 

Lets check this by running:
``` 
sls package
```
The result should be a ./serverless folder containing a generated CloudFormation JSON file and a ZIP with our functions. 

So let's deploy our Hello World lambda and our DynamoDB table with the Serverless framework
Make sure your using a valid AWS Profile which has enough IAM permissions
``` 
export AWS_PROFILE=?????
tsc && sls deploy
```
So let's check:
* S3 deployment bucket: https://s3.console.aws.amazon.com/s3/home
* CloudFormation stack: https://eu-west-3.console.aws.amazon.com/cloudformation
* DynamoDB table: https://eu-west-3.console.aws.amazon.com/dynamodb
* API Gateway: https://eu-west-3.console.aws.amazon.com/apigateway
* Hello World Lambda: https://eu-west-3.console.aws.amazon.com/lambda

