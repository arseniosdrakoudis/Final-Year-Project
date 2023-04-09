function validateForm() {
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirm-password");

    var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[\w!@#$%^&*()_+]{8,}$/;

    if (password.value != confirmPassword.value) {
        alert("Passwords do not match.");
        return false;
    } else if (!passwordRegex.test(password.value)) {
        alert(
            "Password must be at least 8 characters and contain at least one upper case letter, one lower case letter, one number, and one symbol."
        );
        return false;
    }

    return true;
}
