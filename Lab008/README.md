# TERRA 10 Serverless labs

## Lab 008 - Packaging please

## Packaging (default)
If you check the /.serverless folder we can see that the framework will place a huge .zip file there. On every `sls package/deploy`, the framework will generate this file and upload it to the S3 bucket from where the deployment will take place.

## Packaging (smart)
When your project grows to have many functions, this will slow up each deployment. So of course we can do it smarter. Add the package section in the root of your serverless.yml:

```
package:
  excludeDevDependencies: true
  individually: true
```
Run the `sls package` again and check out your ./serverless folder.

## Reference
https://serverless.com/framework/docs/providers/aws/guide/packaging/