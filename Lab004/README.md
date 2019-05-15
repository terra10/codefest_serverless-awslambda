# TERRA 10 Serverless labs

## Lab 004 - I got the key, I got the secret

## API keys
We want to get some usage metrics so let's make sure our client (Postman) uses a unique api key. Our current API endpoint does not require authorization or an API key.

![Alt text](./images/lab004.apikey.png?raw=true "no API key")

Add the following lines below the _provider_ segment in your serverless.yml which will generate a unique API key in the AWS API Gateway:
``` 
  apiKeys:
    - ${self:service.name}-postman
```

Now, to make sure our PostBeer API will require the API key from the client, add the following segment to functions -> postBeer -> events -> http in our serverless.yml (so on the same depth as _path_ and _method_)
```
  private: true
```
Redeploy and you should now see the value API Key change to _Required_. When you execute the POST from Lab003 again in Postman you should now get a 403 Forbidden response.

So to get this working we will need to send the API key in our request. Retrieve the key from the AWS API Gateway console: https://eu-west-3.console.aws.amazon.com/apigateway/home#/api-keys and add it to your Postman request as an HTTP Header:

```
x-api-key: YOUR-API-KEY-GOES-HERE
```

![Alt text](./images/lab004.postmanOK.png?raw=true "Postman result")
