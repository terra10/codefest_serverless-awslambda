# TERRA 10 Serverless labs

## Lab 005 - So many models

## API Gateway Models
So we have our POST from Lab003 which stores the complete object in DynamoDB. But maybe you don't like data pollution in your table and want to make sure your clients send messages which are compliant with a message definition. This is possible with AWS API Gateway & Serverless by using models based on the json-schema.org definitions.

## Check the model
Look at our model in `/reference/postBeer-request.json` and copy it to `./models/postBeer-request.json`.

## Plugin
We will need our first serverless plugins to make this happen.
``` 
npm install serverless-aws-documentation --save-dev
npm install serverless-reqvalidator-plugin --save-dev

```
Check the package.json and see we will only need this plugin on DEV to generate decent CloudFormation, but not during runtime.

## Serverless configuration
We will need to tell serverless to use the plugin, usually in the _custom_ section. So we add this to our serverless.yml:
``` 
custom:
  documentation:
    models:
    - name: "postBeerRequestModel"
      description: "postBeerRequestModel"
      contentType: "application/json"
      schema: ${file(models/postBeerRequest.json)}
``` 

Now we need to make sure the correct function will use our model, so we add this under functions -> postBeer -> events -> http (so it's on the same level as _method_ & _post_)
``` 
        documentation:
          requestModels:
            "application/json": "postBeerRequestModel"
``` 

Using a model is nice, but it's pretty pointless if we don't validate it so we need the request validator plugin. So we need the API Gateway RequestValidators. So let's copy the validators from _/reference/resource-apigateway.yml_ to _/resources/_

Check the YML file and make sure you understand what the RequestValidatorOnlyBody does.

Now make sure the resources are included in serverless:
``` 
resources:
    - ${file(resources/resources-apigateway.yml)}
```

So we have our models and out validators, now make sure the postBeer will use it by adding this
``` 
http:
  reqValidatorName: RequestValidatorOnlyBody
```

We need to tell the serverless framework to also use both plugins so add them in the plugins section
``` 
plugins:
  - serverless-aws-documentation
  - serverless-reqvalidator-plugin
``` 

## Serverless output
Check the result by running serverless package and check the cloudformation in ./serverless 

## Serverless deploy
If all goes well, you can deploy the project. 
You can know check the _models_ section in your API Gateway, and you can check the functionality with Postman by executing a POST which does not match the model/contract.
