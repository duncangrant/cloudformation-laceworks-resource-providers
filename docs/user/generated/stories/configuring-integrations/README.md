# Configuring Cloud Accounts and Container Registries

## Basic configuration of a Container Registry and a Cloud Account

The following yaml will configure a Container Registry and a Cloud Account, both on AWS.

```yaml
  ContainerRegistry:
    Type: Lacework::Integration::ContainerRegistry
    Properties:
      Name: "Test Container Registry"
      Type: "ContVulnCfg"
      Enabled: 1
      Data: "{ \"crossAccountCredentials\": { \"externalId\": \"ACCOUNT_ID\", \"roleArn\": \"ACCOUNT_ROLE\" }, \"awsAuthType\": \"AWS_IAM\", \"registryType\": \"AWS_ECR\", \"limitByTag\": [], \"limitByLabel\": [], \"limitByRep\": [], \"registryDomain\": \"REGISTRY_DOMAIN\", \"limitNumImg\": 5, \"nonOsPackageEval\": true }"

  CloudAccount:
    Type: Lacework::Integration::CloudAccount
    Properties:
      Name: Test Cloud Account
      Type: AwsCfg
      Enabled: 1
      Data: "{\"crossAccountCredentials\": {\"externalId\": \"EXTERNAL_ID\", \"roleArn\": \"ACCOUNT_ROLE\"}, \"awsAccountId\": \"ACCOUNT_ID\"}"
```

## Improving readability

The above Cloudformation wasn't very readable or easy to update because of the JSON string used to configure the Data properties.  It
is also difficult to parameterize the above Cloudformation.  There are a couple of other options for how to write this Cloudformation
that is easier to read and maintain.

### Using a YAML continuation

If you want the Data property to still use JSON you can place it after a YAML continuation.  This allows you to write the yaml directly
without the need to escape the quotes.

```yaml
      Data: >-
        { "crossAccountCredentials": { "externalId": "EXTERNAL_ID", "roleArn": "ACCOUNT_ROLE" }, "awsAuthType": "AWS_IAM", "registryType": "AWS_ECR", "limitByTag": [], "limitByLabel": [], "limitByRep": [], "registryDomain": "REGISTRY_DOMAIN", "limitNumImg": 5, "nonOsPackageEval": true }

```

### Using Fn::ToJsonString Language Extension

The Fn::ToJsonString language extension allows you to write your Data property as is it was YAML.  This is easier to read and 
to add parameters to but does need a change to your workflow.  Firstly you need to add `"Transform": "AWS::LanguageExtensions"`
to your Cloudformation and you also need to add `--capabilities CAPABILITY_AUTO_EXPAND` to your create-stack call.
 
For example:

```yaml

"Transform": "AWS::LanguageExtensions"

#...

Data:
  Fn::ToJsonString:
    crossAccountCredentials:
      externalId: "EXTERNAL_ID"
      roleArn: "ACCOUNT_ROLE"
    awsAuthType: "AWS_IAM"
    registryType: "AWS_ECR"
    limitByTag: []
    limitByLabel: []
    limitByRep: []
    registryDomain: "REGISTRY_DOMAIN"
    limitNumImg: 5
    nonOsPackageEval: true

```

And this could be deployed with the following update-stack command:

```bash
aws cloudformation update-stack --stack-name My-Lacework-Integrations  --template-body file://lacework-integrations.yaml --capabilities CAPABILITY_AUTO_EXPAND
```