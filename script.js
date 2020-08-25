// Initialize firebase database
const firebaseConfig = {
    apiKey: "AIzaSyB7w2FgtcseahS0-Uv-6ZnDA2aKgHT0-e8",
    authDomain: "library-310ca.firebaseapp.com",
    databaseURL: "https://library-310ca.firebaseio.com",
    projectId: "library-310ca",
    storageBucket: "library-310ca.appspot.com",
    messagingSenderId: "295595918208",
    appId: "1:295595918208:web:b6285c7163f11920b17765"
};
firebase.initializeApp(firebaseConfig);
  
//firebase variables
let database = firebase.database();
let libraryDatabase = database.ref('library');

//dom variables
const libraryContainer = document.querySelector("#library");
const submitBtn = document.querySelector(".submitBtn");

//class to hold movie descirption
class Movie{
    constructor(title,director,rating,watched){
        this.title = title;
        this.director = director;
        this.rating = rating;
        this.watched = watched;
    }
}

//function to add books to library database
function addMovie(){
    let title = document.forms["new-form"]["movie-title"].value;
    let director = document.forms["new-form"]["movie-director"].value;
    let rating = document.forms["new-form"]["movie-rating"].value;
    let watched = document.forms["new-form"]["movie-watched"].checked;

    watched = (watched) ? "&#10003; watched" : "&#10003; not watched";
    libraryDatabase.push().set(new Movie(title,director,rating,watched)); // push this movie to database
    
    $("#new-form").trigger("reset"); // clear form inputs
}


//updates library and adds new movie to the page
function renderLibrary(){
    libraryDatabase.on('value',function(snap){
       // create a container for the next movie
        libraryContainer.innerHTML = "";   

        //loop through database to create individual movie blocks in website grid
        snap.forEach(function(userSnap){ 
            let movie = userSnap.val();
            let movieDiv = document.createElement('div');
            movieDiv.setAttribute('id', `movie${userSnap.val().title}`);
            movieDiv.setAttribute('class', 'grid-item card');
            movieDiv.setAttribute('data-key',userSnap.key)

            movieDiv.innerHTML = (`<div class="card-body">
            <h4 class="card-title">${movie.title}</h4>
            <h5 class="card-title">${movie.director}</h5>
            <h6 class="card-title">${movie.rating}</h6>
            <h6 class="card-title">${movie.watched}</h6>
            <button class="deleteMovie">X</button>
            </div>
            `);  
     
            libraryContainer.appendChild(movieDiv);

            //function to delete created div
            const deleteBtn = document.querySelectorAll(".deleteMovie");
            deleteBtn.forEach(deleteIcon => {
                deleteIcon.addEventListener('click',e=>{
                    let key = e.target.parentNode.parentNode.getAttribute("data-key");
                    libraryContainer.removeChild(e.target.parentNode.parentNode);
                    libraryDatabase.child(key).remove();
                });
            });
        });
    });
}

submitBtn.addEventListener('click',addMovie);
renderLibrary();

