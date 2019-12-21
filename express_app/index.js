const port = 8000;
const home = '/Users/patelkhushalibm.com'

const net = require('net');
const https = require('https');
const express = require('express');
const session = require('express-session');
var async = require('async');
var redis = require("redis");
var spawn = require("child_process").spawn;
var fs = require('fs');

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

//returns top n values stored at key
function getSortedSet(key, n, callback) {
    redis_client.zrevrange(key, 0, n, 'withscores', function (err, data) {
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

function buildUserProfiles(redis_id_keys, id_passed, n, callback) {
    let random_user_profiles = []
    async.forEach(redis_id_keys, function (id_key, inner_callback) {
        let user_profile_json = {}
        let id
        let screen_name
        if (id_passed) {
            id = id_key.split("_")[0]
            user_profile_json["id"] = id
        }
        else {
            // console.log("in2")
            screen_name = id_key
        }
        async.waterfall([
            function (callback) {
                if (screen_name) {
                    redis_client.keys('*_screen_name', function (err, keys) {
                        if (err) throw err;
                        async.forEach(keys, function (key, inner_callback) {
                            redis_client.get(key, function (err, data) {
                                if (data == screen_name) {
                                    // console.log(data)
                                    // console.log(screen_name)
                                    id = key.split("_")[0]
                                }
                                inner_callback(null)
                            })

                        }, function (err) {
                            // console.log("in3")
                            if (err) {
                                throw err
                            } else {
                                user_profile_json["id"] = id
                                // console.log(user_profile_json["id"])
                                callback(null)
                            }
                        });
                        // id = keys[0].split("_")[0]
                    });
                }
                else {
                    callback(null)
                }
            },
            function (callback) {
                getKey(id + "_name", function (err, data) {
                    user_profile_json["name"] = data
                    // console.log(user_profile_json["name"])
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
                getKey(id + "_profile_url", function (err, data) {
                    user_profile_json["profile_url"] = data
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
                getSortedSet(id + "_hashtags", n, function (err, data) {
                    user_profile_json["hashtags"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_positive_topics", n, function (err, data) {
                    user_profile_json["positive_topics"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_negative_topics", n, function (err, data) {
                    user_profile_json["negative_topics"] = data
                    callback(null)
                })
            },
            function (callback) {
                getSortedSet(id + "_all_topics", n, function (err, data) {
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
        }
    });
}

app.use('/random', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);

    redis_client.keys('*_id', function (err, keys) {
        if (err) throw err;
        buildUserProfiles(keys, true, 4, function (err, data) {
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
        redis_client.zrevrange(key, 0, 4, 'withscores', function (err, data) {
            let top10 = new Set(data)
            if (err) throw err;
            else {
                if (top10.has(topic)) {
                    exists = true;
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
                    existsInSortedSet(id + "_positive_topics", topics, function (err, exists) {
                        if (exists) topic_keys.add(id + "_id")
                        callback(null)
                    })
                },
                function (callback) {
                    existsInSortedSet(id + "_negative_topics", topics, function (err, exists) {
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
                buildUserProfiles(topic_keys, true, 4, function (err, data) {
                    if (err) throw err
                    else {
                        callback(null, data)
                    }
                })
            }
        });
    });
}

function searchHashtags(hashtags, callback) {
    redis_client.keys('*_id', function (err, keys) {
        if (err) throw err;
        let hashtag_keys = new Set();
        async.forEach(keys, function (id_key, inner_callback) {
            let id = id_key.split("_")[0]
            async.waterfall([
                function (callback) {
                    existsInSortedSet(id + "_hashtags", hashtags, function (err, exists) {
                        if (exists) hashtag_keys.add(id + "_id")
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
                buildUserProfiles(hashtag_keys, true, 4, function (err, data) {
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
    res.set("Access-Control-Allow-Credentials", true);
    let topics = req.query.topics
    if (typeof (topics) == "string") {
        topics = topics.split()
    }
    if (!topics) res.json({})
    else {
        searchTopics(topics, function (err, data) {
            if (err) throw err
            else res.json(data)
        })
    }
});

app.use('/hashtags', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);
    let hashtags = req.query.hashtags
    if (typeof (hashtags) == "string") {
        hashtags = hashtags.split()
    }
    if (!hashtags) res.json({})
    else {
        searchHashtags(hashtags, function (err, data) {
            if (err) throw err
            else res.json(data)
        })
    }
});

app.use('/getUser', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);
    let id = req.query.id
    if (id) {
        buildUserProfiles([id], true, 9, function (err, data) {
            if (err) throw err
            else {
                res.json(data)
            }
        })
    }
    else {
        let screen_name = req.query.name
        buildUserProfiles([screen_name], false, 9, function (err, data) {
            if (err) throw err
            else {
                res.json(data)
            }
        })
    }
});

app.use('/generateProfile', function (req, res) {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);
    let screen_name = req.query.screen_name

    path = fs.realpathSync('../data-processing/try2.py', []);
    console.log(path)
    pyprog = spawn('python',[path, screen_name]);

    pyprog.stdout.on('data', (data) => {
        console.log(data.toString())
        if(data.toString().trim() == "error"){
            res.json([{}])
        }
        else{
            res.json([{"request": "success"}])
            // buildUserProfiles([screen_name], false, 9, function (err, data) {
            //     console.log(data)
            //     if (err) throw err
            //     else {
            //         res.json(data)
            //     }
            // })
        }
    });

    pyprog.stderr.on('data', (data) => {
        console.log(data.toString())
    });
});


// --------------------------------------SERVER
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%d', host, port);
});