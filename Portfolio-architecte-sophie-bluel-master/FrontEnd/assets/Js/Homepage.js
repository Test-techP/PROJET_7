const URL =  "http://localhost:5678/api/";
const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");

function FetchProject () {
    fetch (URL+"works") 
    .then (reponse=>reponse.json())
    .then (works=>{
        workList = works;
        for (let i = 0; i<works.length;i++){
            CreateProjects(works[i]);
        }
        createFilters(works);
    } )
    
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

let isLoggedIn = true;

function updateUI() {
    const filters = document.querySelector(".filters");
    const editMode = document.querySelector(".edit-mode");
    const editButton = document.querySelector(".edit-button");

    if (isLoggedIn) {
        filters.style.display = "none";
        editMode.classList.remove("hidden");
        editButton.classList.remove("hidden");
    } else {
        filters.style.display = "block";
        editMode.classList.add("hidden");
        editButton.classList.add("hidden");
    }
}

updateUI();

//modales

const modal = document.querySelector(".modal");
const btnEdit = document.querySelector(".edit-button");
const btnClose = document.querySelector(".close");

btnEdit.addEventListener("click", () => {
  modal.classList.add("active");
});

btnClose.addEventListener("click", () => {
  modal.classList.remove("active");
});

const view1 = document.querySelector(".content-gallery");
const view2 = document.querySelector(".content-add-photo");
const btnAdd = document.querySelector(".btn-open-add");

btnAdd.addEventListener("click", () => {
  view1.classList.add("hidden");
  view2.classList.remove("hidden");
});

function CreateModalItem(work) {
    const div = document.createElement("div");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const title = document.createElement("p");
    title.textContent = work.title;

    div.appendChild(img);
    div.appendChild(title);

    modalGallery.appendChild(div);
}
