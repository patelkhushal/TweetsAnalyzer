const port = 8000;
const home = '/Users/patelkhushalibm.com'

const net = require('net');
const https = require('https');
const express = require('express');
const session = require('express-session');
var async = require('async');
var redis = require("redis");

var app = express();
app.enable('trust proxy');
app.use(session(
    {
        secret: "mine",
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));
// setup redis connection
redis_client = redis.createClient();
redis_client.on("error", function (err) {
    console.log("Error " + err);
});

function getSortedSet(key, callback) {
    redis_client.zrevrange(key, 0, 4, 'withscores', function (err, data) {
        if (err) throw err;
        else {
            let json_object = {};
            for (let i = 0; i < data.length - 1; i = i + 2) {
                json_object[data[i]] = data[i + 1]
            }
            callback(null, json_object)
        }
    });
}

function getKey(key, callback) {
    redis_client.get(key, function (err, data) {
        if (err) throw err;
        else callback(null, data)
    });
}

function buildUserProfiles(redis_id_keys, callback) {
    let random_user_profiles = []
    async.forEach(redis_id_keys, function (id_key, inner_callback) {
        let user_profile_json = {}
        let id = id_key.split("_")[0]
        user_profile_json["id"] = id
        async.waterfall([
            function (callback) {
                getKey(id + "_name", function (err, data) {
                    user_profile_json["name"] = data
                    callback(null)
                })
            },
            function (callback) {
                getKey(id + "_screen_name", function (err, data) {
                    user_profile_json["screen_name"] = data
                    callback(null)
                })
            },
            function (callback) {
                getKey(id + "_location", function (err, data) {
                    user_profile_json["location"] = data
                    callback(null)
                })
            },
            function (callback) {
                getKey(id + "_followers_count", function (err, data) {
                    user_profile_json["followers_count"] = data
                    callback(null)
                })
            },
            function (callback) {
                getKey(id + "_friends_count", function (err, data) {
                    user_profile_json["friends_count"] = data
                    callback(null)
                })
            },
            function (callback) {
                getKey(id + "_profile_image_url_https", function (err, data) {
                    user_profile_json["profile_image_url_https"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_hashtags", function (err, data) {
                    user_profile_json["hashtags"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_positive_topics", function (err, data) {
                    user_profile_json["positive_topics"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_negative_topics", function (err, data) {
                    user_profile_json["negative_topics"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_all_topics", function (err, data) {
                    user_profile_json["all_topics"] = data
                    callback(null)
                })
            },
        ], function (err, result) {
            random_user_profiles.push(user_profile_json)
            inner_callback(null)
        });
    }, function (err) {
        if (err) {
            throw err
        } else {
            callback(null, random_user_profiles)
            // res.json(random_user_profiles)
        }
    });
}

app.use('/list', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);
    let key = "3898767436_hashtags";
    redis_client.zrevrange(key, 0, 9, 'withscores', function (err, data) {
        if (err) throw err;
        else res.send(listToJson(data))
    });
});


app.use('/random', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);

    redis_client.keys('*_id', function (err, keys) {
        if (err) throw err;
        // if (keys.length > 2) {
        //     keys.length = 3
        // }
        buildUserProfiles(keys, function (err, data) {
            if (err) throw err
            else {
                res.json(data)
            }
        })
    });
});

//returns true if key contains at least one topic from list of topics
function existsInSortedSet(key, topics, callback) {
    let exists = false;
    async.forEach(topics, function (topic, inner_callback) {
        redis_client.zrevrange(key, 0, 9, 'withscores', function (err, data) {
            let top10 = new Set(data)
            if (err) throw err;
            else {
                if(top10.has(topic)) {
                    exists = true;
                    // console.log(key);
                    // console.log("topic: " + topic)
                    // console.log(top10)
                }
                inner_callback(null)
            }
        });
    }, function (err) {
        if (err) {
            throw err
        } else {
            callback(null, exists)
        }
    });
}

function searchTopics(topics, callback) {
    redis_client.keys('*_id', function (err, keys) {
        if (err) throw err;
        let topic_keys = new Set();
        async.forEach(keys, function (id_key, inner_callback) {
            let id = id_key.split("_")[0]
            async.waterfall([
                function (callback) {
                    existsInSortedSet(id + "_all_topics", topics, function (err, exists) {
                        if (err) throw err
                        if (exists) topic_keys.add(id + "_id")
                        callback(null)
                    })
                },
                function (callback) {
                    existsInSortedSet(id + "_positive_topics", topics, function(err, exists){
                        if (exists) topic_keys.add(id + "_id")
                        callback(null)
                    })
                },
                function (callback) {
                    existsInSortedSet(id + "_negative_topics", topics, function(err, exists){
                        if (exists) topic_keys.add(id + "_id")
                        callback(null)
                    })
                },
            ], function (err, result) {
                inner_callback(null)
            });
        }, function (err) {
            if (err) {
                throw err
            } else {
                buildUserProfiles(topic_keys, function (err, data) {
                    if (err) throw err
                    else {
                        callback(null, data)
                    }
                })
            }
        });
    });
}

app.use('/topics', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);
   //gainarianafans, "1195954759842308096"
    let topics = req.query.topics
    if(typeof(topics) == "string"){
        topics = topics.split()
    }
    console.log(topics)
    if (!topics) res.json({})
    searchTopics(topics, function (err, data) {
        if (err) throw err
        else res.json(data)
    })
});

// app.use('/user', function (req, res) {
//     res.set("Access-Control-Allow-Origin", "http://localhost:4200");
//    //gainarianafans, "1195954759842308096"
//     let user = req.query.topics
//     if(typeof(topics) == "string"){
//         topics = topics.split()
//     }
//     console.log(topics)
//     if (!topics) res.json({})
//     searchTopics(topics, function (err, data) {
//         if (err) throw err
//         else res.json(data)
//     })
// });


// --------------------------------------SERVER
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%d', host, port);
});