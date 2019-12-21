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
consumer_key = "CShhWAknTyUKglqRCDD85ukXi"
consumer_secret = "iY60OQDQvwpxkNggbMhD89fc3XarT3V70wxjSuL4Yv9lKHME1O"
access_token = "1063543816467214336-bAzfoT2bsgbB9J0RIT8pv0FD7RyaNy"
access_token_secret = "3hPNcqrXEIZeDGuv8MvbrL8yvdITAEtCKXHxqWQ5RJsIa"


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
         'gop', 'trump', 'vote', 'house', 'congress', 'senate', 'law', 'politicians', 'liberal', 'stem', 'computer science',
         'javascript', 'django', 'webapps', 'mobileapps', 'software', 'apple', 'iphone', 'iphonex', 'macbook', 'ios', 'macos', 'siri', 'imac',
         'applemusic', 'itunes', 'stevejobs', 'timcook', 'technology', 'innovation', 'future', 'cloud', 'tech', 'facebook', 'google', 'iot', 'app',
         'career', 'marvel', 'dc', 'superman', 'batman', 'avengers', 'justiceleague', 'spiderman', 'superhero', 'superheroes', 'wonder woman', 'blackwidow', 
         'cat', 'cats', 'dogs', 'anthropology', 'university',
         'mathematics', 'AI', 'Engineering', 'Computer', 'IT', 'Nanotechnology', 'NASA', 'space', 'astronomy', 'programming', 'java',
         'python', 'ruby', 'c', 'c++', 'javascript', 'js', 'angular', 'reactjs', 'vuejs', 'golang', 'tesla', 'elon musk', 'iot', 'google home', 'alexa' 
         'blue jays', 'cn tower', 'health', 'toronto', 'canada', 'downtown toronto', 'downtown', 'trudeau', 'amazon',
          'cnn', 'bbc', 'news', 'laptop', 'macbook', 'mac', 'oneplus', 'iphone', 'huawei', 'lg', 'samsung', 'phone']
language = ['en']

# get filtered tweets, forward them to spark until interrupted
try:
    stream.filter(track=track, languages=language)
except KeyboardInterrupt:
    s.shutdown(socket.SHUT_RD)
