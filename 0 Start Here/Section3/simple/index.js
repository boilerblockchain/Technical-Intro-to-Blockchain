const express = require('express')
const cors = require('cors')
const { ethers } = require("ethers")
const app = express()

/**
 * This allows cross-origin requests, makes demo easier
 * In real app, this should only be allowed for public endpoints
*/
app.use(cors())

const port = 3000

/**
 * Test this out with the following command
 * curl http://localhost:3000/api/blockNum
 */
app.get('/api/blockNum', async (req, res) => {
  const provider = ethers.getDefaultProvider("mainnet");
  const blockNum = await provider.getBlockNumber();
  res.send({ blockNum })
})

app.listen(port, () => {
  console.log(`Simple app listening on port ${port}`)
})
