$(document).ready(function () {
    function c(x) {
        console.log(x);
    };
    var aptObj = {};
    var thisDate = moment().startOf("day");
    var thisDateString = thisDate.format("YYYY-MM-DD");
    var aptString = "appointments" + thisDateString;
    var thisDayData = {}
    var percentOfHour = 0
    var calRow = $("div.row.my-1")
    var startOfDay = moment().startOf("day");

    // clone calendar row for hours 10AM to 5PM. 
    // set data-hour and text value for consective hours
    for (var i = 10; i < 18; i++) {
        var newCalRow = calRow.clone();
        newCalRow.attr("data-hour", i);
        // transform 
        var v = moment().hour(i).format("hh A");
        newCalRow.children("div.hour-displ").text(v);
        $("div.container>div.row>div.col").append(newCalRow);
    }

    // set listeners
    $(".btn>.fa-lg").parent().on("click", save);
    $("textarea").on("input", checkValue);
    $(".fa-arrow-left,.fa-arrow-right").parent().on("click", switchDay);
    $("#today").on("click", switchDay);

    // check current time once per second to update the background colors
    // of the textarea fields
    var i = setInterval(function () {
        // background based on if the hour has passed, is current or is future
        $("textarea").each(function () {
            startOfDay = moment().startOf("day");
            var hour = moment().hour();
            // set grey if day or hour is passed
            if ((thisDate.isSame(startOfDay) && parseInt($(this).parent().data("hour")) < hour) || thisDate.isBefore(startOfDay)) {
                $(this).attr("style", "background-color: lightgray;");
            }
            // for current hour of current day, set gradient from gray to green (with a red bar at the percentage of the hour past)
            else if ((thisDate.isSame(startOfDay) && parseInt($(this).parent().data("hour")) === hour)) {
                percentOfHour = (((moment().minute() * 60) + moment().second()) / 3600) * 100;
                percentOfHour = Math.min(parseFloat(percentOfHour.toFixed(5)), 97);
                if (percentOfHour < 3) { greenPercent = percentOfHour * 3; redPercent = percentOfHour * 1.5; }
                else { greenPercent = Math.min(percentOfHour + 6, 100); redPercent = percentOfHour + 3; };
                var style = [
                    'background: -webkit-linear-gradient(left, lightgray ' + percentOfHour + '%, crimson ' + redPercent + '%, lightgreen ' + greenPercent + '%);',
                    'background: -moz-linear-gradient(left, lightgray ' + percentOfHour + '%, crimson ' + redPercent + '%, lightgreen ' + greenPercent + '%);',
                    'background: -ms-linear-gradient(left, lightgray ' + percentOfHour + '%, crimson ' + redPercent + '%, lightgreen ' + greenPercent + '%);',
                    'background: linear-gradient(left, lightgray ' + percentOfHour + '%, crimson ' + redPercent + '%, lightgreen ' + greenPercent + '%);',
                    'background: -o-linear-gradient(left,lightgray ' + percentOfHour + '%, crimson ' + redPercent + '%, lightgreen ' + greenPercent + '%);',
                ].join(";")
                $(this).attr("style", style);
            }
            // set green for future days / hours
            else {
                $(this).attr("style", "background-color: lightgreen;");
            }
        });
    }, 100)

    // if local data exists, set it to an object variable
    if (localStorage.getItem("calendarData") !== null) {
        aptObj = JSON.parse(localStorage.getItem("calendarData"));
    };

    // hide the 'Go to Today' button
    $("#today").css("visibility", "hidden");

    setPage();
    // populates the page based on any existing saved data
    // and sets the buttons to Saved (locked)
    function setPage() {
        if (thisDate.isSame(startOfDay)) {
            thisDateString = thisDateString + " (Today)"
        }
        $(".display-date").text(thisDateString);
        $("button.btn>i.fa-lg").addClass("fa-lock");
        $(".row textarea").val("");
        if (!aptObj[aptString]) {
            aptObj[aptString] = {}
        }
        thisDayData = aptObj[aptString];
        $.each(thisDayData, function (k, v) {
            $(".row[data-hour=\"" + k + "\"] textarea").val(v);
        });
    };

    // any time the user types, unlocks the Save button
    // relocks the Save button if the text matches the current saved data again
    function checkValue() {
        var bt = $(this).siblings("button")
        if ($(this).val() !== thisDayData[$(this).parent().data("hour")]) {
            bt.addClass("btn-light").removeClass("btn-dark disabled");
            bt.children("i").addClass("fa-unlock").removeClass("fa-lock");
        } else {
            bt.addClass("btn-dark disabled").removeClass("btn-light");
            bt.children("i").addClass("fa-lock").removeClass("fa-unlock");
        };
    };

    // sets the text value into the local storage when the save button is pressed
    function save() {
        var thisHour = $(this).parent().data("hour");
        thisDayData[thisHour] = $(this).siblings("textarea").val();
        aptObj[aptString] = thisDayData;
        localStorage.setItem("calendarData", JSON.stringify(aptObj));
        $(this).addClass("btn-dark disabled").removeClass("btn-light");
        $(this).children("i").addClass("fa-lock").removeClass("fa-unlock");
    };

    // increments the day forward or back and reset the page
    function switchDay() {
        if ($(this).children(".fa-arrow-right").length) {
            thisDate = thisDate.add('1', 'd');
        } else if ($(this).attr("id") === "today") {
            thisDate = moment().startOf("day");
        } else {
            thisDate = thisDate.subtract('1', 'd');
        };
        // display the 'go to today' button if any other date is displayed
        if (thisDate.isSame(startOfDay)) {
            $("#today").css("visibility", "hidden");
        } else {
            $("#today").css("visibility", "visible");
        };
        thisDateString = thisDate.format("YYYY-MM-DD");
        aptString = "appointments" + thisDateString;
        setPage();
    };
});