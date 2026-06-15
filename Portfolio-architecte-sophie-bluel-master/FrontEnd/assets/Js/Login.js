const URL = "http://localhost:5678/api/";
const loginForm = document.querySelector("#login-form");
const errorMessage = document.querySelector("#error-message");

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

if (!loginForm || !errorMessage) {
    console.error("Éléments du formulaire introuvables");
}
// Envoie les identifiants à l'API et stocke le token en session si la connexion réussit
// Affiche un message d'erreur sous le formulaire
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    hideError();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    try {
        const response = await fetch(URL + "users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json().catch(() => null);

        if (data && data.token) {
            sessionStorage.setItem("token", data.token);
            window.location.href = "Homepage_Index.html";
        } else {
            showError("Email ou mot de passe incorrect.");
        }
    } catch (error) {
        console.error(error);
        showError("Erreur de connexion. Veuillez réessayer.");
    }
});