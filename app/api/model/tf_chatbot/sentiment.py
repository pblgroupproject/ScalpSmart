from nltk.sentiment import SentimentIntensityAnalyzer

sentiAnalysis = SentimentIntensityAnalyzer()

def sentiment_api(sentence):
    senti_score = get_score(sentence)
    return senti_score

def get_score(sentence):
    senti_score = sentiAnalysis.polarity_scores(sentence)
    return senti_score