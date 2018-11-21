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

    console.log(moment(currentTime).format("LT"));
    var firstTimeConverted = moment(newTime, "LT").subtract(1, "days");
    timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + timeDiff);
    var remainder = timeDiff % newFreq;
    console.log("Remainder: ", remainder);
    var minsUntilTrain = newFreq - remainder;
    console.log("Time Til Train: " + minsUntilTrain);
    
    var nextTrainTime = moment().add(minsUntilTrain, "minutes");
    console.log("Next arrival: " + moment(nextTrainTime).format("LT"));
    
    // 		nameInput: "Please enter a valid train name!",
    // 		destInput: "Please enter a valid destination!",
    // 		timeInput: "Please enter a valid time, HH:mm.",
    // 		freqInput: "Please enter a valid number."
    // }
    // });
    //update information in table 
    $('#currentTime').text(currentTime);
    $('#trainTable').append("<tr><td id='nameDisplay'>" + childSnapshot.val().name + "</td><td id='destDisplay'>" + childSnapshot.val().dest + "</td><td id='freqDisplay'>" + childSnapshot.val().freq + "</td><td id='nextDisplay'>" + moment(nextTrainTime).format("LT") + "</td><td id='awayDisplay'>" + minsUntilTrain + ' minutes until arrival' + "</td></tr>");
  }, function (errorObject) {
    console.log("Read failed: " + errorObject.code)
  });
  // database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
  //     // update html with children
  //     $("#nameDisplay").html(snapshot.val().name);
  //     $("#destDisplay").html(snapshot.val().dest);
  //     $("#timeDisplay").html(moment(nextTrain).format("HH:mm"));
  //     $("#freqDisplay").html(snapshot.val().freq);
  // })
  //remove train button click function
  $('#removeTrain').on('click', trainTable, function () {
    //$("#trainTable").closest('tr').remove ();
    var table = document.getElementById("trainTable");
    table.deleteRow(table.rows.length - 1);
  });
});