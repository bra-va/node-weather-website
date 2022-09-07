const express = require('express')
// node permette di accedere al nome e al path del file corrente
// ma per manipolare i path ed accedere alle risorse possiamo usare
// un apposito modulo chiamato "path"
const path = require('path')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//uso la funzione express per lanciare l'applicazione
const app = express()
const port = process.env.PORT || 3000 // se trova una porta remota usa quella, altrimenti quella locale

// imposto i settaggi di Express
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Imposto l'handlebars engine e la posizione delle views
app.set('view engine', 'hbs') //aggiungo handlebars
app.set('views', viewPath)// Imposto la cartella delle view
hbs.registerPartials(partialsPath) //aggiungo la cartella dei partials

//Imposto la cartella statica
app.use(express.static(publicDirectoryPath))

// Imposto il mapping delle pagine
app.get('', (req, res) => {
     //renderizza cioè che trova in "views"
     // il primo argomento è il nome della view
     // il secondo è un oggetto che contiene tutti i valori che
     // si vogliono rendere accessibili dalla view
    res.render('index', {
        title: "Weather",
        name: "Andrew Mead"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Me",
        name: "Andrew Mead"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        message: "This is an help message!",
        name: "Andrew Mead"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Devi inserire un indirizzo"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) return res.send({error})
    
        forecast(latitude, longitude, (error, forecastData) => {
    
            if (error) return res.send({error})
    
            // console.log(location)
            // console.log(forecastData)

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
        
    })
})

app.get("/products", (req, res) => {
    // Posso accedere ai query params
    // Oggetto di chiavi-valore
    // req.query.nome_parametro
    if (!req.query.search) {
        // dato che può essere inviato un solo send
        // dobbiamo assicurarci che venga interrotto dopo il primo invio
        // nel caso in cui search contenga più di un parametro
        return res.send({
            error: "You must provide a search term"
        })
    }

    res.send({
        products: []
    })
})

// * carattere wildcard che matcha qualsiasi testo
app.get('/help/*', (req, res) => {
    // res.send('Help article not fould')
    res.render('404', {
        title: "404",
        name: "Andrew Mead",
        message: "Help article not found"
    })
})

// pagina help fornita da express
// Da mettere in fondo alla lista delle pagine, viene eseguito solo se
// nessun'altra pagina matcha
app.get('*', (req, res) => {
    // res.send('My 404 page')
    res.render('404', {
        title: "404",
        name: "Andrew Mead",
        message: "Page not found"
    })
})


// Come starto il server?
app.listen(port, () => {
    // callback quando il server è startato correttamente
    console.log("Server is up in port " + port)
})



