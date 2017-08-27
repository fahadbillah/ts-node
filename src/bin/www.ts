import app from '../app'

const port = process.env.PORT || 6003

app.listen(port, (err: any) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})