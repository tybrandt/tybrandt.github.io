function loadEvents(cal) {
    cal.addEventSource(JSON.parse(localStorage.getItem('events')));
}

function addMoodToCalendar(mood) {
    var moods = localStorage.getItem('events')
    moods = JSON.parse(moods);
    moods.push(mood);
    localStorage.setItem('events', JSON.stringify(moods));
    console.log("adding to calendar");
}

function finishMoodSurvey() {
    console.log("in the callback");
    var mood = {
        title: '',
        start: new Date(),
        backgroundColor: 'blue'
    }
    //choose the right face
    var rating = parseInt($("#mood_bar").val());
    console.log(rating);
    if (rating <= 2) {
        //sad face
        mood.title = 'Sad';
        mood.backgroundColor = 'blue';
        $("#toggle_smile").attr("src", "img/sad.svg");
        console.log("sad");
    }
    if (rating > 2 && rating < 6) {
        //neutral face
        mood.title = 'Neutral';
        mood.backgroundColor = 'yellow';
        $("#toggle_smile").attr("src", "img/neutral.svg");
        console.log("meh");
    }
    if (rating > 5) {
        //happy face
        mood.title = 'Happy';
        mood.backgroundColor = 'green';
        
        $("#toggle_smile").attr("src", "img/smile.svg");
        console.log("good");
    }
    //addMoodToCalendar(mood);       I commented this out because it is not working
    //choose the right word(s)
    var wordsDay = $("input[name='mood_description[]']:checked");
    var wordsLen = wordsDay.length;
    var sentence = "I am feeling ";
    if(wordsLen<1){
        sentence= "";
    }
    else if(wordsLen==1){
        if (wordsDay[wordsDay.length - 1].value == "other") {
            sentence += $("input[name='moodtext']").val() + " Today.";
        }
        else {
            sentence += wordsDay[wordsDay.length - 1].value + " Today.";
        }
    }
    else{
        for (let i = 0; i < wordsLen - 1; i++) {
            console.log(wordsDay[i].value);
            sentence += wordsDay[i].value;
            if(wordsLen>2){
                sentence+= ", ";
            }
            else{
                sentence +=" ";
            }
        }
        if (wordsDay[wordsDay.length - 1].value == "other") {
            sentence += "and "+$("input[name='moodtext']").val() + " Today.";
        }
        else {
            sentence += "and " +wordsDay[wordsDay.length - 1].value + " Today.";
        }
    }
    
    $("#mood_sent").html(sentence);

    //toggle the survey to the  mood_display
    $('#mood_survey').css('display', 'none');
    $('#mood_display').css('display', 'flex');

    var moods = JSON.parse(localStorage.getItem('mood'));
    var date = new Date();
    var key = String(date.getDate()) + String(date.getMonth()) + String(date.getYear())
    moods.push({[key]: sentence});
    localStorage.setItem('mood', JSON.stringify(moods));

    var ratings = JSON.parse(localStorage.getItem('rating'));
    var date = new Date();
    var key = String(date.getDate()) + String(date.getMonth()) + String(date.getYear())
    ratings.push({[key]: rating});
    localStorage.setItem('rating', JSON.stringify(ratings));
}

function editMoodSurvey(){
    //toggle the survey to the  mood_display
    $('#mood_survey').css('display', 'block');
    $('#mood_display').css('display', 'none');
}

$(document).ready(function () {
    if (localStorage.getItem('events') === null) {
        localStorage.setItem('events', JSON.stringify([]));
    }
    if (localStorage.getItem('journal') === null) {
        localStorage.setItem('journal', JSON.stringify([]));
    }
    if (localStorage.getItem('mood') === null) {
        localStorage.setItem('mood', JSON.stringify([]));
    }
    if (localStorage.getItem('rating') === null) {
        localStorage.setItem('rating', JSON.stringify([]));
    }
    var cal = document.getElementById("calendar");
    if (cal) {
        $("#exampleModalLong").modal('hide');
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            eventDisplay: 'block',
            dateClick: function(info) {
                info.jsEvent.preventDefault();
                var modal = document.getElementById('modal-body');
                modal.innerHTML = "";
                $("#closeModal").click(function (event) {
                    event.preventDefault();
                    $("#exampleModalLong").modal('hide');    
                })
                var journals = JSON.parse(localStorage.getItem('journal'));
                var date = info.date;
                var now = String(date.getDate()) + String(date.getMonth()) + String(date.getYear());
                journals.forEach(entry => {
                    var key = Object.keys(entry)[0];
                    if (key === now) {
                        modal.innerHTML = entry[key];
                    }
                })
                
                $("#exampleModalLong").modal('show');
            }
        });
        calendar.render();
        loadEvents(calendar);
    }
    else {
        //console.log("adding event listener");
        $("#submitSurvey").click(function (event) {
            console.log("line 4")
            event.preventDefault();
            finishMoodSurvey();
        })

        $("#save").click(function (event) {
            event.preventDefault();
            var text = $("#j_entry").val();
            var journals = JSON.parse(localStorage.getItem('journal'));
            var date = new Date();
            var key = String(date.getDate()) + String(date.getMonth()) + String(date.getYear())
            journals.push({[key]: text});
            localStorage.setItem('journal', JSON.stringify(journals));
            //tell user it has been saved
            $("#saveJournal").html("Entry Saved");
        }) 

        //edit survey
        $("#editSurvey").click(function (event) {
            event.preventDefault();
            editMoodSurvey();
        })


    }

    var jEntry = document.getElementById("j_entry");
    if (jEntry) {
        var journals = JSON.parse(localStorage.getItem('journal'));
        var date = new Date();
        var now = String(date.getDate()) + String(date.getMonth()) + String(date.getYear());
        journals.forEach(entry => {
            var key = Object.keys(entry)[0];
            if (key === now) {
                jEntry.innerHTML = entry[key];
            }
        })
    }

    var moodEntry = document.getElementById('mood_survey');
    if (moodEntry) {
        var moods = JSON.parse(localStorage.getItem('mood'));
        var date = new Date();
        console.log("PARSING MOODS")
        var now = String(date.getDate()) + String(date.getMonth()) + String(date.getYear());
        moods.forEach(entry => {
            var key = Object.keys(entry)[0];
            if (key === now) {
                $("#mood_sent").html(entry[key]);
                $('#mood_survey').css('display', 'none');
                $('#mood_display').css('display', 'flex');
                var elements = document.getElementsByClassName('my-moods');
                let hardcodedMoods = ['Happy', 'Sad', 'Angry', 'Afraid', 'Tired', 'Calm'];
                for (var i = 0; i < elements.length; i += 1) {
                    elements[i].checked = false;
                    document.getElementById('other-mood-text').value = ''
                    if (i !== elements.length) {
                        var otherMood = String(String(entry[key]).split('and ')[1]).split(' Today')[0]
                        if (String(entry[key]).includes(elements[i].value) && hardcodedMoods.includes(elements[i].value)) {
                            elements[i].checked = true;
                        } else if (!hardcodedMoods.includes(elements[i].value) && !hardcodedMoods.includes(otherMood) && otherMood !== 'undefined') {
                            console.log("OTHER MOOD: " + otherMood)
                            document.getElementById('other-mood').checked = true;
                            document.getElementById('other-mood-text').value = otherMood;
                        }
                    }
                }
            }
        })

        var ratings = JSON.parse(localStorage.getItem('rating'));
        var date = new Date();
        var now = String(date.getDate()) + String(date.getMonth()) + String(date.getYear());
        ratings.forEach(entry => {
            var key = Object.keys(entry)[0];
            if (key === now) {
                var rating = parseInt(entry[key]);
                if (rating <= 2) {
                    //sad face
                    $("#toggle_smile").attr("src", "img/sad.svg");
                    console.log("sad");
                } else if (rating > 2 && rating < 6) {
                    //neutral face
                    $("#toggle_smile").attr("src", "img/neutral.svg");
                    console.log("meh");
                } else if (rating >= 6) {
                    //happy face
                    $("#toggle_smile").attr("src", "img/smile.svg");
                    console.log("good");
                }
                console.log("THIS IS THE ENTRY: " + entry[key])
                document.getElementById('mood_bar').value = entry[key];
            }
        })
    }
    $("#CAP").click(function(){
        alert("Warning: You are leaving our page, but your data will be saved.");
    });
})
