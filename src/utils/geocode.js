const request = require('request')

const geocode = (address, callback) => {
    if (!address) return callback('No address provided', undefined)
    
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoic3ZpbHVwcG93ZWJicCIsImEiOiJja3kxOXdiMjkwOWxrMnVsbDg0aDJ5NW9oIn0.4a16qj82Zy5FOsoV9xBXNw&limit=1`

    request({ url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to geo server', undefined)
        } else if (!body.features.length) {
            callback('No location found, try another search', undefined)
        } else {
            const {center, place_name} = body.features[0]
           
            callback(undefined, {
                latitude: center[1], 
                longitude: center[0],
                location: place_name
            })
            // console.log("Lat: " + coords[1] + ' - Long: ' + coords[0])
        }
    })
}

module.exports = geocode