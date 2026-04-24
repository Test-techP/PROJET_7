const URL =  "http://localhost:5678/api/";

const gallery = document.querySelector(".gallery");


function FetchProject () {
    fetch (URL+"works") 
    .then (reponse=>reponse.json())
    .then (works=>{
        workList = works;
        for (let i = 0; i<works.length;i++){
            CreateProjects(works[i]);
        }
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

//utiliser fetchprojets pour afficher la gallerie d'images dans la popup 

//CreateProjects ();

FetchProject ();
