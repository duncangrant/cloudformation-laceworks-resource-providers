# cloudformation-lacework

## Set up local type configuration

When running contract or SAM tests locally, the resources expect the Lacework Url, AccessKeyId, and SecretKey to be available via the type configuration.
Add the following to ~/.cfn-cli/typeconfiguration.json. Replace the values inside the __square__ brackets with the actual values for testing

```yaml
{
    "LaceworkAccess": {
        "Url": "https://[MY_LACEWORK].lacework.net/api/v2",
        "AccessKeyId": "[MY_ACCESS_KEY_ID]",
        "SecretKey": "[MY_SECRET_KEY]"
    }
}
```

See [Generate API Access Keys and Tokens](https://docs.lacework.com/console/generate-api-access-keys-and-tokens) for how to generate the necessary keys.

You must have a Lacework account to run these tests.

## Testing

Some of the contract tests for specific resources require pre-configured setup.  This is documented in the README.md files of those resources.

To run the contract tests for a specific resource you need to update the overrides.json file for that resource.  Replace any values within <> with
actual values that will work with your account.  You can then run the contract tests with the command: `cfn test`
