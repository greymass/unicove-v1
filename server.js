// this is just for testing builds, don't use in production!

const fs = require('fs')
const http = require('http')
const mime = require('mime')
const path = require('path')

const dir = 'build'
const fallback = path.join(dir, 'index.html')
const port = 8001

http.createServer((req, res) => {
    let file = path.join(dir, req.url.slice(1))
    let serve = fs.existsSync(file) && fs.statSync(file).isFile() ? file : fallback
    console.log(`${req.url}\n    => ${serve}`)
    fs.readFile(serve, (_, data) => {
        res.setHeader('Content-Length', data.byteLength)
        res.setHeader('Content-Type', mime.getType(serve))
        res.write(data)
        res.end()
    })
}).listen(port, () => {
    console.log(`running on http://localhost:${port}`)
})
