const http = require('http');
var fs = require('fs');
var path = require('path'); 

const hostname = '127.0.0.1';
const port = 3000;

function onRequest(request, response) {
    if (request.url === "/") {
        fs.readFile("./index.html", "UTF-8", function(err, html){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(html);
        });
    } else if (request.url.match("\.js$")) {
        fs.readFile(path.join(__dirname, request.url), "UTF-8", function(err, data){
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.end(data);
        });
    } else if (request.url.match("\.css$")) {
        var cssPath = path.join(__dirname, 'public', request.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        response.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(response);
    } else if (request.url.match("\.png$")) {
        var imagePath = path.join(__dirname, request.url);
        var fileStream = fs.createReadStream(imagePath);
        response.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(response);
    } else {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.end("No Page Found");
    }
}

// Create the server
const server = http.createServer(onRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});