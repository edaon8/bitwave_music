// App.js
// alias forever='./node_modules/forever/bin/forever'
/*
    SETUP
*/
var express = require('express');  
const path = require('path');
var db = require('./db-connector');

var app = express();   
PORT = 6124;             

// Database
// var db = require('./database/db-connector')

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

//Insert Routes
app.get('/users', function(req, res){
    // Define our queries
    query = 'SELECT userID, userName FROM Users;';

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/songs', function(req, res){
    // Define our queries
    query = `SELECT Songs.songID, Songs.songName, Songs.streamCount, Artists.artistName FROM Songs JOIN Artists ON Songs.artistID = Artists.artistID;`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/artists', function(req, res){
    // Define our queries
    query = 'SELECT artistID, artistName, streamCount FROM Artists;';

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/playlists', function(req, res){
    // Define our queries
    query = `SELECT Playlists.playlistID, Users.userName, Playlists.playlistName, Playlists.playlistLike 
            FROM Playlists 
            JOIN Users ON Playlists.userID = Users.userID;`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/playlistsongs', function(req, res){
    // Define our queries
    query = 'SELECT playlistSongsID, playlistID, songID FROM PlaylistSongs;';

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

//Insert Routes
app.post('/insertsong', function(req, res){
    const songName=req.body.songName;
    const streamCount=req.body.streamCount;
    const artistID=req.body.artistID;
    console.log(songName);
    // Define our queries
    query = `INSERT INTO Songs (songName, streamCount, artistID)
    VALUES (${songName}, ${streamCount}, ${artistID});`;

    db.pool.query(query, function (err, results, fields){
        res.send();
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});