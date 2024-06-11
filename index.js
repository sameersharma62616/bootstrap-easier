function checkPassword() {
    const passwordInput = document.getElementById("passwordInput");
    const errorMessage = document.getElementById("errorMessage");

    // Check if the entered password is correct
    if (passwordInput.value === "1234") {
        // Redirect the user to the next page
        window.location.href = "attendence.html";
    } else {
        // Display error message
        errorMessage.textContent = "Incorrect password. Please try again.";
    }
}