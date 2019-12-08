track1 = ['#crypto', '#ethereum', '#bitcoin', '#blockchain', '#cryptocurrency', '#btc', '#money', '#price', '#mining', '#litecoin']
track2 = ['#republican', '#gop', '#trump', '#vote', '#house', '#congress', '#senate', '#law', '#politicians', '#liberal']
track3 = ['#programming', '#python', '#java', '#stem', '#computerscience', '#javascript', '#django', '#webapps', '#mobileapps', '#software']
track4 = ['#apple', '#iphone', '#iphonex', '#macbook', '#ios', '#macos', '#siri', '#imac', '#applemusic', '#itunes', '#stevejobs', '#timcook']
track5 = ['#technology', '#innovation', '#future', '#cloud', '#tech', '#facebook', '#google', '#iot', '#app', '#career']
track6 = ['marvel', 'dc', 'superman', 'batman', 'avengers', 'justiceleague', 'spiderman', 'superhero', 'superheroes', 'wonder woman', 'blackwidow']
track7 = ['playstation', 'games', 'fortnite', 'witcher', 'got', 'pubg', 'ps4', 'ps5', 'xbox', 'stadia', 'console', 'pc', 'videogames']
track8 = ['movies', 'starwars', 'mandalorian', 'babyyoda', 'yoda', 'hollywood', 'netflix', 'prime', 'hulu', 'disney+', 'actors', 'actress']
track9 = ['music', 'jazz', 'rock', 'pop', 'country', 'billboards', 'guitar', 'culture', 'anthropology', 'university', 'lawyer', 'humanity', 'art', 'arts', 'mathematics']
track10 = ["AI","Engineering","Computer","IT","Nanotechnology","NASA","Sputnik","space","astronomy","programming","java","python","ruby","c","c++","javascript","js","angular","reactjs","vuejs","golang","tesla","elon musk","iot"]
track = track1 + track2 + track3 + track4 + track5 + track6 + track7 + track8 + track9 + track10
new_track = list()
for topic in track:
    # print (topic)
    new_track.append(topic.replace('#', ''))
print(new_track)