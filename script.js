const mainContent = document.getElementById("mainContent");
const navAll = document.getElementById("navAll");
const searchShows = document.getElementById("searchSh");
const showSelect = document.getElementById("selShow");
const epiSelect = document.getElementById("selEpisode");
const input = document.getElementById("searchEp");
const counter = document.getElementById("counter");
let showDrop;
let episodeDrop = [];

function makePageForShows(showList) {
  mainContent.innerHTML = "";
  counter.innerHTML = "";
  showList.forEach((episode) => {
    mainContent.innerHTML += `<div onclick="fetchEpisodes(${
      episode.id
    })" id="episodesDiv"> <div id="titleBox"> 
    <h2>${episode.name} </h2> </div> <img id="img" src="${
      episode.image != null ? episode.image.medium : ""
    }"/> 
    ${episode.summary}<div id="infoBox">
      <p>
      <strong>Genre:&nbsp;</strong>${episode.genres}
      </p>
      <p>
      <strong>Status:&nbsp;</strong>${episode.status}
      </p>
      <strong>Rating:&nbsp;</strong>${episode.rating.average}
      </p>
      <p>
      <strong>Runtime:&nbsp;</strong>${episode.runtime + " Mins"}
      </p>`;
  });
}

function populateShowsDropDown() {
  const allShows = getAllShows();
  allShows.sort(function (a, b) {
    return string(a.name, b.name);
  });

  makePageForShows(allShows);
  allShows.forEach((show) => {
    showDrop = document.createElement("option");
    showDrop.value = show.id;
    showDrop.innerHTML = show.name;
    showSelect.appendChild(showDrop);
  });

  showSelect.addEventListener("change", (element) => {
    if (element.target.value === "default") {
      makePageForShows(allShows);
      input.style.display = "none";
      epiSelect.style.display = "none";
      searchShows.style.display = "inline";
    } else {
      fetchEpisodes(element.target.value);
      epiSelect.style.display = "inline";
      searchShows.style.display = "none";
    }
  });
}

function setup() {
  populateShowsDropDown();
  epiSelect.style.display = "none";
  input.style.display = "none";
  input.addEventListener("input", search);
  searchShows.addEventListener("input", showSearch);
}

function fetchEpisodes(showID) {
  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      episodeDrop = data;
      episodeList(episodeDrop);
      makePageForEpisodes(episodeDrop);
    })
    .catch((error) => console.log(error));
}

function episodeList(episodes) {
  epiSelect.innerHTML = "";
  episodes.forEach((episode) => {
    let episodeOption = document.createElement("option");
    episodeOption.value = episode.id;
    episodeOption.innerHTML = `S${twoDigits(episode.season)}
      ${twoDigits(episode.number)} - 
      ${episode.name}`;

    epiSelect.appendChild(episodeOption);
  });

  epiSelect.addEventListener("change", (element) => {
    let selectedEpisode = episodeDrop.filter((episode) => {
      return episode.id === parseInt(element.target.value);
    });
    makePageForEpisodes(selectedEpisode);
  });
}

function makePageForEpisodes(episodeList) {
  mainContent.innerHTML = "";
  counter.innerHTML = `Displaying ${episodeList.length} of ${episodeDrop.length}`;
  episodeList.forEach((episode) => {
    mainContent.innerHTML += `<div id="episodesDiv"> 
    
    <div id="titleBox"> 
    
      <h2>${episode.name}</h2>
        </p>
        <strong>Season: &nbsp;</strong>${twoDigits(episode.season)}
        </p>

        </p>
        <strong>Episode: &nbsp;</strong>${twoDigits(episode.number)}
        </p>
      
    </div> 

    <img id="img" src="${episode.image != null ? episode.image.medium : ""}"/> 
    ${episode.summary}<div id="infoBox"> 
    <p>
    <strong>Runtime: </strong>${episode.runtime + " Mins"}
      </p>
    </div></div>`;
  });
  input.style.display = "inline";
}

function twoDigits(num) {
  return num.toString().padStart(2, 0);
}

navAll.addEventListener("click", function () {
  showSelect.selectedIndex = 0;
  input.style.display = "none";
  epiSelect.style.display = "none";
  searchShows.style.display = "inline";
  const allShows = getAllShows();
  allShows.sort(function (a, b) {
    return string(a.name, b.name);
  });

  makePageForShows(allShows);
});

function string(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
}

function search(element) {
  let searchString = element.target.value.toLowerCase();
  let filteredEpisodes = episodeDrop.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(searchString) ||
      (episode.summary && episode.summary.toLowerCase().includes(searchString))
    );
  });
  mainContent.innerHTML = "";
  makePageForEpisodes(filteredEpisodes);
}

function showSearch(element) {
  const allShows = getAllShows();
  let searchString = element.target.value.toLowerCase();
  let filteredShows = allShows.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(searchString) ||
      episode.genres.join(" ").toLowerCase().includes(searchString) ||
      (episode.summary && episode.summary.toLowerCase().includes(searchString))
    );
  });
  mainContent.innerHTML = "";
  makePageForShows(filteredShows);
}

window.onload = setup;
