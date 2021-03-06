/* eslint-disable no-console */
import express from 'express'
import morgan from 'morgan'
import RedisSMQ from 'rsmq'
import path from 'path'
import bodyParser from 'body-parser'
import renderPage from './page/render'

const app = express()
const router = express.Router()
const rsmqClient = new RedisSMQ({host: 'redis-data', port: 6379, ns: 'cf'})
app.use(morgan('dev'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/catalog/images', express.static('./images'))
app.use('/catalog', express.static('./build'))

// The catalog service is responsible for creating Redis queues.
rsmqClient.createQueue({qname: 'sku'}, (err, res) => {
  if (res === 1) {
    console.log('queue created')
  }
})

rsmqClient.createQueue({qname: 'basket'}, (err, res) => {
  if (res === 1) {
    console.log('queue created')
  }
})

router.get('/', (req, res) => {
  const html = renderPage()
  res.render('layout', { html })
})

router.get('/sku', (req, res, next) => {
  rsmqClient.receiveMessage({qname: 'sku'}, (err, resp) => {
    if (resp.id) {
      res.json({sku: resp.message})
    } else {
      res.json({sku: 't_porsche'})
    }
  })
})

router.post('/sku', (req, res, next) => {
  rsmqClient.sendMessage({qname: 'sku', message: req.body.sku}, (err, resp) => {
    if (resp) {
      res.json({msgstatus: 'sent', msgid: resp})
    } else {
      res.json({msgstatus: 'not sent'})
    }
  })
})

router.get('/cart', (req, res, next) => {
  rsmqClient.receiveMessage({qname: 'basket'}, (err, resp) => {
    if (resp.id) {
      res.json({count: resp.message})
    } else {
      res.json({count: 0})
    }
  })
})

router.post('/cart', (req, res, next) => {
  rsmqClient.sendMessage({qname: 'basket', message: req.body.basketCount}, (err, resp) => {
    if (resp) {
      res.json({msgstatus: 'sent', msgid: resp})
    } else {
      res.json({msgstatus: 'not sent'})
    }
  })
})

app.use('/', router)

app.listen(3003);
console.log(`🔴  catalog running. product page is available here:
>> http://127.0.0.1:3003/`)
