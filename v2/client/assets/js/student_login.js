function togglePassword() {
    const passwordInput = document.getElementById("password");
    const pwdIcon = document.querySelector(".show-pwd");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        pwdIcon.classList.remove("ph-eye");
        pwdIcon.classList.add("ph-eye-slash");
    } else {
        passwordInput.type = "password";
        pwdIcon.classList.remove("ph-eye-slash");
        pwdIcon.classList.add("ph-eye");
    }
}
