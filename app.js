const express = require('express.js')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, cricketTeam.db)
const db = null

app.use(express.json())

const intializeDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Sever started successfully')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}
intializeDatabase()

const convertObjectToArray = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: jersey_number,
    role: dbObject.role,
  }
}
//get players

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `
    SELECT 
        *
    FROM   
      cricket_team;`
  const playersArray = await db.all(getPlayerQuery)
  response.send(playersArray.map(eachItem => convertObjectToArray(eachItem)))
})

//psot player

app.post('/players/', async (request, response) => {
  const {player_name, jersey_number, role} = request.body
  const createNewPlayer = `
  INSERT INTO
  cricket_team(player_name,jersey_number,role)
  VALUES
  ('${player_name}','${jersey_number}','${role}');`
  const addPlayers = await db.run(createNewPlayer)
  response.send('Player Added to Team')
})

// get players

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayersByid = `
  SELECT
  *
  FROM
  cricket_team
  WHERE
  player_id = ${playerId};`
  const players = await db.get(getPlayersByid)
  response.send(players)
})

// update player details

app.put('players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerDetails = `
  UPDATE
  cricket_team
  SET
  player_name = ${playerName},
  jersey_numbers = ${jerseyNumber},
  role = ${role}
  WHERE
  player_id = ${playerId};`
  const updatePlayer = await db.run(updatePlayerDetails)
  response.send('Player Details Updated')
})

// Delete player

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerDetails = `
  DELETE FROM
  cricket_team
  WHERE
  player_id = ${playerId};`
  const deletePlayer = await db.run(deletePlayerDetails)
  response.send('Player Removed')
})

module.exports = app
