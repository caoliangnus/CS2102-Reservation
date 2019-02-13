function check(event) {
    // Get Values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var pw = document.getElementById('password').value;
    var repw = document.getElementById('repassword').value;

    console.log(name + email)

    // Simple Check
    if (name.length == 0) {
        alert("Invalid name");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (email.length == 0) {
        alert("Invalid name");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if (pw != repw) {
        alert("Password mismatch");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}