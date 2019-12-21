import tweepy
import json

# spark imports
from pyspark import SparkConf, SparkContext
from pyspark.sql import Row

# tf-idf imports and sentiment analysis imports
import nltk as nltk
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

#redis database import
import redis

# twitter authentication keys. Replace with your own
consumer_key = "CShhWAknTyUKglqRCDD85ukXi"
consumer_secret = "iY60OQDQvwpxkNggbMhD89fc3XarT3V70wxjSuL4Yv9lKHME1O"
access_token = "1063543816467214336-bAzfoT2bsgbB9J0RIT8pv0FD7RyaNy"
access_token_secret = "3hPNcqrXEIZeDGuv8MvbrL8yvdITAEtCKXHxqWQ5RJsIa"

# ==== setup twitter connection ====
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth) # twitter api handler

# create spark configuration
conf = SparkConf()
conf.setAppName("TwitterStreamApp")
# create spark context with the above configuration
sc = SparkContext(conf=conf)
sc.setLogLevel("ERROR")

#redis db setup
redis_host = "localhost"
redis_port = 6379
redis_password = ""
r = redis.StrictRedis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True)

# global variables
# additional stop words
additional_stop_words = ["a","about","above","after","again","against","ain","all","am","an","and","any","are","aren","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can","couldn","couldn't","d","did","didn","didn't","do","does","doesn","doesn't","doing","don","don't","down","during","each","few","for","from","further","had","hadn","hadn't","has","hasn","hasn't","have","haven","haven't","having","he","her","here","hers","herself","him","himself","his","how","i","if","in","into","is","isn","isn't","it","it's","its","itself","just","ll","m","ma","me","mightn","mightn't","more","most","mustn","mustn't","my","myself","needn","needn't","no","nor","not","now","o","of","off","on","once","only","or","other","our","ours","ourselves","out","over","own","re","s","same","shan","shan't","she","she's","should","should've","shouldn","shouldn't","so","some","such","t","than","that","that'll","the","their","theirs","them","themselves","then","there","these","they","this","those","through","to","too","under","until","up","ve","very","was","wasn","wasn't","we","were","weren","weren't","what","when","where","which","while","who","whom","why","will","with","won","won't","wouldn","wouldn't","y","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","could","he'd","he'll","he's","here's","how's","i'd","i'll","i'm","i've","let's","ought","she'd","she'll","that's","there's","they'd","they'll","they're","they've","we'd","we'll","we're","we've","what's","when's","where's","who's","why's","would","able","abst","accordance","according","accordingly","across","act","actually","added","adj","affected","affecting","affects","afterwards","ah","almost","alone","along","already","also","although","always","among","amongst","announce","another","anybody","anyhow","anymore","anyone","anything","anyway","anyways","anywhere","apparently","approximately","arent","arise","around","aside","ask","asking","auth","available","away","awfully","b","back","became","become","becomes","becoming","beforehand","begin","beginning","beginnings","begins","behind","believe","beside","besides","beyond","biol","brief","briefly","c","ca","came","cannot","can't","cause","causes","certain","certainly","co","com","come","comes","contain","containing","contains","couldnt","date","different","done","downwards","due","e","ed","edu","effect","eg","eight","eighty","either","else","elsewhere","end","ending","enough","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","except","f","far","ff","fifth","first","five","fix","followed","following","follows","former","formerly","forth","found","four","furthermore","g","gave","get","gets","getting","give","given","gives","giving","go","goes","gone","got","gotten","h","happens","hardly","hed","hence","hereafter","hereby","herein","heres","hereupon","hes","hi","hid","hither","home","howbeit","however","hundred","id","ie","im","immediate","immediately","importance","important","inc","indeed","index","information","instead","invention","inward","itd","it'll","j","k","keep","keeps","kept","kg","km","know","known","knows","l","largely","last","lately","later","latter","latterly","least","less","lest","let","lets","like","liked","likely","line","little","'ll","look","looking","looks","ltd","made","mainly","make","makes","many","may","maybe","mean","means","meantime","meanwhile","merely","mg","might","million","miss","ml","moreover","mostly","mr","mrs","much","mug","must","n","na","name","namely","nay","nd","near","nearly","necessarily","necessary","need","needs","neither","never","nevertheless","new","next","nine","ninety","nobody","non","none","nonetheless","noone","normally","nos","noted","nothing","nowhere","obtain","obtained","obviously","often","oh","ok","okay","old","omitted","one","ones","onto","ord","others","otherwise","outside","overall","owing","p","page","pages","part","particular","particularly","past","per","perhaps","placed","please","plus","poorly","possible","possibly","potentially","pp","predominantly","present","previously","primarily","probably","promptly","proud","provides","put","q","que","quickly","quite","qv","r","ran","rather","rd","readily","really","recent","recently","ref","refs","regarding","regardless","regards","related","relatively","research","respectively","resulted","resulting","results","right","run","said","saw","say","saying","says","sec","section","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sent","seven","several","shall","shed","shes","show","showed","shown","showns","shows","significant","significantly","similar","similarly","since","six","slightly","somebody","somehow","someone","somethan","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specifically","specified","specify","specifying","still","stop","strongly","sub","substantially","successfully","sufficiently","suggest","sup","sure","take","taken","taking","tell","tends","th","thank","thanks","thanx","thats","that've","thence","thereafter","thereby","thered","therefore","therein","there'll","thereof","therere","theres","thereto","thereupon","there've","theyd","theyre","think","thou","though","thoughh","thousand","throug","throughout","thru","thus","til","tip","together","took","toward","towards","tried","tries","truly","try","trying","ts","twice","two","u","un","unfortunately","unless","unlike","unlikely","unto","upon","ups","us","use","used","useful","usefully","usefulness","uses","using","usually","v","value","various","'ve","via","viz","vol","vols","vs","w","want","wants","wasnt","way","wed","welcome","went","werent","whatever","what'll","whats","whence","whenever","whereafter","whereas","whereby","wherein","wheres","whereupon","wherever","whether","whim","whither","whod","whoever","whole","who'll","whomever","whos","whose","widely","willing","wish","within","without","wont","words","world","wouldnt","www","x","yes","yet","youd","youre","z","zero","a's","ain't","allow","allows","apart","appear","appreciate","appropriate","associated","best","better","c'mon","c's","cant","changes","clearly","concerning","consequently","consider","considering","corresponding","course","currently","definitely","described","despite","entirely","exactly","example","going","greetings","hello","help","hopefully","ignored","inasmuch","indicate","indicated","indicates","inner","insofar","it'd","keep","keeps","novel","presumably","reasonably","second","secondly","sensible","serious","seriously","sure","t's","third","thorough","thoroughly","three","well","wonder","lol", "happy", "bitch", "fuck", "good", "bad", "nigga", "shit", "damn", "yes","wtf", "yeah", "yes", "no", "nope", "fucking", "ass", "niggas", "lmao", "slut", "life", "amazing", "love", "people", "wow", "great", "yeah", "wrong", "worse", "thing", "today", "day", "gonna", "wanna", "imma", "right", "bro", "bitches"]
stop_words = set(stopwords.words('english')).union(additional_stop_words)
word_tokenizer = RegexpTokenizer(r'\w+')

# This method expects twitter user id or twitter user screen name
# It will create user profile by processing 3200 tweets of <user_id/screen_name> and save analytics to database
# The method will get tf-idf scores and perform sentiment analysis of the tweets
def make_profile(user_id):
    global user_id_str
    user_tweet_object = api.get_user(user_id)
    #determine if the passed argument is twitter id or screen name
    if(is_number(str(user_id))):
        user_id_str = str(user_id)
    else:
        user_id_str = str(user_tweet_object.id)

    #save basic user information to the database
    r.set(user_id_str + "_id", user_id_str)
    r.set(user_id_str + "_" + "name", user_tweet_object.name)
    r.set(user_id_str + "_" + "screen_name", user_tweet_object.screen_name)
    r.set(user_id_str + "_" + "profile_url", "https://twitter.com/" + user_tweet_object.screen_name)
    r.set(user_id_str + "_" + "location", user_tweet_object.location)
    r.set(user_id_str + "_" + "followers_count", user_tweet_object.followers_count)
    r.set(user_id_str + "_" + "friends_count", user_tweet_object.friends_count)
    r.set(user_id_str + "_" + "profile_image_url_https", user_tweet_object.profile_image_url_https.replace("_normal", ''))

    # get all 3200 tweets by this user_id
    tweets = tweepy.Cursor(api.user_timeline, id=user_id, tweet_mode="extended").items()
    hashtags = list()  # to save hashtags of a user
    all_tweets = list() #save 3200 user tweets. stopwords will be excluded
    all_tweets_sentiment = list() #will contains all the tweets without stopwords for sentiment analysis

    # Iterate over all user tweets
    for tweet in tweets:
        # get tweet text
        full_text_retweeted = tweet._json.get("retweeted_status")
        full_text = ""
        if full_text_retweeted:
            full_text = full_text_retweeted.get("full_text")
        else:
            full_text = tweet._json["full_text"]

        all_tweets_sentiment.append(full_text)
        tweet_words = full_text.lower()
        #filter words in a tweet
        filtered_tweet_words = [w for w in tweet_words.split() if not w.startswith("http") and len(w) > 2 and w not in stop_words] #exclude stop words, links (starts with http) and words of len <= 3
        tokens = word_tokenizer.tokenize(' '.join(filtered_tweet_words))
        all_tweets.append(' '.join(tokens))

        # extract hashtags from the tweet object
        for hashtag in tweet.entities['hashtags']:
            hashtags.append(hashtag['text'])

    # get hashtag counts
    get_word_frequency(hashtags, user_id_str + "_" + "hashtags")

    #perform sentiment analysis and get tf-idf scores and save it to the database
    process_all_tweets(all_tweets, all_tweets_sentiment)


def process_all_tweets(tweets_list, tweets_list_sentiment):
    tfidf = TfidfVectorizer(tokenizer=tokenize, stop_words=set(stopwords.words('english')))
    tfs = tfidf.fit_transform(tweets_list)
    feature_names = tfidf.get_feature_names()
    corpus_index = list(range(1, len(tweets_list) + 1))
    df = pd.DataFrame(tfs.T.todense(), index=feature_names, columns=corpus_index)

    positive_topics = list()
    negative_topics = list()
    all_topics = list()

    with pd.option_context('display.max_rows', None, 'display.max_columns', None):
        for i in range(1, len(df.columns) + 1):
            s = df[i]
            s = s[s > 0]
            tf_topics = s.nlargest(10).axes[0].tolist()
            topics = list()
            for topic in tf_topics:
                if (len(topic) > 2 and topic != "amp"): topics.append(topic)

            sentiment = perform_sentiment_analysis(tweets_list_sentiment[i - 1])
            if (sentiment == "positive"): positive_topics.extend(topics)
            elif(sentiment == "negative"): negative_topics.extend(topics)
            all_topics.extend(topics)

    get_word_frequency(positive_topics, user_id_str + "_" + "positive_topics")
    get_word_frequency(negative_topics, user_id_str + "_" + "negative_topics")
    get_word_frequency(all_topics, user_id_str + "_" + "all_topics")


def get_word_frequency(word_list, db_key):
    words_rdd = sc.parallelize(word_list)
    words_count_rdd = words_rdd.map(lambda word: (word, 1)).reduceByKey(lambda x, y: x+y)
    words_rdd_sorted = words_count_rdd.sortBy(lambda value: value[1], False)
    word_frequency_dict = dict(words_rdd_sorted.collect())
    if(len(word_frequency_dict) > 0):
        r.zadd(db_key, word_frequency_dict)

# this function returns sentiment of a given tweet using nltk's vader
def perform_sentiment_analysis(text):
    sid = SentimentIntensityAnalyzer()
    ss = sid.polarity_scores(text)
    if (ss['compound'] > 0):
        return "positive"
    elif (ss['compound'] < 0):
        return "negative"
    else:
        return "neutral"

def tokenize(text):
    return word_tokenizer.tokenize(text)

def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

#setup user profile
# user_id = 1702156772
# make_profile(user_id)
# make_profile(3354253323)
# 02:23:05 - 02:25:35 = 150 seconds
# 02:28:00 - 02:31:19 = 200 seconds