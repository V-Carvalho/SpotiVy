let startX;
let scrollLeft;
let isDown = false;

const URL_API = "https://44.196.121.92:3000"

async function main() {
  await getTrendingMusics(URL_API);
  await getMusicNews(URL_API);
  await loadFavorites();
}

/*List com as musicas em altas no DIA*/
async function getTrendingMusics(url_trending) {
  // Carregando o arquivo com os dados dos animais
  let data = await fetch(`${url_trending}/trendingMusic`)
  .then((response) => {
    if (response.status == 200) {  
      return response;
    } 
  })
  .catch((error) => {
    console.log("Houve algum problema!" + error);
  });

  let trendingMusic = await data.json();

  for (let i = 0; i < trendingMusic.tracks.data.length; i++) {
    let listContent = document.createElement("li");

    listContent.innerHTML = `<li class="card-trending-musics" ondblclick="playMusic(
        \'${trendingMusic.tracks.data[i].preview}\'
      )">
      <img
        src=${trendingMusic.tracks.data[i].artist.picture_medium}
        class="cover-music"
      />
      <div class="details-music">
        <div class="titles">
          <p class="title-music"><b>${trendingMusic.tracks.data[i].title}</b></p>
          <p class="title-artist-name">${trendingMusic.tracks.data[i].artist.name}</p>
        </div>
        <div class="icon-favorite">
          <i id=${trendingMusic.tracks.data[i].id} 
          onclick="AddFavorites(
            \'${trendingMusic.tracks.data[i].id}\',
            \'${trendingMusic.tracks.data[i].artist.name}\',
            \'${trendingMusic.tracks.data[i].title}\',
            \'${trendingMusic.tracks.data[i].artist.picture_medium}\',
            \'${trendingMusic.tracks.data[i].preview}\',
            )" 
          class="material-icons" 
          style="font-size:25px; color: rgba(0, 0, 0, 0.3);"
          >favorite</i>
        </div>           
      </div>
    </li>`;

    document.getElementById("listTrendingMusics").appendChild(listContent);
  }
}

/* Add/Remove aos Favoritos*/
let totalFavorites = 0;

async function AddFavorites(musicID, artistName, musicTitle, urlPicture, urlPreview) {
  let isFavorite = window.localStorage.getItem(`musicID-${musicID}`);

  // Se o musicID não tiver favoritos
  if (isFavorite == null) {
    document.getElementById(musicID).style.color = "#1ED760";
    window.localStorage.setItem(
      `musicID-${musicID}`,
      JSON.stringify({
        musicID: musicID,
        artistName: artistName,
        musicTitle: musicTitle,
        urlPicture: urlPicture,
        urlPreview: urlPreview
      })
    );
    // Se o DB não tiver favoritos incrementa 1
    if (isFavorite == null) {
      totalFavorites += 1;
      window.localStorage.setItem("Total", totalFavorites);      
    } else {
      // Se o DB tiver favoritos, pega o total e incrementa +1
      totalFavorites = parseInt(window.localStorage.getItem("Total")) + 1;
      window.localStorage.setItem("Total", totalFavorites);      
    }    
  } else {
    // Se o musicID tiver nos favoritos, remove o item conforme o musicID
    document.getElementById(musicID).style.color = "rgba(0, 0, 0, 0.3)";
    window.localStorage.removeItem(`musicID-${musicID}`);

    // Decrementando o total de musicas salvas nos favoritos
    totalFavorites = parseInt(window.localStorage.getItem("Total")) - 1;
    window.localStorage.setItem("Total", totalFavorites);
  }
  loadFavorites();
}

async function loadFavorites() {
  let keys = Object.keys(window.localStorage);

  document.getElementById("listSubscriptions").innerHTML = "";

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] != "Total") {
      let favorite = JSON.parse(window.localStorage.getItem(keys[i]));
      document.getElementById(favorite.musicID).style.color = "#1ED760";

      let listContent = document.createElement("li");

      listContent.innerHTML = `<li class="item-list-subscriptions" ondblclick="playMusic(\'${favorite.urlPreview}\')">
        <img
          src=${favorite.urlPicture}
          class="avatar-subscriptions"
          alt="Avatar"
        />
        <div class="titles-subscriptions">
          <p class="title-music-subscriptions">
            <b>${favorite.musicTitle}</b>
          </p>
          <p class="title-artist-name-subscriptions">
            ${favorite.artistName}
          </p>
        </div>
        <div class="icon-favorite-subscriptions">
          <i            
            onclick="AddFavorites(\'${favorite.musicID}\')"
            class="material-icons"
            style="font-size: 25px; color: #FF0000"
            >delete</i
          >
        </div>
      </li>`;

      document.getElementById("listSubscriptions").appendChild(listContent);
    }
  }
}

/* Play music*/
let musicPlaying = false;
let player = document.getElementById("player");
let containerPlayer = document.getElementById("containerPlayer");

function playMusic(url_preview) {
  if (musicPlaying == true) {
    player.setAttribute("src", url_preview);
  }

  player.setAttribute("src", url_preview);
  containerPlayer.style.display = "flex";
  musicPlaying = true;
}

player.onended = function () {
  musicPlaying = false;
  containerPlayer.style.display = "none";
};

/*Scroll na lista com o mouse*/
const sliderListTrendingMusics = document.getElementById("listTrendingMusics");

sliderListTrendingMusics.addEventListener("mousedown", (event) => {
  isDown = true;
  startX = event.pageX - sliderListTrendingMusics.offsetLeft;
  scrollLeft = sliderListTrendingMusics.scrollLeft;
});
sliderListTrendingMusics.addEventListener("mouseleave", () => {
  isDown = false;
});
sliderListTrendingMusics.addEventListener("mouseup", () => {
  isDown = false;
});
sliderListTrendingMusics.addEventListener("mousemove", (event) => {
  if (!isDown) return;
  event.preventDefault();
  const x = event.pageX - sliderListTrendingMusics.offsetLeft;
  const walk = (x - startX) * 0.9; //scroll-fast
  sliderListTrendingMusics.scrollLeft = scrollLeft - walk;
  // console.log(walk);
});

/*Scroll na lista com os botões*/
document.getElementById("btnSlideLeft").addEventListener("click", () => {
  document.getElementById("listTrendingMusics").scrollLeft -= 400;
});
document.getElementById("btnSlideRight").addEventListener("click", () => {
  document.getElementById("listTrendingMusics").scrollLeft += 400;
});

/*List com as Notícias */
async function getMusicNews(url_news) {
  // Carregando o arquivo com os dados dos animais
  let data = await fetch(`${url_news}/news`)
    .then((response) => {
      if (response.status == 200) {
        return response;
      } 
    })
    .catch((error) => {
      console.log("Houve algum problema!" + error);
    });

  let musicNews = await data.json();

  for (let i = 0; i < musicNews.news.length; i++) {
    let listContent = document.createElement("li");

    listContent.innerHTML = `<li class="card-music-news">
      <img
        src=${"https://www.vagalume.com.br" + musicNews.news[i].images[2]}
        class="cover-music-news"
      />
      <div class="details-music-news">
        <p><b>${musicNews.news[i].headline}</b></p>
        <p>${musicNews.news[i].kicker}</p>       
      </div>
    </li>`;

    document.getElementById("listMusicNews").appendChild(listContent);
  }
}
