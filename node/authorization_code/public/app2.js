(function(exports) {
	var g_track = '';
	var doSearch = function(word, callback) {
		console.log('search for ' + word);
		var url = 'https://api.spotify.com/v1/search?type=track&limit=1&q=' + encodeURIComponent(word);
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				callback({
					track: r.tracks.items
						.map(function(item) {
							var ret = {
								name: item.name,
								artist: 'Unknown',
								artist_uri: '',
								album: item.album.name,
								album_uri: item.album.uri,
								cover_url: '',
								uri: item.uri
							};
							if (item.artists.length > 0) {
								ret.artist = item.artists[0].name;
								ret.artist_uri = item.artists[0].uri;
							}
							return ret;
						})
				});
			},
			error: function(r) {
				callback({
					word: word,
					tracks: []
				});
			}
		});
	};
	var g_access_token = '';
	var g_username = '';
	var client_id = '';
	var redirect_uri = '';
	if (location.host == 'localhost:8000') {
		client_id = 'd37a9e88667b4fb3bc994299de2a52bd';
		redirect_uri = 'http://localhost:8000/callback.html';
	} else {
		client_id = '6f9391eff32647baa44b1a700ad4a7fc';
		redirect_uri = 'http://lab.possan.se/playlistcreator-example/callback.html';
	}

	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks));
		localStorage.setItem('createplaylist-name', g_name);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	};

	exports.startApp = function(a_t) {
		Parse.initialize("89wcy5awrnsiWO6r1PpJQOIlSSuoa0KQ7jOYxCB6", "2j6tsHCxhO55tVyxfua7kSeZfHCIk7E67R3pNgRs");
		var Text = Parse.Object.extend("Text");
		var query = new Parse.Query(Text);
		var songURI;
		query.descending("createdAt");
		query.first({
		success: function(results) {
			if(results !== undefined){
			var message = results.get("body");
			var added = results.get("added");
			doSearch(message, function(result) {
				songURI = result.track[0].uri;
				console.log(JSON.stringify(songURI));
				var url = 'https://api.spotify.com/v1/users/krrgn3/playlists/3QfJtoy0hqSty9XdkJUJj0/tracks/?uris='+encodeURIComponent(songURI);
					$.ajax(url, {
						method: 'POST',
						//data: JSON.stringify(tracks),
						dataType: 'text',
						headers: {
							'Authorization': 'Bearer ' + a_t,
							'Content-Type': 'application/json'
						},
						success: function(r) {
							console.log('add track response', r);
							results.destroy({
							  success: function(results) {
							    // The object was deleted from the Parse Cloud.
									console.log("deleted");
							  },
							  error: function(results, error) {
							    // The delete failed.
							    // error is a Parse.Error with an error code and message.
									console.log(error);
							  }
							});
						},
						error: function(r) {
							console.log(a_t);
						}
					});
			});
		}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
		});
	};
})(window);
