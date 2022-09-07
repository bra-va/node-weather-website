const request = require('request')

const forecast = (lat, long, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=f331f733e36ad60a538a17793c55dee4&query=${encodeURIComponent(lat)},${encodeURIComponent(long)}&units=m`

    request({ url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to weather server!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            console.log(body.current)
            const {weather_descriptions, temperature, feelslike, humidity} = body.current
            callback(undefined, `${weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out, with ${humidity}% humidity.`)
        }
    })
}

module.exports = forecast