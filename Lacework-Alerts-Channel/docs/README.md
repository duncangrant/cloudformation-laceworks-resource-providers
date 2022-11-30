# Lacework::Alerts::Channel

A resource for defining Lacework notification channels

## Syntax

To declare this entity in your AWS CloudFormation template, use the following syntax:

### JSON

<pre>
{
    "Type" : "Lacework::Alerts::Channel",
    "Properties" : {
        "<a href="#name" title="Name">Name</a>" : <i>String</i>,
        "<a href="#type" title="Type">Type</a>" : <i>String</i>,
        "<a href="#enabled" title="Enabled">Enabled</a>" : <i>Double</i>,
        "<a href="#data" title="Data">Data</a>" : <i>Map</i>,
    }
}
</pre>

### YAML

<pre>
Type: Lacework::Alerts::Channel
Properties:
    <a href="#name" title="Name">Name</a>: <i>String</i>
    <a href="#type" title="Type">Type</a>: <i>String</i>
    <a href="#enabled" title="Enabled">Enabled</a>: <i>Double</i>
    <a href="#data" title="Data">Data</a>: <i>Map</i>
</pre>

## Properties

#### Name

_Required_: Yes

_Type_: String

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### Type

_Required_: Yes

_Type_: String

_Allowed Values_: <code>AwsS3</code> | <code>CiscoSparkWebhook</code> | <code>CloudwatchEb</code> | <code>Datadog</code> | <code>EmailUser</code> | <code>GcpPubsub</code> | <code>IbmQradar</code> | <code>Jira</code> | <code>MicrosoftTeams</code> | <code>NewRelicInsights</code> | <code>PagerDutyApi</code> | <code>ServiceNowRest</code> | <code>SlackChannel</code> | <code>SplunkHec</code> | <code>VictorOps</code> | <code>Webhook</code>

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### Enabled

When sending a request, use this attribute to enable or disable an alert channel. When included in a response, returns 1 for enabled alert channels, or returns 0 for disabled alert channels.

_Required_: Yes

_Type_: Double

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### Data

_Required_: No

_Type_: Map

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

## Return Values

### Ref

When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the IntgGuid.

### Fn::GetAtt

The `Fn::GetAtt` intrinsic function returns a value for a specified attribute of this type. The following are the available attributes and sample return values.

For more information about using the `Fn::GetAtt` intrinsic function, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html).

#### Props

The alert channel's properties

#### IsOrg

Returns the <code>IsOrg</code> value.

#### CreatedOrUpdatedBy

The user who created or who last updated the alert channel.

#### CreatedOrUpdatedTime

The timestamp for when the alert channel was created or last updated.

#### IntgGuid

Alert channel Id

