$(document).ready(function () {

  var config = {
    apiKey: "AIzaSyAAcIwoDtVGt4EIHefDNrVZuK9V8NYKWgo",
    authDomain: "train-3e542.firebaseapp.com",
    databaseURL: "https://train-3e542.firebaseio.com",
    projectId: "train-3e542",
    storageBucket: "train-3e542.appspot.com",
    messagingSenderId: "763894550967"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submit").on("click", function () {

    var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();

    database.ref().push({
      name: name,
      dest: dest,
      time: time,
      freq: freq,
      timeAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("input").val('');
    return false;
  });

  database.ref().on("child_added", function (childSnapshot) {
    var newName = childSnapshot.val().name;
    var newDest = childSnapshot.val().dest;
    var newTime = childSnapshot.val().time;
    var newFreq = childSnapshot.val().freq;

    var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    var firstTimeConverted = moment(newTime, "LT").subtract(1, "days");
    timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    var remainder = timeDiff % newFreq;
    var minsUntilTrain = newFreq - remainder;
    var nextTrainTime = moment().add(minsUntilTrain, "minutes");
  
    $('#currentTime').text(currentTime);
    $('#trainTable').append("<tr><td id='nameDisplay'>" + childSnapshot.val().name + "</td><td id='destDisplay'>" + childSnapshot.val().dest + "</td><td id='freqDisplay'>" + childSnapshot.val().freq + "</td><td id='nextDisplay'>" + moment(nextTrainTime).format("LT") + "</td><td id='awayDisplay'>" + minsUntilTrain + ' minutes until arrival' + "</td></tr>");
  }, function (errorObject) {
    console.log("Read failed: " + errorObject.code)
  });

  $('#removeTrain').on('click', trainTable, function () {

    var table = document.getElementById("trainTable");
    table.deleteRow(table.rows.length - 1);
  });
});