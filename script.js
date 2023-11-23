
// ***********************************************************
// API Read Access Token:
const accessToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1YWNjM2VhODRjNzEwOTIyN2NkMjkiLCJuYmYiOjE3MDA2MzExNDgsImF1ZCI6IjVlMDhiYTBlMzliOGEwODljNDEzYWFmZjAwNGFiZmJhIiwianRpIjoiNjcyNzg2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCIsImFwaV93cml0ZSJdLCJ2ZXJzaW9uIjoxfQ.Ng82SpKRUR_PNrew-YCZdJalz_DJ1sfEAaNbBJ7wd1w`
const favoriteApi = 'https://api.themoviedb.org/4/list/8280568';
// const UpdateDeleteItemApi = 'https://api.themoviedb.org/4/list/8280568/items';
const mockAPIWatchList = 'https://655d2efa9f1e1093c5991797.mockapi.io/Marwa/WatchList'
// ***********************************************************



// ********** Button and Container Initialization ***********
const showCoverContainer = document.getElementById("showcovercontainer");
const showInfo = document.getElementById("showinfo");
const showImage = document.getElementById("showimage");
const searchButton = document.getElementById("search-button");
// ***********************************************************



// ****************** GET (getting api results and search button event listener ) *****************************************
// https://developer.themoviedb.org/
const getOption = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
};

searchButton.addEventListener("click", async function () {

  const searchValue = document.getElementById("search").value; // this gets the search from the input field
  console.log(searchValue);

  const searchUrl = `https://api.themoviedb.org/3/search/tv?query=${searchValue}&include_adult=false&language=en-US&page=1`;
  
  try { 
    const apiResult = await fetch(searchUrl, getOption);

    const results = await apiResult.json();
    console.log(results);

    let listofresults = "";

    results.results.forEach(result => {
      const nameandtitle = JSON.stringify({id: result.id, name: result.name});

      listofresults += `<div class="show-info-container">

      <img class="img-thumbnail" src="https://image.tmdb.org/t/p/original/${result.backdrop_path}" />
      <p id="showinfo">
        ${result.name}
      </p>
      <button class=${result.id} onclick="savedItem(${result.id}, '${result.name}')" >Save For Later</button>
      </div>`;
    });

    showInfo.innerHTML = listofresults;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
// ***********************************************************



// ************* POST (saving items) ********************************
function savedItem (item){
  const postOption = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({item})
  };
  console.log(item)

  fetch(mockAPIWatchList, postOption)
    .then(response => response.json())
    .then(response => {getList()})
    .catch(err => console.error(err));
  }
  // *******************************************************



// *************** listing saved items *******************************
const itemId = document.getElementById("itemId");

async function getList(){
  let watchListItems = "";
  
  try { 

    console.log('getting the data');
    const itemList = await fetch(favoriteApi, getOption);
    console.log('data recieved');

    
    const favoriteResults = await itemList.json();
    console.log(favoriteResults);

    console.log('Whats happening in favoriteResults:', favoriteResults);

    if (favoriteResults.results && Array.isArray(favoriteResults.results)) {
      favoriteResults.results.forEach(eachResult => {
        watchListItems +=
          `<li> '${eachResult.name}'
          <button  onclick="deleteItem(${eachResult.id})"> Delete from List </button>
          </li>`;
      });

      itemId.innerHTML = watchListItems;
    } else {
      console.error("error. cant find.");
    }
  } catch (error) {
    console.error("error in getting the data", error);
  }
}

// ***********************************************************


// // ***** saved button e-listener ****
// const saveForLater = document.getElementById("saveforlater");
// saveForLater.addEventListener("click", async function () {
//   console.log(item.title);
// });
// // ***********************************************************




// ***************** DELETE (deleting items from saved list) *********************************

async function deleteItem(itemIdDelete) {
  console.log (itemIdDelete)

  const deleteOption = {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    // body: JSON.stringify({
    //   items: [
    //     {media_type: 'tv', media_id: itemIdDelete},
    //     {media_type: 'movie', media_id: itemIdDelete}
    //   ]
    // })
  };
  
  fetch(UpdateDeleteItemApi, deleteOption)
    .then(response => response.json())
    .then(response => {getList()})
    .catch(err => console.error(err));
  }
  // *******************************************************


  // *************** Updating the List ****************************************
  async function updatelist(){
  try {
    const response = await fetch(`${mockAPIWatchList}/${itemIdDelete}`, deleteOption);

    if (response.ok) {
      console.log("Item deleted successfully");
      getList(); // Refresh the list after deletion
    } else {
      console.error("Error deleting item");
    }
  } catch (err) {
    console.error("Error deleting item:", err);
  }
  }

// // ***********************************************************
