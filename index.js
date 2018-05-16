require('dotenv').config()
// 모듈을 불러오는 코드는 대개 맨 위에 작성한다.
const express = require('express')
const morgan = require('morgan')
const randomstring = require('randomstring')
const bodyParser = require('body-parser')
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
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  const host = req.get('host');
  res.render('index.ejs', {host, urls})
})

// express는 먼저 등록된 라우트 핸들러 먼저 실행된다.
app.get('/new', (req, res) => {
  // if (req.query.secret === 'CAMPUS') {
  if (req.query.secret === process.env.SECRET) {
    res.render('new.ejs')
  } else {
    // 권한이 없을 때는 403
    res.status(403)
    res.send('403 Forbindden')
  }
})

app.post('/new', (req, res) => {
  const urlItem = {
    longUrl: req.body.longUrl,
    slug: randomstring.generate(8)
  }
  urls.push(urlItem)
  res.redirect('/')
})

app.get('/:slug', (req, res) => {
  const urlItem = urls.find(item => item.slug === req.params.slug);
  if(urlItem) {
    // 한번만 리디렉션 되고 요청을 서버에 보내지 않는다.
    // 영구히 이동되었고 더이상 바꾸지 않을 것이라는 의미이다.
    res.redirect(302, urlItem.longUrl)
    // 브라우저 캐시에 남는다.

    // 시크릿 탭을 이용하면 된다.
  } else {
    // 뭐라도 응답을 보내줘야한다. 안 그러면 응답을 계속 기다린다;;
    res.status(400)
    res.send('404 not found');
  }
})

app.listen(3000, () => {
  console.log('listening...')
})