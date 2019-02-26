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
    
    if (pw.length == 0) {
        alert("Invalid password");
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
<<<<<<< HEAD
	
	if (pw.length == 0) {
		alert("Invalid password");
		event.preventDefault();
        event.stopPropagation();
        return false;
	}
=======

  
>>>>>>> d07cd9f29e68b3ceafb67522aa53144e7543d48d
}