# TERRA 10 Serverless labs

## Lab 008 - Packaging please

## Packaging (default)
If you check the /.serverless folder we can see that the framework will place a huge .zip file there. Every sls package/deploy the framework will generate this file, upload it to the S3 bucket from where the deployment will take place.

## Packaging (smart)
If your project grows with many functions, this will slow up each deployment. So off course we can do it smart. Add the package section in the root of your serverless.yml

```
package:
  excludeDevDependencies: true
  individually: true
```
Run the sls package again and check out your ./serverless folder

## Reference
https://serverless.com/framework/docs/providers/aws/guide/packaging/