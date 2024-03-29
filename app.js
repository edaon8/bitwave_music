// App.js
// alias forever='./node_modules/forever/bin/forever'
/*
    SETUP
*/
var express = require('express');  
const path = require('path');
var db = require('./db-connector');

var app = express();   
PORT = 6127;             

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
    const artistName=req.body.artistName;
    // Define our queries
    query = `INSERT INTO Songs (songName, streamCount, artistID)
    VALUES ("${songName}", ${streamCount}, 
    (SELECT artistID FROM Artists WHERE artistName = "${artistName}")
    );`;
    console.log(songName, streamCount, artistName);
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

app.post('/insertartist', function(req, res){
    const artistName=req.body.artistName;
    const streamCount=req.body.streamCount;
    // Define our queries
    query = `INSERT INTO Artists (artistName, streamCount)
    VALUES ("${artistName}", ${streamCount});`;

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/artists.html');
    });
});

app.post('/insertplaylist', function(req, res){
    const userName=req.body.userName;
    const playlistName=req.body.playlistName;
    const playlistLike=req.body.playlistLike;
    // Define our queries
    query = `INSERT INTO Playlists (userID, playlistName, playlistLike)
    VALUES ((SELECT userID FROM Users WHERE userName = "${userName}"), 
        "${playlistName}", ${playlistLike});`;
    console.log(userName, playlistName, playlistLike);

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/playlists.html');
    });
});

app.post('/insertplaylistsong', function(req, res){
    const playlistName=req.body.playlistName;
    const songName=req.body.songName;
    // Define our queries
    query = `INSERT INTO PlaylistSongs (playlistID, songID)
    VALUES ((SELECT playlistID FROM Playlists WHERE playlistName = "${playlistName}"), 
        (SELECT songID FROM Songs WHERE songName = "${songName}"));`;

    db.pool.query(query, function (err, results, fields){
        res.redirect('/playlistsongs.html');
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

app.post('/deleteuser', function(req, res){
    const userID = req.body.userID;
    console.log(userID);
    query = `DELETE FROM Users WHERE userID = ${userID};`;

    db.pool.query(query, function (err, results, fields) {
        console.log(JSON.stringify(results));
        res.redirect('/users.html');
    })
});

app.post('/deleteartist', function(req, res){
    const artistID = req.body.artistID;
    console.log(artistID);
    query = `DELETE FROM Artists WHERE artistID = ${artistID};`;

    db.pool.query(query, function (err, results, fields) {
        console.log(JSON.stringify(results));
        res.redirect('/artists.html');
    })
});

app.post('/deleteplaylist', function(req, res){
    const playlistID = req.body.playlistID;
    query = `DELETE FROM Playlists WHERE playlistID = ${playlistID};`;

    db.pool.query(query, function (err, results, fields) {
        console.log(JSON.stringify(results));
        res.redirect('/playlists.html');
    })
});

app.post('/deleteplaylistsong', function(req, res){
    const playlistSongsID = req.body.playlistSongsID;
    query = `DELETE FROM PlaylistSongs WHERE playlistSongsID = ${playlistSongsID};`;

    db.pool.query(query, function (err, results, fields) {
        res.redirect('/playlistsongs.html');
    })
});


//Update Routes
app.post('/updatesong', function(req, res){
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

app.post('/updateuser', function(req, res){
    const userID=req.body.userID;
    const userName=req.body.userName;
    // Define our queries
    query = `UPDATE Users SET userName = "${userName}"
    WHERE userID = ${userID}`;

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/users.html');
    });
});

app.post('/updateartist', function(req, res){
    const artistID=req.body.artistID;
    const artistName=req.body.artistName;
    const streamCount=req.body.streamCount;
    // Define our queries
    query = `UPDATE Artists SET artistName = "${artistName}", streamCount = "${streamCount}"
    WHERE artistID = ${artistID}`;

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/artists.html');
    });
});

app.post('/updateplaylist', function(req, res){
    const playlistID=req.body.playlistID;
    const userName=req.body.userName;
    const playlistName=req.body.playlistName;
    const playlistLike=req.body.playlistLike;
    // Define our queries
    query = `UPDATE Playlists
    SET userID = (
            SELECT userID FROM Users WHERE userName = "${userName}"
        ), 
        playlistName = "${playlistName}", 
        playlistLike = ${playlistLike}
        WHERE playlistID = ${playlistID};`;

    db.pool.query(query, function (err, results, fields){
        console.log(JSON.stringify(results));
        res.redirect('/playlists.html');
    });
});

app.post('/updateplaylistsong', function(req, res){
    const playlistSongsID=req.body.playlistSongsID;
    const playlistName=req.body.playlistName;
    const songName=req.body.songName;
    // Define our queries
    query = `UPDATE PlaylistSongs
    SET playlistID = (
            SELECT playlistID FROM Playlists WHERE playlistName = "${playlistName}"
        ), 
        songID = (
            SELECT songID FROM Songs WHERE songName = "${songName}"
        )
        WHERE playlistSongsID = ${playlistSongsID};`;

    db.pool.query(query, function (err, results, fields){
        res.redirect('/playlistsongs.html');
    });
});


//Misc Routes
app.get('/artistnames', function(req, res) {
    query = `SELECT artistName FROM Artists`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/usernames', function(req, res) {
    query = `SELECT userName FROM Users`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/songnames', function(req, res) {
    query = `SELECT songName FROM Songs`;

    db.pool.query(query, function (err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/playlistnames', function(req, res) {
    query = `SELECT playlistName FROM Playlists`;

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
