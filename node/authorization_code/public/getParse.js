// this function gets the most recent text sent. It is stored in message.
window.onload = function(){
  Parse.initialize("89wcy5awrnsiWO6r1PpJQOIlSSuoa0KQ7jOYxCB6", "2j6tsHCxhO55tVyxfua7kSeZfHCIk7E67R3pNgRs");
  var Text = Parse.Object.extend("Text");
  var query = new Parse.Query(Text);
  query.descending("createdAt");
  query.first({
    success: function(results) {
      var message = results.get("body");
      alert(message);
      },
    error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
  });
};
