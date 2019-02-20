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

    if (people > 10) {
        alert("Can not book more than 10 people");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    // // Simple Check
    // if (name.length == 0) {
    //     alert("Invalid name");
    //     event.preventDefault();
    //     event.stopPropagation();
    //     return false;
    // }
    // if (email.length == 0) {
    //     alert("Invalid name");
    //     event.preventDefault();
    //     event.stopPropagation();
    //     return false;
    // }
    // if (pw != repw) {
    //     alert("Password mismatch");
    //     event.preventDefault();
    //     event.stopPropagation();
    //     return false;
    // }
}