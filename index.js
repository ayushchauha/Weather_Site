const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorimage=document.querySelector(".errorimage");
// initially vairables need???
getFromSessionStorage();
let currentTab=userTab;
const API_KEY="cbf5df9d86f2f6411862958014c9ab04";
currentTab.classList.add("current-tab");
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        //jissa dekhna hai uski class ko active baki ki disable
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorimage.classList.remove("active");
            searchForm.classList.add("active")
        }
        else{
            //switch from search tab to your tab
            searchForm.classList.remove("active");
            errorimage.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //i am curently on your weather tab so i need to display its information so let check local storage
            // for coordinates,if we haved saved them there
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab aa a parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //pass clicked tab aa a parameter
    switchTab(searchTab);
});
//check if coordinates present in the session storage or not
function getFromSessionStorage(){
   const localCoordinates=sessionStorage.getItem("user-coordinates");
   if(!localCoordinates){
    //agar local coordinates nhi hai
    grantAccessContainer.classList.add("active");
   }
   else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
   }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // Make grantAccessContainer invisible
    grantAccessContainer.classList.remove("active");
    // Make loader visible
    loadingScreen.classList.add("active");
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        // Handle error here if needed
        loadingScreen.classList.remove("active");
        // const errorImage = document.createElement("img");
        // errorImage.src = "not-found.png"; // Replace with the path to your error image
        // errorImage.alt = "Error fetching weather data";
        // userInfoContainer.appendChild(errorImage);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it in UI
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show alert if no geo location avilable
    }
}
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


const searchInput=document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorimage.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            loadingScreen.classList.remove("active");
            errorimage.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            // Handle non-OK response (e.g., show an alert)
            loadingScreen.classList.remove("active");
            
            errorimage.classList.add("active");
        }
    } catch (err) {
        // Handle error (e.g., show an alert)
    }
    
}