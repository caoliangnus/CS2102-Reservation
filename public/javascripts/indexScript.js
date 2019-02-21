function check(event) {
    // Get Values
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;
    var people = document.getElementById('people').value;
    var restaurant = document.getElementById('restaurant').value;
    var location = document.getElementById('location');
    var hiddenLocation = document.getElementById('locationsHidden');
    var type = document.getElementById('type').value;

    var result = [];
    var options = location && location.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    document.getElementById('locationsHidden').value = result;

    console.log(date);
    console.log(time);
    console.log("People");
    if (people == "") {
        people = 0;
    }
    console.log(people);
    console.log(restaurant);
    console.log(type);
    console.log(result);

    var hour = time.split(":");
    var gethour = parseInt(hour[0]); 

    console.log(gethour);
    if (gethour < 9 || gethour > 22) {
        alert("Only allow 9am to 9pm");
        event.preventDefault();
        event.stopPropagation();
        return false;
    } else if (people > 10 || people == 0) {
        alert("Number of people should between 1 to 10");
        event.preventDefault();
        event.stopPropagation();
        return false;
    } else if (restaurant == 0 && type == 0 && result.length == 0) {
        alert("Please select Resturant name, type or location ");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }


    
}
