var http = require('http')
var https = require('https')
const PORT = 8080

function handleRequest(original_request, original_response) {
    var [project_name, user_name] = original_request.headers.host.split('.')
    if (user_name === 'gh-pages') {
        user_name = project_name
        project_name = ''
    }
    https.request({
        method: original_request.method,
        hostname: `${user_name}.github.io`,
        path: `/${project_name}${original_request.url}`,
        headers: Object.assign({}, original_request.headers, {
            host: `${user_name}.github.io`
        })
    }, (res) => {
        original_response.writeHead(res.statusCode, res.headers);
        res.on('data', (chunk) => original_response.write(chunk))
        res.on('end', () => original_response.end())
    }).on('error', (e) => {
        console.log(`problem with request: ${e.message}`)
    }).end()
}

http.createServer(handleRequest).listen(PORT, () =>
    console.log(`Server listening on: http://localhost:${PORT}`))
