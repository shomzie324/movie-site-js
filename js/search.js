// get the grid container, then add as many cards as needed
var resultsContainer = document.querySelector("#results-container");
var searchResults = JSON.parse(localStorage.getItem("searchResults"));

// add close button reset event to return img back to default layout
document.querySelector("#popup-close").addEventListener("click", () => {
    var popupLeft = document.querySelector("#popup-left");
    popupLeft.innerHTML = `<img src="img/nomovie.jpeg" alt="movie photo" class="popup__img" id="popup-img">`;
    popupLeft.style.padding = "0";
    popupLeft.style.backgroundColor = "#fff";
  });

for(var i = 0; i < searchResults.length; i++){
    var smallSum = searchResults[i].overview.substring(0, 100);
    var title = searchResults[i].title;
    var imgPath = `http://image.tmdb.org/t/p/w500${searchResults[i].poster_path}`;
    resultsContainer.innerHTML += 
    `
    <div class="card">
        <div class="card__side card__side--front" style="background-image:url('${imgPath}')">
            <div class="card__picture card__side--front--1" id="cardPic1">
            </div>
        </div>
        <div class="card__side card__side--back card__side--back--1">
            <div class="card__cta">
                <div class="card__price-box">
                    <div class="card__price-value" id="movieTitle1">${title}</div>
                    <div class="card__price-only" id="movieSum1">${smallSum}</div>
                </div>
                <a href="#popup" class="btn btn--white btn--moreInfo" id="moreInfoBtn1">More Info</a>
            </div>
        </div>
    </div>
    `;
}

document.querySelector("#results-container").addEventListener("click", (e) => {
    if(e.target.classList.contains("btn--moreInfo")){
      generatePopup(e.target.previousElementSibling.firstElementChild.innerHTML, "NOW-PLAYING", searchResults);
    }
  });

document.querySelector("#backBtn").addEventListener("click", () => {
    window.location.href = "/index.html";
});