# Twitter User Profiler

This project aims to analyze tweets from different users and profile them accordingly.
<br />

Twitter Profiler monitors tweets in real time and performs the following three tasks on each tweet:
* determining frequent hashtags 
* performing sentiment analysis to determine whether the tweet is positive or negative
* identifying major topics of the tweet

We use the Twitter API to interact with Twitter app in order to monitor users in certain regions for
specific periods of time. Twitter Profiler would rank the top n topics and top m hashtags of each user.
We aim to make these parameterized and configurable.

<details>
  <summary><strong>Prerequisites</strong></summary>
  
  <br />
  In order to run this app, you will need to have java8, scala, python3 and Apache Spark installed on your system. We will list the steps to install those prerequisites for Ubuntu, Mac and Windows.
  <br />
  
<br />
<details>
  <summary><strong>Ubuntu</strong></summary>
 
  ### Step 1: Install Java
  Check if java is already installed on your system by running
  `java -version` for java versions less than 9 and `java --version` for java > 8
  
  If you already have java8, then continue to next step.

  Check if you have multiple java versions installed by running:  
  ```update-java-alternatives -l```

  If you have java 8 listed then select it by running:
  ```sudo update-alternatives --config java```
  This will list different versions of java. Select java8 from the list

  If you do not have java8 at all, then run:
  ```sudo apt install openjdk-8-jdk```
  <hr />
  
  ### Step2: Install Scala

  Install scala by running:
  ```sudo apt-get install scala```
  <hr />

  ### Step3: Install python 3.7

  To check if python3 is installed:
  ```python3 --version```

  If you do not have python3 installed, follow this tutorial to install python3.7 on ubuntu:
  <https://linuxize.com/post/how-to-install-python-3-7-on-ubuntu-18-04/>

  Next, install pip:
  ```sudo apt install -y python3-pip```

  get pyspark by running:
  ```pip3 install pyspark```

  get tweepy, nltk, psutil, sklearn:
  ```
  pip3 install tweepy
  pip3 install nltk
  pip3 install psutil
  pip3 install sklearn
  ```

  Download "vader_lexicon", "stopwords", "punkt" (for word tokenizer) from nltk:
  ```
  [root]# python
  Python 3.6.8 (default, May  2 2019, 20:40:44) 
  [GCC 4.8.5 20150623 (Red Hat 4.8.5-36)] on linux
  Type "help", "copyright", "credits" or "license" for more information.
  >>> import nltk
  >>> nltk.download("vader_lexicon")
  >>> nltk.download('stopwords')
  >>> nltk.download('punkt')
  [nltk_data] Downloading package vader_lexicon to /root/nltk_data...
  True
  >>> exit()
  ```

  To test Spark, run:
  `pyspark`

  you should see the following output:
  ```Welcome to
        ____              __
       / __/__  ___ _____/ /__
      _\ \/ _ \/ _ `/ __/  '_/
     /__ / .__/\_,_/_/ /_/\_\   version 2.4.4
        /_/

  Using Python version 3.6.8 (default, May  2 2019 20:40:44)
  SparkSession available as 'spark'.
  >>> 
  ```
  
</details>

<details>
  <summary><strong> MacOS </strong></summary>
  
  ### Step 1: Install Java

  Check if java is already installed on your system by running
  `java -version` for java versions less than 9 and `java --version` for java > 8

  If you already have java8, then continue to next step.

  If not, install java8 by running:
  ```brew cask install java8```
  <hr />


  ### Step2: Install Scala

  Install scala by running:
  ```brew install scala```
  <hr />

  ### Step3: Install python 3.7

  To check if python3 is installed:
  ```python3 --version```

  If you do not have python3 installed, then run:
  ```brew install python3```

  get pyspark by running:
  ```pip3 install pyspark```

  get tweepy, nltk, psutil, sklearn:
  ```
  pip3 install tweepy
  pip3 install nltk
  pip3 install psutil
  pip3 install sklearn
  ```


  Download "vader_lexicon", "stopwords", "punkt" (for word tokenizer) from nltk:
  ```
  [root]# python
  Python 3.6.8 (default, May  2 2019, 20:40:44) 
  [GCC 4.8.5 20150623 (Red Hat 4.8.5-36)] on linux
  Type "help", "copyright", "credits" or "license" for more information.
  >>> import nltk
  >>> nltk.download("vader_lexicon")
  >>> nltk.download('stopwords')
  >>> nltk.download('punkt')
  [nltk_data] Downloading package vader_lexicon to /root/nltk_data...
  True
  >>> exit()
  ```

  To test Spark, run:
  `pyspark`

  you should see the following output:
  ```Welcome to
        ____              __
       / __/__  ___ _____/ /__
      _\ \/ _ \/ _ `/ __/  '_/
     /__ / .__/\_,_/_/ /_/\_\   version 2.4.4
        /_/

  Using Python version 3.6.8 (default, May  2 2019 20:40:44)
  SparkSession available as 'spark'.
  >>> 
  ```
      
</details>
  
<details>
  <summary><strong>Windows</strong></summary>
 
  ### Step 1: Install Java
  Download Java 8 from the link:
  <https://filehippo.com/download_java_development_kit_64/86378/>
  
  After installing java, open Control Panel and go to Edit System Environment Variables and click on Environment Variable in "Advanced" tab
  
  Set environmental variables:
  User variable:
  Variable: JAVA_HOME
  Value: C:\Program Files\Java\jdk1.8.0_91
  
  System variable:
  Variable: Path
  Value: C:\Program Files\Java\jdk1.8.0_91\bin
  
  <hr />
  
  ### Step2: Install Scala
  
  Download Scala from the link: <http://downloads.lightbend.com/scala/2.11.8/scala2.11.8.msi>
  
  After installing scala, open Control Panel and go to Edit System Environment Variables and click on Environment Variable in "Advanced" tab
  
  Set environmental variables:
  User variable:
  Variable: SCALA_HOME;
  Value: C:\Program Files (x86)\scala
  
  System variable (if not already set):
  Variable: Path
  Value: C:\Program Files (x86)\scala\bin
  
  To check, open cmd and type in:
  `scala -version`
  
 This will list the scala version you downloaded
  
  <hr />

  ### Step3: Install python 3.7

  To check if python3 is installed:
  ```python --version```

  If you do not have python3 installed, follow this tutorial to install python3.7 on ubuntu:
  <https://www.howtogeek.com/197947/how-to-install-python-on-windows/>


  Open cmd, get pyspark by running:
  ```pip3 install pyspark```

  get tweepy, nltk, psutil, sklearn:
  ```
  pip3 install tweepy
  pip3 install nltk
  pip3 install psutil
  pip3 install sklearn
  ```

  Download "vader_lexicon", "stopwords", "punkt" (for word tokenizer) from nltk:
  ```
  [root]# python
  Python 3.6.8 (default, May  2 2019, 20:40:44) 
  [GCC 4.8.5 20150623 (Red Hat 4.8.5-36)] on linux
  Type "help", "copyright", "credits" or "license" for more information.
  >>> import nltk
  >>> nltk.download("vader_lexicon")
  >>> nltk.download('stopwords')
  >>> nltk.download('punkt')
  [nltk_data] Downloading package vader_lexicon to /root/nltk_data...
  True
  >>> exit()
  ```

  To test Spark, run:
  `pyspark`

  you should see the following output:
  ```Welcome to
        ____              __
       / __/__  ___ _____/ /__
      _\ \/ _ \/ _ `/ __/  '_/
     /__ / .__/\_,_/_/ /_/\_\   version 2.4.4
        /_/

  Using Python version 3.6.8 (default, May  2 2019 20:40:44)
  SparkSession available as 'spark'.
  >>> 
  ```
  
</details>
  

</details>

# Back End Processing

The back end data processing is done by python scripts in `data-processing` directory

Following is the description of each of those scripts:

* #### twitter_app.py

This python script is responsible for opening up communication channel between local and Twitter server using Twitter API

`twiiter_app.py` listens for tweets in real time and sends the User Twitter object to `twitter_client.py` for processing. It will open up a socket channel to `twitter_client.py` and send Twitter user ids.

* #### twitter_client.py

This script actively listens for data coming in from `twitter_app.py` through port `9009`. The data is string representation of Twitter User id

After receiving the Twitter id, the script kicks off `make_profile` method from `user_profile_builder.py`. It will keep repeating the process of getting twitter user id and executing make_profile from user_profile_builder.py

* #### user_profile_builder.py

This script is the brain of data processing. It is responsible for analyzing tweets from a user. It will build user profile by getting 3200 tweets of a user through Twitter API. It will then perform sentiment analysis on those tweets and get topics by leveraging sklearn tf-idf vectorizer.

The script will determines user's frequent hashtags, topics that he/she generally tweets about and sentiments (positive or negative) for each of those topics. It will save the results in a redis database


