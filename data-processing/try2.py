#This script will be run by node (index.js) from back end node server in express-app directory
import sys
# import function make_profile from user_profile_builder.py (local file) to process twitter user id
from user_profile_builder import make_profile

make_profile(sys.argv[1])
print("done") #signal the node process about the progress
sys.stdout.flush()

# try:
#     make_profile(sys.argv[1])
#     print("done") #signal the node process about the progress
#     sys.stdout.flush()
# except:
#     print("error")
#     sys.stdout.flush()