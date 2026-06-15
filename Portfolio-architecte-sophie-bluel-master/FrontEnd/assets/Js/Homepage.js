const URL = "http://localhost:5678/api/";
const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");
let workList = [];

// Récupère les projets depuis l'API puis initialise la galerie, la modale et les filtres 
function fetchProject() {
    fetch(URL + "works")
        .then(reponse => reponse.json())
        .then(works => {
            workList = works;
            works.forEach(work => {
                createProjects(work);
                createModalItem(work);
            });
            createFilters(works);
        })
        .catch(error => {
            console.error("Erreur API :", error);
        });
}

// Crée et affiche un projet dans la galerie principale
function createProjects(work) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    gallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
}

// Extrait les catégories uniques depuis la liste des projets
function getCategories(works) {
    const categories = [];
    works.forEach(work => {
        if (!categories.includes(work.category.name)) {
            categories.push(work.category.name);
        }
    });
    return categories;
}

// Ajoute un écouteur de clic sur chaque bouton de filtre
function addFilterEvents() {
    const buttons = document.querySelectorAll(".filters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            filterWorks(button.dataset.filter);
        });
    });
}

// Filtre les projets selon la catégorie sélectionnée et met à jour la galerie
function filterWorks(category) {
    gallery.innerHTML = "";
    let filteredWorks = workList;

    if (category !== "all") {
        filteredWorks = workList.filter(work =>
            work.category.name === category
        );
    }
    filteredWorks.forEach(work => {
        createProjects(work);
    });
}

// Crée dynamiquement les boutons de filtres à partir des catégories disponibles
function createFilters(works) {
    const filtersContainer = document.querySelector(".filters");

    filtersContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.dataset.filter = "all";
    filtersContainer.appendChild(allBtn);

    const categories = getCategories(works);

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.dataset.filter = cat;
        filtersContainer.appendChild(btn);
    });
    addFilterEvents();
}

fetchProject();

//page loggée 
function isLoggedIn() {
    return !!sessionStorage.getItem("token");
}

// Met à jour l'interface selon l'état de connexion de l'utilisateur
function updateUI() {
    const filters = document.querySelector(".filters");
    const editMode = document.querySelector(".edit-mode");
    const editButton = document.querySelector(".edit-button");
    const loginLink = document.querySelector("#login-link");

    if (isLoggedIn()) {
        filters.classList.add("hidden");
        editMode.classList.remove("hidden");
        editMode.classList.add("displayFlex");
        editButton.classList.remove("hidden");
        editButton.classList.add("displayFlex");
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.onclick = (event) => {
            event.preventDefault();
            logout();
        };
    } else {
        filters.classList.remove("hidden");
        editMode.classList.add("hidden");
        editMode.classList.remove("displayFlex");
        editButton.classList.add("hidden");
        editButton.classList.remove("displayFlex");
        loginLink.textContent = "login";
        loginLink.href = "Login_Index.html";
        loginLink.onclick = null;
    }
}
// Déconnecte l'utilisateur et remet l'interface en mode visiteur
function logout() {
    sessionStorage.removeItem("token");

    updateUI();

    modal.classList.remove("active");
    view1.classList.remove("hidden");
    view2.classList.add("hidden");

    resetAddPhotoForm();
}

updateUI();

// Gestion de l'ouverture, fermeture et navigation entre les deux vues de la modale

const modal = document.querySelector(".modal");
const btnEdit = document.querySelector(".edit-button");
const btnClose = document.querySelector(".close");

btnEdit.addEventListener("click", () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        console.log("Utilisateur non connecté");
        return;
    }
    modal.classList.add("active");
    view1.classList.remove("hidden");
    view2.classList.add("hidden");
});

btnClose.addEventListener("click", () => {
    resetAddPhotoForm();

    modal.classList.remove("active");
    view1.classList.remove("hidden");
    view2.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {

        resetAddPhotoForm();

        modal.classList.remove("active");
        view1.classList.remove("hidden");
        view2.classList.add("hidden");
    }
});

const view1 = document.querySelector(".content-gallery");
const view2 = document.querySelector(".content-add-photo");
const btnAdd = document.querySelector(".btn-open-add");
const backArrow = document.querySelector(".back-arrow");

btnAdd.addEventListener("click", () => {
    view1.classList.add("hidden");
    view2.classList.remove("hidden");
});

backArrow.addEventListener("click", () => {
    resetAddPhotoForm();

    view2.classList.add("hidden");
    view1.classList.remove("hidden");
});

// Crée une miniature dans la modale avec un bouton de suppression lié à l'API
function createModalItem(work) {
    const item = document.createElement("div");
    item.classList.add("modal-item");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");

    deleteBtn.innerHTML = `
        <span class="material-symbols-outlined">
            delete
        </span>
    `;
    deleteBtn.addEventListener("click", async () => {

        try {
            const response = await fetch(URL + "works/" + work.id, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                workList = workList.filter(currentWork => currentWork.id !== work.id);
                gallery.innerHTML = "";
                modalGallery.innerHTML = "";
                workList.forEach(work => {
                    createProjects(work);
                    createModalItem(work);
                });
            } else {
                console.error("Suppression impossible");
            }
        } catch (error) {
            console.error(error);
        }
    });
    item.appendChild(img);
    item.appendChild(deleteBtn);
    modalGallery.appendChild(item);
}


const imageInput = document.querySelector("#image-upload");
const previewImage = document.querySelector(".preview-image");
const uploadIcon = document.querySelector(".upload-icon");

// Récupère les catégories depuis l'API pour alimenter le select du formulaire
async function FetchCategories() {
    try {
        const response = await fetch(URL + "categories");
        const categories = await response.json();

        fillCategories(categories);
    }
    catch (error) {
        console.error(error);
    }
}

// Remplit le select avec une option par défaut puis les catégories reçues
function fillCategories(categories) {
    const select = document.querySelector("#category");

    select.innerHTML = `
        <option value="" selected disabled>
            Sélectionnez une catégorie
        </option>
    `;
    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        select.appendChild(option);
    });
}

FetchCategories();

const form = document.querySelector(".modal-form");

// Envoie le nouveau projet à l'API avec FormData puis met à jour les galeries
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value;
    const category = categorySelect.value;
    const image = imageInput.files[0];

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
        const response = await fetch(URL + "works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du projet");
        }

        const newWork = await response.json();

        createProjects(newWork);
        createModalItem(newWork);
        workList.push(newWork);

        resetAddPhotoForm();

        modal.classList.remove("active");
        view2.classList.add("hidden");
        view1.classList.remove("hidden");
    } catch (error) {
        console.error(error);
    }
});

const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");
const validateBtn = document.querySelector(".btn-validate");

validateBtn.disabled = true;
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

// Active le bouton Valider uniquement si image, titre et catégorie sont renseignés
function checkFormValidity() {
    const imageOk = imageInput.files.length > 0;
    const titleOk = titleInput.value.trim() !== "";
    const categoryOk = categorySelect.value !== "";

    if (imageOk && titleOk && categoryOk) {
        validateBtn.disabled = false;
        validateBtn.style.backgroundColor = "#1D6154";

    } else {
        validateBtn.disabled = true;
        validateBtn.style.backgroundColor = "#A7A7A7";
    }
}

const uploadBtn = document.querySelector(".upload-btn");
const uploadInfo = document.querySelector(".upload-info");

// Réinitialise le formulaire d'ajout après fermeture, retour ou ajout réussi
function resetAddPhotoForm() {

    form.reset();
    imageInput.value = "";
    previewImage.src = "";
    previewImage.classList.add("hidden");
    uploadIcon.style.display = "block";
    uploadBtn.style.display = "block";
    uploadInfo.style.display = "block";
    validateBtn.disabled = true;
    validateBtn.style.backgroundColor = "#A7A7A7";
}

// Affiche la prévisualisation de l'image et masque le contenu initial de la zone upload
function handleImagePreview() {
    const file = imageInput.files[0];

    if (!file) return;

    previewImage.src = window.URL.createObjectURL(file);
    previewImage.classList.remove("hidden");
    uploadIcon.style.display = "none";
    uploadBtn.style.display = "none";
    uploadInfo.style.display = "none";

    checkFormValidity();
}

imageInput.addEventListener("change", handleImagePreview);