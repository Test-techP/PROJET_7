const URL =  "http://localhost:5678/api/";
const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");
let workList = [];

function FetchProject () {
    fetch (URL+"works") 
    .then (reponse=>reponse.json())
    .then (works => {
        workList = works;
        works.forEach(work => {
        CreateProjects(work);
        CreateModalItem(work);
    });
    createFilters(works);})
    .catch(error => {
        console.error("Erreur API :", error);
    });
}

function CreateProjects (work){
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.innerHTML = work.title;

    gallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
}

function getCategories(works) {
    const categories = [];
    works.forEach(work => {
        if (!categories.includes(work.category.name)) {
            categories.push(work.category.name);
        }
    });

    return categories;
}

function addFilterEvents() {
    const buttons = document.querySelectorAll(".filters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            filterWorks(button.dataset.filter);
        });
    });
}

function filterWorks(category) {
    gallery.innerHTML = "";

    let filteredWorks = workList;

    if (category !== "all") {
        filteredWorks = workList.filter(work =>
            work.category.name === category
        );
    }

    filteredWorks.forEach(work => {
        CreateProjects(work);
    });
}


function createFilters(works) {
    const filtersContainer = document.querySelector(".filters");

    filtersContainer.innerHTML = "";

    // bouton "Tous"
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

FetchProject ();

//page loggée ou non

function isLoggedIn(){
    return !!localStorage.getItem("token");
}

function updateUI() {

    const filters = document.querySelector(".filters");
    const editMode = document.querySelector(".edit-mode");
    const editButton = document.querySelector(".edit-button");
    const loginLink = document.querySelector("#login-link");

    if (isLoggedIn()) {

        filters.style.display = "none";

        editMode.classList.remove("hidden");

        editButton.classList.remove("hidden");

        loginLink.textContent = "logout";

        loginLink.href = "#";

        loginLink.addEventListener("click", (event) => {

            event.preventDefault();

            logout();

        });

    } else {

        filters.style.display = "block";

        editMode.classList.add("hidden");

        editButton.classList.add("hidden");

        loginLink.textContent = "login";

        loginLink.href = "Login_Index.html";
    }
}

function logout(){

    localStorage.removeItem("token");

    updateUI();

    window.location.reload();
}

updateUI();

//modales

const modal = document.querySelector(".modal");
const btnEdit = document.querySelector(".edit-button");
const btnClose = document.querySelector(".close");

btnEdit.addEventListener("click", () => {

   modal.classList.add("active");

   view1.classList.remove("hidden");
   view2.classList.add("hidden");

});

btnClose.addEventListener("click", () => {

    modal.classList.remove("active");

    view1.classList.remove("hidden");
    view2.classList.add("hidden");

});
modal.addEventListener("click", (e) => {

   if(e.target === modal){

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

    view2.classList.add("hidden");

    view1.classList.remove("hidden");

});
function CreateModalItem(work){

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
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if(response.ok){

                item.remove();

                workList = workList.filter(
                    currentWork => currentWork.id !== work.id
                );

                gallery.innerHTML = "";

                workList.forEach(work => {
                    CreateProjects(work);
                });

            } else {
                console.error("Suppression impossible");
            }

        } catch(error){
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

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(!file) return;

   previewImage.src =
window.URL.createObjectURL(file);

    previewImage.classList.remove("hidden");

    uploadIcon.style.display = "none";

});

async function FetchCategories(){

    try{

        const response = await fetch(URL + "categories");

        const categories = await response.json();

        FillCategories(categories);

    }

    catch(error){

        console.error(error);

    }

}
function FillCategories(categories){

    const select = document.querySelector("select");

    select.innerHTML = "";

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category.id;

        option.textContent = category.name;

        select.appendChild(option);

    });

}
FetchCategories();
const form = document.querySelector(".modal-form");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title =
        document.querySelector(".modal-form input").value;

    const category =
        document.querySelector(".modal-form select").value;

    const image =
        imageInput.files[0];

    const formData = new FormData();

    formData.append("title", title);

    formData.append("category", category);

    formData.append("image", image);

    try{

        const response = await fetch(URL + "works", {

            method: "POST",

            headers: {

                Authorization:
                `Bearer ${localStorage.getItem("token")}`

            },

            body: formData

        });

        const newWork = await response.json();

        if(response.ok){

            CreateProjects(newWork);

            CreateModalItem(newWork);

            workList.push(newWork);

            form.reset();

            previewImage.classList.add("hidden");

            modal.classList.remove("active");

            view2.classList.add("hidden");

            view1.classList.remove("hidden");

        }

    }

    catch(error){

        console.error(error);

    }

});
btnAdd.addEventListener("click", () => {

    console.log("clic add");

    view1.classList.add("hidden");
    view2.classList.remove("hidden");

});

btnAdd.addEventListener("click", () => {

    view1.classList.add("hidden");
    view2.classList.remove("hidden");

    console.log(
        "height =", view2.offsetHeight,
        "width =", view2.offsetWidth
    );

});
console.log(view2.offsetHeight);

const validateBtn = document.querySelector(".btn-validate");

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(!file) return;

    previewImage.src = window.URL.createObjectURL(file);

    previewImage.classList.remove("hidden");

    uploadIcon.style.display = "none";

    validateBtn.style.backgroundColor = "#1D6154";
});