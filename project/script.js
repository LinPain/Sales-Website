document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const resetBtn = document.getElementById("reset");

    if (!form) {
        console.error("Form with ID 'registrationForm' not found");
        return;
    }

    const patterns = {
        username: /^[a-zA-Z0-9]{3,30}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /.{6,}$/,
    };

    function setError(field, message) {
        const errorEl = document.getElementById(`${field}_error`);
        if (errorEl) errorEl.textContent = message;
    }
    function clearErrors(field) {
        const errorEl = document.getElementById(`${field}_error`);
        if (errorEl) errorEl.textContent = "";
    }
    function validateField(id, regex, message) {
        const el = document.getElementById(id);
        const value = el ? el.value.trim() : "";
        if (!regex.test(value)) {
            setError(id, message);
            return false;
        }
        clearErrors(id);
        return true;
    }
    function passwordMatch() {
        const p2 = (document.getElementById("password") || {}).value || "";
        const p3 = (document.getElementById("verify") || {}).value || "";
        if (p2 !== p3) {
            setError("verify", "Passwords do not match");
            return false;
        }
        clearErrors("verify");
        return true;
    }
    function resetForm() {
        const fields = ["username","email", "password", "verify"];
        fields.forEach(f => {
            const input = document.getElementById(f);
            if (input) input.value = "";
            clearErrors(f);
        });
    }

    // handle registration form submit (works with SignIn button or any submit)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        if (!validateField("username", patterns.username, "Username must be 3-30 alphanumeric characters")) valid = false;
        if (!validateField("email", patterns.email, "Invalid email format")) valid = false;
        if (!validateField("password", patterns.password, "Password must be at least 6 characters")) valid = false;
        if (!passwordMatch()) valid = false;

        if (valid) {
            // save registration data so Login can reuse it
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value; // keep raw for simple reuse
            const user = { username, email, password };
            try {
                localStorage.setItem("btec_user", JSON.stringify(user));
            } catch (err) {
                console.warn("Could not save user to localStorage", err);
            }

            alert("Registration successful!");
            resetForm();
        } else {
            // focus first field with an error
            const firstError = Array.from(document.querySelectorAll("[id$='_error']")).find(el => el.textContent.trim() !== "");
            if (firstError) {
                const fieldId = firstError.id.replace('_error','');
                const fieldEl = document.getElementById(fieldId);
                if (fieldEl) fieldEl.focus();
            }
        }
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetForm();
        });
    }
});
