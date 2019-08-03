// --------- ON PAGE LOAD SETUP ------------------------------------------------------------------------------

// using movies  now playing API
var key = "45b3adecfb3718fbf0e1475997712c9f";
var request = `https://api.themoviedb.org/3/movie/now_playing?api_key=45b3adecfb3718fbf0e1475997712c9f&language=en-US&page=1`;
var keywordSearchRequest = "https://api.themoviedb.org/3/search/movie?api_key=45b3adecfb3718fbf0e1475997712c9f&language=en-US&include_adult=false&query=";
// config api used to get img src
var imgURL = `http://image.tmdb.org/t/p/w500`;
var storageMovies = [];
const MAX_RESULTS = 9;

var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", () => {
  if(xhr.readyState === 4){
    // response text is where the xhr holds the api response
    var response = JSON.parse(xhr.responseText);
    displayMovie(response);
  }
});

xhr.open("GET", request);
xhr.send();

// ------------ MOVIE SEARCH FUNCION ---------------------------------------------------------------------------
document.querySelector("#findMovieBtn").addEventListener("click", () => {
  var searchText = document.querySelector("#movieSearchInput").value.toLowerCase();
  var fullRequest = `${keywordSearchRequest}${searchText}`;

  var search = new XMLHttpRequest();
  search.addEventListener("readystatechange", () => {
    if(search.readyState === 4){
      var response = JSON.parse(search.responseText); 
      // add search results to local storage
      localStorage.setItem("searchResults", JSON.stringify(response.results));

      if(response.total_results > 0){
        // add 1st result of searched movies list to list of movies to store
        storageMovies.push(response.results[0]);
        // display movie as popup
        generatePopup(response.results[0].title, "SEARCH", storageMovies);
        window.location.href = "#popup";
      } else {
        // give up search and display error
        generatePopup("no-movie-found", "EMPTY", null);
        window.location.href = "#popup";
      }
    }
  });

  search.open("GET", fullRequest);
  search.send();
});

// ----------------------- NOW PLAYING DISPLAY MOVIES FUNCTION ---------------------------------------------------------------------

function displayMovie(res){
    //display first 6 movies
    // config API needed to get img URL
    // id is cardPic${i}
    for(var i = 0; i < MAX_RESULTS; i++){
      storageMovies.push(res.results[i]);
      var nowPlayingContainer= document.querySelector("#nowplaying-container");
      var movieTitle = res.results[i].title;
      var movieOverview = res.results[i].overview;
      var imgPath = `http://image.tmdb.org/t/p/w500${res.results[i].poster_path}`;

      // short overview if needed
      if(movieOverview.length > 100){
        movieOverview = movieOverview.substring(0, 100);
        movieOverview += "...";
      }

      nowPlayingContainer.innerHTML += 
    `
    <div class="card">
        <div class="card__side card__side--front" style="background-image:url('${imgPath}')">
            <div class="card__picture card__side--front--1" id="cardPic1">
            </div>
        </div>
        <div class="card__side card__side--back card__side--back--1">
            <div class="card__cta">
                <div class="card__price-box">
                    <div class="card__price-value" id="movieTitle1">${movieTitle}</div>
                    <div class="card__price-only" id="movieSum1">${movieOverview}</div>
                </div>
                <a href="#popup" class="btn btn--white btn--moreInfo" id="moreInfoBtn1">More Info</a>
            </div>
        </div>
    </div>
    `;

      // set up event listener for popup with more info
      document.querySelector("#nowplaying-container").addEventListener("click", (e) => {
        if(e.target.classList.contains("btn--moreInfo")){
          generatePopup(e.target.previousElementSibling.firstElementChild.innerHTML, "NOW-PLAYING", storageMovies);
        }
      });
    }
    console.log(storageMovies);
}

// ---------------- POPUP ----------------------------------------------------------------------------------------

// add close button reset event to return img back to default layout
document.querySelector("#popup-close").addEventListener("click", () => {
  var popupLeft = document.querySelector("#popup-left");
  popupLeft.innerHTML = `<img src="img/nomovie.jpeg" alt="movie photo" class="popup__img" id="popup-img">`;
  popupLeft.style.padding = "0";
  popupLeft.style.backgroundColor = "#fff";
});

function generatePopup(titleToSearch, popuptype, movieList){
  console.log(titleToSearch);
  var popupImg = document.querySelector("#popup-img");
  var popupTitle = document.querySelector("#popup-title");
  var popupRating = document.querySelector("#popup-rating");
  var popupOverview = document.querySelector("#popup-overview");
  var popupBtn = document.querySelector("#popupBtn");
  var popupActions = document.querySelector("#popup-actions");
  var popupRelease = document.querySelector("#popup-release");

  // set view if no movie found in search, dynamic view for now playing and searched movies
  if(titleToSearch === "no-movie-found"){
    popupImg.src = "../img/nomovie.jpeg";
    popupOverview.innerHTML = "No overview to display, sorry!";
    popupRating.innerHTML = "Voter Rating &ndash; Not Available";
    popupTitle.innerHTML = "NO MOVIE FOUND";
    popupBtn.classList.remove("btn--green");
    popupBtn.classList.add("btn--disable");
    popupBtn.innerHTML = "GO BACK";
    popupRelease.innerHTML = "No Release Date Available";
  } else {
    for(var i = 0; i < movieList.length; i++){
      if(movieList[i].title === titleToSearch){
        var movieTitle = movieList[i].title;
        var movieOverview = movieList[i].overview;
        var imgPath = `http://image.tmdb.org/t/p/w780${movieList[i].poster_path}`;
        var rating = movieList[i].vote_average;
        // date received in format: yyyy-mm-dd
        var releaseDate = new Date(movieList[i].release_date);
        // array in formatted form: month, day, year
        var formattedDate = formatDate(releaseDate);
  
        popupImg.src = imgPath;
        popupOverview.innerHTML = movieOverview;
        popupRating.innerHTML = `Voter Rating &ndash; ${rating}`;
        popupRelease.innerHTML = `Release Date &ndash; ${formattedDate[1]} ${formattedDate[0]}, ${formattedDate[2]}`;
        popupTitle.innerHTML = movieTitle;
      }
    }
  }

  // popup available actions depend on popup type
  if(popuptype === "SEARCH"){
    popupActions. innerHTML = 
    `
    <a href="#section-tours" class="btn btn--green" id="popupBtn">Book Now</a>
    <a href="#section-tours" class="btn btn--blue btn--trailer" id="popupBtn">Trailer</a>
    <a href='#section-tours' class='btn btn--blue btn--search-results' id='popupBtn'>See All Results</a>
    `;
  } else if( popuptype === "NOW-PLAYING"){
    popupActions. innerHTML = 
    `
    <a href="#section-tours" class="btn btn--green" id="popupBtn">Book Now</a>
    <a href="#section-tours" class="btn btn--blue btn--trailer" id="popupBtn">Trailer</a>
    `;
  } else {
    popupActions. innerHTML = 
    `
    <a href="#section-tours" class="btn btn--green btn--trailer" id="popupBtn">Go Back</a>
    `;
  }

  function formatDate(dateObj){
    var dateArray = [];
    if(dateObj.getDate() == 1 || dateObj.getDate() == 21){
      dateArray.push(`${dateObj.getDate()}st`);
    } else if(dateObj.getDate() == 2 || dateObj.getDate() == 22){
      dateArray.push(`${dateObj.getDate()}nd`);
    } else if(dateObj.getDate() == 3 || dateObj.getDate() == 23){
      dateArray.push(`${dateObj.getDate()}rd`);
    } else {
      dateArray.push(`${dateObj.getDate()}th`);
    }

    switch(dateObj.getMonth()){
      case 0:
        dateArray.push("January");
        break;
      case 1:
        dateArray.push("February");
        break;
      case 2:
        dateArray.push("March");
        break;
      case 3:
        dateArray.push("April");
        break;
      case 4:
        dateArray.push("May");
        break;
      case 5:
        dateArray.push("June");
        break;
      case 6:
        dateArray.push("July");
        break;
      case 7:
        dateArray.push("August");
        break;
      case 8:
        dateArray.push("September");
        break;
      case 9:
        dateArray.push("October");
        break;
      case 10:
        dateArray.push("November");
        break;
      case 11:
        dateArray.push("December");
        break;
    }

    dateArray.push(dateObj.getFullYear());
    return dateArray;
  }

  // add dynamic button event listeners for trailer button and seee all results button
  popupActions.addEventListener("click", (e) => {
    if(e.target.classList.contains("btn--trailer")){
      
      // find selected movie's ID using it's title
      var movieTitle = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
      for(var i = 0 ; i < movieList.length; i++){
        if(movieTitle === movieList[i].title){
          getTrailer(movieList[i].id);
        }
      }
    } else if(e.target.classList.contains("btn--search-results")){
      window.location.href = "search.html";
    }
  });
}

// ------------------ GET TRAILER FUNCTIONALITY --------------------------------------------------------------------------------------

function getTrailer(movieID){
  var response;
  var movieKey;
  var xhr = new XMLHttpRequest();
  var trailerMovieID = movieID;
  var trailerSearchRequest = `https://api.themoviedb.org/3/movie/${trailerMovieID}/videos?api_key=${key}&language=en-US`;

  xhr.addEventListener("readystatechange", () => {
      if(xhr.readyState === 4){
        response = JSON.parse(xhr.responseText).results;

        // loop through response array to find object with type: trailer, then get that objects "key" value
      for(var i = 0; i < response.length; i++){
        if(response[i].type === "Trailer"){
          movieKey = response[i].key;
        }
      }

      // populate popup with trailer
      var popupLeft = document.querySelector("#popup-left");
      popupLeft.style.padding = "1rem";
      popupLeft.style.backgroundColor = "black";
      popupLeft.innerHTML = `
      <iframe id="ytplayer" type="text/html" 
      src="https://www.youtube.com/embed/${movieKey}"
      frameborder="0" allow="picture-in-picture; gyroscope; accelerometer" allowfullscreen>
      `;
      setTimeout(() => {window.location.href = "#popup"}, 1000);

      }
  });

  xhr.open("GET", trailerSearchRequest);
  xhr.send();
}
