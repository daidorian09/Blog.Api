import app from './app'

const PORT : string | number | undefined = process.env.PORT
validatePort()

app.listen(PORT, () => {
    console.info('##########################################################')
    console.info('#####               STARTING SERVER                  #####')
    console.info('##########################################################\n')
    console.info(`Server is now running on http://localhost:${PORT}`)
  })

function validatePort() {
  if (!PORT) {
    throw Error('Port is missing')
  }
}
