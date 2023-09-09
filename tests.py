import json

import boto3

def test_sentiment_is_predicted():
  client = boto3.client('lambda')
  response = client.invoke(
    FunctionName='ml-model-development-ml_model',
    InvocationType='RequestResponse',
    Payload=json.dumps({
      "text": "I am so happy! I love this tutorial! You really did a great job!"
    })
  )

  assert json.loads(response['Payload'].read().decode('utf-8'))['sentiment'] == 'positive'