// App.js
// alias forever='./node_modules/forever/bin/forever'
/*
    SETUP
*/
var express = require('express');  
const path = require('path');
var db = require('./db-connector');

var app = express();   
PORT = 6125;             

// Database
// var db = require('./database/db-connector')

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

//Read Routes
app.get('/users', function(req, res){
    // Define our queries
    query = 'SELECT userID, userName FROM Users;';

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/songs', function(req, res){
    // Define our queries
    query = `SELECT Songs.songID, Songs.songName, Songs.streamCount, Artists.artistName FROM Songs JOIN Artists ON Songs.artistID = Artists.artistID ORDER BY Songs.artistID ASC;`;

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
    query = `SELECT
                PlaylistSongs.playlistSongsID,
                Playlists.playlistName,
                Songs.songName
            FROM PlaylistSongs
            JOIN Playlists ON PlaylistSongs.playlistID = Playlists.playlistID
            JOIN Songs ON PlaylistSongs.songID = Songs.songID;`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

//Insert Routes
app.post('/insertsong', function(req, res){
    const songName=req.body.songName;
    const streamCount=req.body.streamCount;
    const artistID=req.body.artistID;
    // Define our queries
    query = `INSERT INTO Songs (songName, streamCount, artistID)
    VALUES ("${songName}", "${streamCount}", ${artistID});`;

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/songs.html');
    });
});

app.post('/insertuser', function(req, res){
    const userName=req.body.userName;
    console.log(userName);
    // Define our queries
    query = `INSERT INTO Users (userName)
    VALUES ("${userName}");`;

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/users.html');
    });
});


//Delete Routes
app.post('/deletesong', function(req, res){
    const songID = req.body.songID;
    console.log(songID);
    query = `DELETE FROM Songs WHERE songID = ${songID};`;

    db.pool.query(query, function (err, results, fields) {
        console.log(JSON.stringify(results));
        res.redirect('/songs.html');
    })

});


//Update Routes
app.post('/updatesong', function(req, res){
    // const oldSongName=req.body.oldSongName;
    // const oldArtistID=req.body.oldArtistID;
    // const oldStreamCount=req.body.oldStreamCount;
    const songID=req.body.songID;
    const songName=req.body.songName;
    const streamCount=req.body.streamCount;
    const artistName=req.body.artistName;
    console.log(songName, songID, streamCount, artistName);
    // Define our queries
    query = `UPDATE Songs
    SET songName = "${songName}", streamCount = ${streamCount}, 
    artistID = (SELECT artistID FROM Artists WHERE artistName = "${artistName}")
    WHERE songID = ${songID};`

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/songs.html');
    });
});

app.get('/artistnames', function(req, res) {
    query = `SELECT artistName FROM Artists`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
