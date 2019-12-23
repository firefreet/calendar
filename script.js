$(document).ready( function(){
    function c(x) {
        console.log(x);
    };
    var aptObj = {};
    var thisDate = moment()
    var thisDateString = thisDate.format("YYYY-MM-DD");
    var aptString = "appointments" + thisDateString;
    var thisDayData = {}
    var cleanDate = {'hour':"0",'minute':'0','second':'0'}

    // set listeners
    $(".btn>.fa-lg").parent().on("click", save);
    $("textarea").on("input", checkValue);
    $(".fa-arrow-left,.fa-arrow-right").parent().on("click", switchDay);
    $("#today").on("click",switchDay);

    // check current time once per second to update the background colors
    // of the textarea fields
    var i = setInterval( function() {
        // background based on if the hour has passed, is current or is future
        $("textarea").each( function(){
            var hour = moment().hour();
            if((thisDate.format("YYYYMMDD") === moment().format("YYYYMMDD") && parseInt($(this).parent().data("hour")) < hour) || thisDate.set(cleanDate) < moment().set(cleanDate) ) {
                $(this).attr("style","background-color: lightgray;");
            } else if ((thisDate.format("YYYYMMDD") === moment().format("YYYYMMDD") && parseInt($(this).parent().data("hour")) === hour)) {
                $(this).attr("style","background-color: lightcoral;");
            } else {
                $(this).attr("style","background-color: lightgreen;");
            }
        });
    },100)

    // if local data exists, set it to an object variable
    if (localStorage.getItem("calendarData") !== null) {
        aptObj = JSON.parse(localStorage.getItem("calendarData"));
    };

    // hide the 'Go to Today' button
    $("#today").css("visibility","hidden");
    
    setPage();
    // populates the page based on any existing saved data
    // and sets the buttons to Saved (locked)
    function setPage() {
        if (thisDate.format("YYYYMMDD") === moment().format("YYYYMMDD")) {
            thisDateString = thisDateString + " (Today)"
        } 
        $(".display-date").text(thisDateString);
        $("button.btn>i.fa-lg").addClass("fa-lock");
        $(".row textarea").val("");
        if (!aptObj[aptString]) {
            aptObj[aptString] = {}
        }
        thisDayData = aptObj[aptString];
        $.each(thisDayData, function(k,v) {
            $(".row[data-hour=\"" + k +"\"] textarea").val(v);
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
        localStorage.setItem("calendarData",JSON.stringify(aptObj));
        $(this).addClass("btn-dark disabled").removeClass("btn-light");
        $(this).children("i").addClass("fa-lock").removeClass("fa-unlock");
    };

    // increments the day forward or back and reset the page
    function switchDay() {
        if ($(this).children(".fa-arrow-right").length) {
            thisDate = thisDate.add('1','d');
        } else if ($(this).attr("id") === "today") {
            thisDate = moment();
        } else {         
            thisDate = thisDate.subtract('1','d');    
        };
        // display the 'go to today' button if any other date is displayed
        if(thisDate.format("YYYYMMDD") === moment().format("YYYYMMDD")) {
            $("#today").css("visibility","hidden");
        } else { 
            $("#today").css("visibility","visible");
        };
        thisDateString = thisDate.format("YYYY-MM-DD");
        aptString = "appointments" + thisDateString;
        setPage();
    };
});