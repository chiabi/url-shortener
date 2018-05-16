// 모듈을 불러오는 코드는 대개 맨 위에 작성한다.
const express = require('express')
const morgan = require('morgan')
const randomstring = require('randomstring')

const app = express()

const urls = [
  {
    slug: randomstring.generate(8),
    longUrl: 'https://www.naver.com'
  }
]

app.use('/static', express.static('public'))
// app.use(morgan('combined'))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  const host = req.get('host');
  res.render('index.ejs', {host, urls})
})

app.get('/:slug', (req, res) => {
  const urlItem = urls.find(item => item.slug === req.params.slug);
  if(urlItem) {
    // 한번만 리디렉션 되고 요청을 서버에 보내지 않는다.
    // 영구히 이동되었고 더이상 바꾸지 않을 것이라는 의미이다.
    res.redirect(301, urlItem.longUrl)
    // 브라우저 캐시에 남는다.

    // 시크릿 탭을 이용하면 된다.
  } else {
    // 뭐라도 응답을 보내줘야한다. 안 그러면 응답을 계속 기다린다;;
    res.status(400)
    res.send('404 not found');
  }
})

app.post('/new', (req, res) => {

})

app.listen(3000, () => {
  console.log('listening...')
})