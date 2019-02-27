function check(event) {
    // Get Values
    var redeemPoints = document.getElementById('redeemPoints').value;

    console.log(redeemPoints)

    // Simple Check
    if (redeemPoints < 10) {
        alert("You need at least 10 points to redeem.");
        event.preventDefault();
        event.stopPropagation();
        return false;
    } else {
		alert("You have redeemed your points.");
	}
}