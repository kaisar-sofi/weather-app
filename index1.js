const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let ap="9152ea7a909c9b088adb7cdde6f33341"
let currentTab = userTab;
currentTab.classList.add("current-tab");
getSessionstorage();

//switching the tabs;
function switchTab(newtab){
    if(newtab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = newtab;
        currentTab.classList.add("current-tab")
    

    if(!searchForm.classList.contains("active")) {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getSessionstorage();
    }

  }
}
userTab.addEventListener("click",()=>
{
  switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})


//fetching Weather 
let input= document.querySelector("[data-searchInput]")
let error = document.querySelector(".error")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let city = input.value;
    if (city ==""){
        return;
    }
    else{
    fetcWeatherInfo(city);
    }
})

async function fetcWeatherInfo(city){

    loadingScreen.classList.add("active");
    
    try{
      let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ap}`);
      if(!weather.ok)
      {
        throw(new error);
      }  
      let result= await weather.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(result);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        
        error.classList.add("active");
        setTimeout(()=>
        {
            error.classList.remove("active")
        },3000)
}
}

//renderweather-ON-UI

function renderWeatherInfo(response)
{
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //putting the fetched values in html elements
    cityName.innerText = response?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${response?.sys?.country.toLowerCase()}.png`;
    desc.innerText = response?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${response?.weather?.[0]?.icon}.png`;
    temp.innerText = `${response?.main?.temp} °C`;
    windspeed.innerText = `${response?.wind?.speed} m/s`;
    humidity.innerText = `${response?.main?.humidity}%`;
    cloudiness.innerText = `${response?.clouds?.all}%`;

}

function getSessionstorage(){
    let localcoordinates = sessionStorage.getItem("user");
    if (!localcoordinates)
     {
        grantAccessContainer.classList.add("active");
       
    }
     else{
        let coordinates = JSON.parse(localcoordinates)
        fetchUserWeatherInfo(coordinates);
     }
}

//fetching user-weather
const grantAccessButton = document.querySelector("[data-grantAccess]");
//event-listener 0n generate-access-button
grantAccessButton.addEventListener("click", getLocation);

function getLocation()
{
    grantAccessContainer.classList.remove("active");
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("no support")
    }
}
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

//async fucntion for user-weather
async function fetchUserWeatherInfo(coordinates)
{ 
    const {lat,lon} = coordinates;
    loadingScreen.classList.add("active");
    try{
        let UserApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ap}&units=metric`)
        let response = await UserApi.json();
        console.log(response);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(response);
    }
    catch(e)
    {
        userInfoContainer.classList.remove("active");
    }
   
}
