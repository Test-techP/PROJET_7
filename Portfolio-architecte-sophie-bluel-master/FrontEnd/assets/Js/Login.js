const URL = "http://localhost:5678/api/";
const loginForm =
document.querySelector("#login-form");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

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

        const data = await response.json();

        if(response.ok){

            localStorage.setItem("token", data.token);
            console.log("TOKEN STOCKE =", localStorage.getItem("token"));
            window.location.href = "Homepage_Index.html";

        } else {

            alert("Email ou mot de passe incorrect");

        }

    } catch(error){

        console.error(error);
        alert("Erreur serveur");

    }

});