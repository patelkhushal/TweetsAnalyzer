def start_stream():
    while True:
        try:
            sapi = tweepy.streaming.Stream(auth, CustomStreamListener(api))
            sapi.filter(track=["Samsung", "s4", "s5", "note" "3", "HTC", "Sony", "Xperia", "Blackberry", "q5", "q10", "z10", "Nokia", "Lumia", "Nexus", "LG", "Huawei", "Motorola"])
        except: 
            continue

start_stream()