// API key = fsq3yHEWKLOWihoEIGS+e8xVD6Q74U8mYNHEhIKkVQ82nYE=
const myMap = {
    coordinates : [],
    businesses : [],
    map : {},
    buildMap() {
        this.map = L.map('map', {
                center: this.coordinates ,
                zoom: 12 ,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
               attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
               minZoom: '15',}).addTo(this.map);
        const marker = L.marker(this.coordinates)
        marker.addTo(this.map).bindPopup('<p1>You are here</p1>').openPopup()
        
    },
  
}


async function getCoords() {
    const position = await new Promise((resolve, reject)=> {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })  
    // console.log(position)
    return [position.coords.latitude, position.coords.longitude]

};


window.onload = async() => {
    const coords = await getCoords()
    console.log(coords)
    myMap.coordinates = coords
    myMap.buildMap()
};



// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		    Accept: 'application/json',
            Authorization: 'fsq3yHEWKLOWihoEIGS+e8xVD6Q74U8mYNHEhIKkVQ82nYE='
		    // Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
// // process foursquare array
// function processBusinesses(data) {
// 	let businesses = data.map((element) => {
// 		let location = {
// 			name: element.name,
// 			lat: element.geocodes.main.latitude,
// 			long: element.geocodes.main.longitude
// 		};
// 		return location
// 	})
// 	return businesses
//}


// event handlers
// window load
// window.onload = async () => {
// 	const coords = await getCoords()
// 	myMap.coordinates = coords
// 	myMap.buildMap()
// }

// business select button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})
