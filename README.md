# slack-iot-sales-bell
AWS Dash Button + AWS Lambda + Slack = Sales bell for distributed team

We have a highly distributed team so "announcing" sales to the company meant ringing a bell in the office, and then sending a anti-climactic slack message to the remote staff. This project ties the AWS IoT button (aka Dash Button) to an AWS Lambda function, which in turn calls a slack API to announce the sale in your slack channel of choice.

## Create the Slack incoming webhook
[Documentation available here](https://my.slack.com/services/new/incoming-webhook/)
Retrieve the webhook URL path. For example, if the URL is https://hooks.slack.com/services/X0123X/X0123X/XXXX0123XXXXXXX0123XXX, the path to retrieve is /services/X0123X/X0123X/XXXX0123XXX

## Customize your code
### Bell images
I collected some bell images and dropped them in an S3 bucket set up for static hosting. You can use any other public images of your choice. Update the bells array in index.js to reference your bell images.
### Salesperson customization
If you have multiple salespeople who may be "ringing the bell" you can send a button to each of them and customize the slack message based on the Serial number of their IoT buttons. You can skip this step for a generic message.

## Create your Lambda function
This assumes you have an AWS account and have configured your [CLI](https://aws.amazon.com/cli/)
```shell
zip index.zip index.js
account_id=`aws ec2 describe-security-groups \
    --group-names 'Default' \
    --query 'SecurityGroups[0].OwnerId' \
    --output text`
aws lambda create-function --function-name slack-iot-sales-bell --handler index.handler --runtime nodejs4.3 --role "arn:aws:iam::"$account_id":role/lambda_basic_execution" --zip-file fileb://index.zip
```

## Set your Lambda environment variables
1. Go to your Lambda function in the AWS Web GUI and go to the Code tab
1. Set the following Environment variables:
* SLACK_CHANNEL - the name of the channel you want to post to. e.g., #allstaff
* SLACK_USERNAME - the name of the user you want to post the message. It doesn't have to be a real user. e.g., Sales Bell
* SLACK_WEBHOOK_PATH - the path that you got in the first step. e.g, /services/X0123X/X0123X/XXXX0123XXX
[[https://github.com/dominic-oconnor/slack-iot-sales-bell/blob/master/images/environmentvariables.png|alt=environmentvariables]]

## Test the Lambda/Slack Integration
```shell
aws lambda invoke --function-name slack-iot-sales-bell --region us-west-2  /dev/null
```
You should see one of the bell images show up as a message in your chosen Slack channel.

## Set up the IoT Button
You can order your IoT button [here](https://aws.amazon.com/iotbutton/)
Follow the [steps in the wiki](https://github.com/dominic-oconnor/slack-iot-sales-bell/wiki/Attaching-your-IoT-button-to-your-Lambda-function) to add the IoT button as a trigger to your Lambda function.