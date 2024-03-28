from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
nltk.download('vader_lexicon')
sentiAnalysis = SentimentIntensityAnalyzer()

def sentiment_api(sentence):
    senti_score = get_score(sentence)
    return senti_score

def get_score(sentence):
    senti_score = sentiAnalysis.polarity_scores(sentence)
    return senti_score