const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { Pool } = require('pg')

const app = express()

/* app.use(core()) */
app.use(express.json())

const pool = new Pool()

    const PORT = process.env.PORT || 8080
// GET TIME FROM THIS PATH
    app.get('/time', (req, res) => {
        pool.query('SELECT NOW()', (err, response) =>{
            if(err){
             return response.status(500).send('Something is wrong')
            }
            res.send(response.rows[0])
         })
        
    })
    

  
//SELECT ALL FIGHTERS FFROM THE DB TABLE
    app.get('/api/fighters', async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM fighters');
          res.json(rows);
        } catch (e) {
          console.error('Error executing query', e);
          res.sendStatus(500);
        }
      });
      //GET FIGHTERS WITH PARAMS
      app.get('/api/fighters/:id', async (req, res) => {
try {
          const { id } = req.params;
          const { rows } = await pool.query('SELECT * FROM fighters WHERE id = $1', [id]);
          res.json(rows[0] || null);
        } catch (e) {
          console.error('Error executing query', e);
          res.sendStatus(500);
        };
      });
      app.post('/api/fighters', (req, res) => {
        const { first_name, last_name, country_id, style } = req.body;
      
        //INSERT FIGHTERS INTO THE DB TABLE
        pool.query(
          'INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING fighters;',
          [first_name, last_name, country_id, style],
          (error, results) => {
            if (error) {
              // Handle the error
              console.error(error);
              res.status(500).send('Error creating fighter');
            } else {
              // Successful insertion
              res.status(201).send('Fighter created successfully');
            }
          }
        );
      });

//UPDATE FIGHTERS
      app.put('/api/fighters/:fighterId', (req, res) => {
        const fighterId = req.params.fighterId;
        const { first_name, last_name, country_id, style } = req.body;
      
        pool.query(
          'UPDATE fighters SET first_name = $1, last_name = $2, country_id = $3, style = $4 WHERE id = $5;',
          [first_name, last_name, country_id, style, fighterId],
          (error, results) => {
            if (error) {
              // Handle the error
              console.error(error);
              res.status(500).send('Error updating fighter');
            } else {
              // Successful update
              res.status(200).send('Fighter updated successfully');
            }
          }
        );
      });
//DELETE FIGHTER
      app.delete('/api/fighters/:fighterId', (req, res) => {
        const fighterId = req.params.fighterId;
      
        pool.query(
          'DELETE FROM fighters WHERE id = $1;',
          [fighterId],
          (error, results) => {
            if (error) {
              // Handle the error
              console.error(error);
              res.status(500).send('Error deleting fighter');
            } else {
              // Successful deletion
              res.status(200).send('Fighter deleted successfully');
            }
          }
        );
      });

    app.get('/', (req, res)=>{
        res.send('Welcome');
    });

    app.listen(PORT, () => {
        console.log(`listening on http://localhost:${PORT}`)
    });
