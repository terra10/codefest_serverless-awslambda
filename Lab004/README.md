# TERRA 10 Serverless labs

## Lab 004 - I got the key, I got the secret

## API keys
We wanna get some usage metrics so let's make sure our client (Postman) uses an unique api key. Our current API endpoint does not require autorization or an API key.

![Alt text](./images/lab004.apikey.png?raw=true "no API key")

Add the following lines underneath the provider: segment in your serverless.yml which generates an unique API key in AWS API Gateway
``` 
  apiKeys:
    - ${self:service.name}-postman
```

Now to make sure our PostBeer API will requires the API key from the client, add the following segment to functions -> postBeer -> events -> http in our serverless.yml (so on the same depth as path and method)
```
  private: true
```
Redeploy and you should now see the value API Key change to _Required_. When you execute the POST from Lab003 again in Postman you should now get a 403 Forbidden.

So to get this working we will need to send the API key in our request. Retrieve the key from the AWS API Gateway console: https://eu-west-3.console.aws.amazon.com/apigateway/home#/api-keys and add it to your Postman request

![Alt text](./images/lab004.postmanOK.png?raw=true "no API key")
