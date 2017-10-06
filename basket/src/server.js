/* eslint-disable no-console */
import express from 'express'
import morgan from 'morgan'
import { renderToString } from 'react-dom/server'
import BasketBuy from './cf-basket-buy/BasketBuy'
import BasketBasket from './cf-basket-basket/BasketBasket'

const app = express()
app.use(morgan('dev'))
app.use('/basket', express.static('./build'))

app.use('/cf-basket-buy', (req, res) => {
  res.send(
    renderToString(
      React.createElement(
        BasketBuy,
        null,
        null
      )
    )
  )
})

app.use('/cf-basket-basket', (req, res) => {
  res.send(
    renderToString(
      React.createElement(
        BasketBasket,
        null,
        null
      )
    )
  )
})

app.listen(3001)

console.log(`🔵 basket running. fragments are available here:
>> http://127.0.0.1:3001/cf-basket-buy
>> http://127.0.0.1:3001/cf-basket-basket
`)