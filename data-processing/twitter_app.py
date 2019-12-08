"""
    This script connects to Twitter Streaming API, gets tweets, extracts unique user id
    and forwards them through a local connection in port 9009. That stream is
    meant to be read by a spark app for processing. 

    run:
        python twitter_app.py
        Note: You may have to install tweepy through:
            pip install tweepy 
            or
            pip3 install tweepy
"""

import socket
import json
import sys
# twitter api imports
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import API
from tweepy import Stream

# Replace the values below with yours
consumer_key = ""
consumer_secret = ""
access_token = ""
access_token_secret = ""


class TweetListener(StreamListener):
    """ A listener that handles tweets received from the Twitter stream.

        This listener prints tweets and then forwards them to a local port
        for processing in the spark app.
    """

    def on_data(self, data):
        """When a tweet is received, extract user id and forward it"""
        try:
            global conn
            # load the tweet JSON, get pure text
            full_tweet = json.loads(data)

            # wait for client to send data
            response = conn.recv(1024)
            if(response.decode() == "send"):
                # send tweet user id to client
                conn.send(str.encode(str(full_tweet["user"]["id"])))
        except:
            # handle errors
            e = sys.exc_info()[0]
            print("Error: %s" % e)
        return True

    def on_error(self, status):
        print(status)


# ==== setup local connection ====
# IP and port of local machine or Docker
# TCP_IP = socket.gethostbyname(socket.gethostname()) # returns local IP
TCP_IP = "localhost"
TCP_PORT = 9009

# setup local connection, expose socket, listen for spark app
conn = None
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((TCP_IP, TCP_PORT))
s.listen(1)
print("Waiting for TCP connection...")

# if the connection is accepted, proceed
conn, addr = s.accept()
print("Connected... Starting getting tweets.")


# ==== setup twitter connection ====
listener = TweetListener()
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
stream = Stream(auth, listener)

# setup search terms
track = ['crypto', 'ethereum', 'bitcoin', 'blockchain', 'cryptocurrency', 'btc', 'money', 'price', 'mining', 'litecoin', 'republican',
         'gop', 'trump', 'vote', 'house', 'congress', 'senate', 'law', 'politicians', 'liberal', 'stem', 'computerscience',
         'javascript', 'django', 'webapps', 'mobileapps', 'software', 'apple', 'iphone', 'iphonex', 'macbook', 'ios', 'macos', 'siri', 'imac',
         'applemusic', 'itunes', 'stevejobs', 'timcook', 'technology', 'innovation', 'future', 'cloud', 'tech', 'facebook', 'google', 'iot', 'app',
         'career', 'marvel', 'dc', 'superman', 'batman', 'avengers', 'justiceleague', 'spiderman', 'superhero', 'superheroes', 'wonder woman', 'blackwidow',
         'playstation', 'games', 'fortnite', 'witcher', 'got', 'pubg', 'ps4', 'ps5', 'xbox', 'stadia', 'console', 'pc', 'videogames', 'movies',
         'starwars', 'mandalorian', 'babyyoda', 'yoda', 'hollywood', 'netflix', 'prime', 'hulu', 'disney+', 'actors', 'actress', 'music', 'cat', 'cats', 'dogs'
         'jazz', 'rock', 'pop', 'country', 'billboards', 'guitar', 'culture', 'anthropology', 'university', 'lawyer', 'humanity', 'art', 'arts',
         'mathematics', 'AI', 'Engineering', 'Computer', 'IT', 'Nanotechnology', 'NASA', 'Sputnik', 'space', 'astronomy', 'programming', 'java',
         'python', 'ruby', 'c', 'c++', 'javascript', 'js', 'angular', 'reactjs', 'vuejs', 'golang', 'tesla', 'elon musk', 'iot', 'google home', 'alexa'
         'car', 'cars', 'honda', 'toyota', 'chevrolet', 'chevy', 'sedan', 'suv', 'sports', 'nissan', 'football', 'blue jays', 'cn tower', 'health', 'lifestyle'
         'dog', 'puppy', 'corporate', 'walmart', 'costco', 'toronto', 'canada', 'downtown toronto', 'downtown']
language = ['en']

# get filtered tweets, forward them to spark until interrupted
try:
    stream.filter(track=track, languages=language)
except KeyboardInterrupt:
    s.shutdown(socket.SHUT_RD)
