function check(event) {
    // Get Values
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var cpassword = document.getElementById('cpassword').value;
    var restaurant = document.getElementById('restaurant').value;
    var open = document.getElementById('openTime').value;
    var close = document.getElementById('closeTime').value;
    var cuisine = document.getElementById('type').value;

    console.log(name + email +password +cpassword +restaurant + open + close + cuisine)

    if (username.length == 0 && username.includes(" ")) {
        alert("Invalid name");
        console.log("Invalid name");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (email.length == 0 && email.includes(" ")) {
        alert("Invalid name");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (password.length == 0 password.includes(" ")) {
        alert("Invalid password");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (restaurant.length == 0) {
        alert("Invalid restaurant");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (password != cpassword) {
        alert("Password mismatch");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
