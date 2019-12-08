# Import socket module 
import socket 
import sys 
import time   

# import function make_profile from local python file to process twitter user id
from twitter_api import make_profile
  
# Create a socket object 
s = socket.socket()   
s.setsockopt( socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)       
  
# Define the port on which you want to connect 
port = 9009                
  
# connect to the server on local computer 
s.connect(('localhost', port)) 
i = 0
while(i < 10):
    s.send(b'send') #signal server to send data
    data = s.recv(1024) # receive data from the server 
    user_id = int(data.decode())
    print(user_id)
    make_profile(user_id)
    i = i + 1
    if(i >= 5):
        print("sleeping for 7 mins")
        time.sleep(500)
        i = 0

# close the connection 
s.close()  