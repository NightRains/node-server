
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')




http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url)
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, 'not found')
      res.end('Oh, Not Found')
    } else {
      // example1
      // let md5 = crypto.createHash('md5')
      // res.setHeader('Etag', md5.update(data).digest('base64'))
      // res.writeHead(200, 'OK')
      // res.end(data)

      // example2
      console.log(req.headers['if-none-match'])
      let oldEtag = req.headers['if-none-match']
      if(!oldEtag) {
        let md5 = crypto.createHash('md5')
        res.setHeader('Etag', md5.update(data).digest('base64'))
        res.writeHead(200, 'OK')
        res.end(data)       
      } else {
        let newEtag = crypto.createHash('md5').update(data).digest('base64')
        if(oldEtag !== newEtag) {
          res.setHeader('Etag', newEtag)
          res.writeHead(200, 'OK')
          res.end(data)          
        }else {
          res.writeHead(304)
          res.end()
        }
      }



      //example2
      // console.log(req.headers)
      // let mtime = Date.parse(fs.statSync(filePath).mtime)
      // if(!req.headers['if-modified-since']) {
      //   res.setHeader('Last-Modified', new Date(mtime).toGMTString())
      //   res.writeHead(200, 'OK')
      //   res.end(data)        
      // }else {
      //   let oldMtime = Date.parse(req.headers['if-modified-since'])
      //   if(mtime > oldMtime) {
      //     res.setHeader('Last-Modified', new Date(mtime).toGMTString())
      //     res.writeHead(200, 'OK')
      //     res.end(data)            
      //   }else {
      //     res.writeHead(304)
      //     res.end()
      //   }
      // }

      //example3
      // let mtime = Date.parse(fs.statSync(filePath).mtime)
      // //10秒内，浏览器直接从自己本地拿，10秒后找服务器要。如果没修改，告诉浏览器没修改就行，如果修改了，给浏览器最新的
      // res.setHeader('Cache-Control', 'max-age=10')

      // if(!req.headers['if-modified-since']) {
      //   res.setHeader('Last-Modified', new Date(mtime).toGMTString())
      //   res.writeHead(200, 'OK')
      //   res.end(data)        
      // }else {
      //   let oldMtime = Date.parse(req.headers['if-modified-since'])
      //   if(mtime > oldMtime) {
      //     res.setHeader('Last-Modified', new Date(mtime).toGMTString())
      //     res.writeHead(200, 'OK')
      //     res.end(data)            
      //   }else {
      //     res.writeHead(304)
      //     res.end()
      //   }
      // }

    }
  })
}).listen(8080)
console.log('Visit http://localhost:8080' )



