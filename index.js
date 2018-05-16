// 모듈을 불러오는 코드는 대개 맨 위에 작성한다.
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use('/static', express.static('public'))
// app.use(morgan('combined'))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(3000, () => {
  console.log('listening...')
})