import boto3
import botocore.exceptions
# actual credentials (AWS IAM console)
AWS_ACCESS_KEY_ID = '--'
AWS_SECRET_ACCESS_KEY = '--/--+kcB+FJ'
REGION_NAME = 'ap----1' 


TOPIC_ARN = '--'


MESSAGE = 'EMERGENCY BUTTON HAS BEEN CLICKED AT YOUR HOME STATION : PLEASE CHECK !!!!!'

PHONE_NUMBER = '+--'  # Replace with the phone number


sns_client = boto3.client('sns',
                          aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                          region_name=REGION_NAME)


try:
    sns_client.subscribe(
        TopicArn=TOPIC_ARN,
        Protocol='sms',
        Endpoint=PHONE_NUMBER
    )
    print(f"Subscribed phone number {PHONE_NUMBER} to topic {TOPIC_ARN}")
except botocore.exceptions.ClientError as error:
    print(f"Error subscribing phone number: {error}")


try:
    response = sns_client.publish(
        TopicArn=TOPIC_ARN,
        Message=MESSAGE
    )
    print(f"Message published successfully! Message ID: {response['MessageId']}")
except botocore.exceptions.ClientError as error:
    print(f"Error sending message: {error}")