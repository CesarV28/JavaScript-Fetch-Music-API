import { API_HOST, API_KEY, API_URL } from '../../env.js'
 
import {data} from './data.example.js';


// ============= Let Vairiables
let favoriteSongs = [];
let songsResult = [];
let start = 0;
let limit = 3;

// ------- configuracion del fetch a la API
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': API_KEY,
		'X-RapidAPI-Host': API_HOST
	}
};


// ============= HTLM
const favoriteSongsContent = document.querySelector('#favoriteSongsContent');
const contentSongs = document.querySelector('#contentSongs');
const searchInput = document.querySelector('#search');
const emptyCard = document.querySelector('#emptyCard');
const loadMoreSongsBtn = document.querySelector('#loadMoreSongs');

// ============= Functions

// ------- Funcion de carga para los eventListeners
document.addEventListener("DOMContentLoaded", () => {

    const contentSongs = document.querySelector('#contentSongs');
    contentSongs.addEventListener('click', addSong);

    const favoriteSongsContent = document.querySelector('#favoriteSongsContent');
    favoriteSongsContent.addEventListener('click', removeSong);

    loadMoreSongsBtn.addEventListener('click', loadMoreSongs);

    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getSongs()
        }
    });
});


// ------- funcion que llama a la API
const fetchData = async( urlApi, query = 'eminem') => {
    try {
        const response = await fetch(`${urlApi}${query}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return false
    }
}

// ------- Trae los datos y los pinta en el HTML
const getSongs = async() => {

    try {
        const query = searchInput.value;

        contentSongs.innerHTML = loaderHTML();
        const songsData = await fetchData(API_URL, query);
    
        if(songsData.length <= 0) return 
        // const songsResult = data;
        songsResult = [ ...songsData.result.songs ]

        viewHTLM();
    } catch (error) {
        console.log('No songs loaded')
    }
}

// ------- Regresa el HTML de las Card
function viewHTLM(){
    const view =
    
    //`${songsResult.result.songs.map( song => `
    `${songsResult.map( song => `
                <div id="songCard" class="songCard relative w-[15rem] h-[17rem] my-2 rounded-xl text-white bg-gray-800">
                    <div id="cardContentBtn" class="relative">
                        <a href="https://www.youtube.com/watch?v=${song.id}" target="_blank">
                            <img
                                src="${song.thumbnail}"
                                alt=""
                                class="rounded-tl-xl rounded-tr-xl object-cover w-full h-40"
                            >
                        </a>
                        <button data-id="${song.id}" class="absolute z-10 bottom-3 rounded-bl-md rounded-tl-md right-0 w-[2rem] h-[2rem] bg-gradient-to-tr from-cyan-500 to-blue-500">+</button>
                    </div>
                    <h3 class="font-bold mt-1 text-center text-xl">${song.title}</h3>
                    <p class="text-gray-200 text-center">${song.name}</p>
                    <span class="absolute right-0 bottom-2 block text-end text-xs pr-3">${song.duration}-seconds</span>
                </div>
        `).slice(start, limit).join('')}
    `;

    contentSongs.innerHTML = view;
    contentSongs.appendChild(emptyCard);
}

// ------- Spinner de carga
function loaderHTML(){
    return `
        <div  class="w-full h-80 col-span-3 flex justify-center items-center">
            <div class="lds-ring "><div></div><div></div><div></div><div></div></div>
        </div>
    `
}

// ------- Incrementa el limite de caciones a mostrar
function loadMoreSongs() {
    limit = limit + 3;
    viewHTLM()
}

// ------- Añade una nueva cación a favoritos
function addSong(e){

    if( e.target.tagName !== 'BUTTON') return;
    const selectSong = e.target.parentElement.parentElement
    const songData = readCardContent(selectSong);
    // Validar que tenga información
    if( !songData ) return;

    if( existOnFavorites(songData) ) return alert(`La cacion ${songData.title}, ya se encutra en favoritas.`);
    favoriteSongs = [ ...favoriteSongs, songData ];
    favoriteSongsHTML();
}

// ------- Remueve una cación de favoritos
function removeSong(e){

    if( e.target.tagName !== 'BUTTON') return;

    const selectSong = e.target.parentElement.parentElement
    const songData = readCardContent(selectSong);

    favoriteSongs = favoriteSongs.filter(song => song.id !== songData.id );
    favoriteSongsHTML();
}

// ------- Lee la informacón de las card y crea un objeto con la informacón
function readCardContent( song ) {
    
    if(song.children[0].id === 'emptyCard') return false;
    // if( ) return false;

    const songInfo = {
        id: song.querySelector('button').getAttribute('data-id'),
        name: song.querySelector('p').textContent,
        title: song.querySelector('h3').textContent,
        thumbnail: song.querySelector('img').src,
        duration: song.querySelector('span').textContent,
    }

    return songInfo;
}

// ------- HTML de las caciones en favoritos
function favoriteSongsHTML() {

            const view =
            `${favoriteSongs.map( song => `

                    <div id="card" class="favoriteSongCard relative w-[15rem] h-[17rem] my-2 rounded-xl text-white bg-gradient-to-bl from-cyan-500 to-blue-500">
                        <div class="relative">
                            <a href="https://www.youtube.com/watch?v=${song.id}" target="_blank">
                                <img
                                    src="${song.thumbnail}"
                                    alt=""
                                    class="rounded-tl-xl rounded-tr-xl object-cover w-full h-40"
                                >
                            </a>
                            <button data-id="${song.id}" class="absolute z-10 bottom-4 rounded-bl-md rounded-tl-md right-0 w-[2rem] h-[2rem] bg-gradient-to-tr from-pink-500 to-yellow-500">-</button>
                        </div>
                        <h3 class="font-bold mt-1 text-center text-xl">${song.title}</h3>
                        <p class="text-gray-200 text-center">${song.name}</p>
                        <span class="absolute right-0 bottom-2 block text-end text-xs pr-3">${song.duration}-seconds</span>
                    </div>

                `).slice().join('')}
            `;

        favoriteSongsContent.innerHTML = view;
}


// ------- Revisa si una cación ya esta en favoritos
function existOnFavorites(song) {

    let exist;
    favoriteSongs.forEach(favSong => {
        if( song.id === favSong.id ){
            exist = true
        }
    });

    return exist

}


