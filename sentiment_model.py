from transformers import pipeline

class SentimentModel:
  def __init__(self):
    self._sentiment_analysis = pipeline("sentiment-analysis", model="ProsusAI/finbert")

  def predict(self, text):
    return self._sentiment_analysis(text)[0]["label"]


# TO run the code locally un comment
# if __name__ == "__main__":
#   sample_text = "The Down Jones Industrial Average (^DJI) turned green."

#   model = SentimentModel()
#   sentiment = model.predict(text=sample_text)
#   print(sentiment)