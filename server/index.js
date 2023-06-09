const cors = require("cors");
const express = require("express");
const { pool } = require("./db");

const PORT = 80;
const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

// Middleware...
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes:

// Test
// app.get('/message', cors(corsOptions), async (req, res)=>{
//     res.send({message: "Hello world"})
// })

app.get("/users/:id", cors(corsOptions), async (req, res) => {
  const userId = req.params["id"];
  const [userRow] = await pool.query("select * from users where id = ?", [
    userId,
  ]);
  // console.log(userRow)
  res.send(userRow);
});

app.get("/users", cors(corsOptions), async (req, res) => {
  const userName = req.query["name"];
  const [nameRow] = await pool.query("select * from users where name = ?", [
    userName,
  ]);
  // console.log(nameRow)
  res.send(nameRow);
});

app.post("/users", cors(corsOptions), async (req, res) => {
  const { name, age, followers, verified, country } = req.body;
  // console.log(req.body)
  const [newUserRow] = await pool.query(
    "insert into users (name, age, followers, verified, country) values (?, ?, ?, ?, ?)",
    [name, age, followers, verified, country]
  );
  res.send({ message: " User added successfully." });
});

app.put("/users/:id", cors(corsOptions), async (req, res) => {
  const userId = req.params["id"];
  const { name, age, followers, verified, country } = req.body;
  const updateUser = await pool.query(
    "update users set name = ?, age = ?, followers = ?, verified = ?, country = ? where id = ?",
    [name, age, followers, verified, country, userId]
  );
  res.send({ message: "User has been updated." });
});

app.delete('/users/:id', cors(corsOptions), async (req, res)=>{
    const userId = req.params["id"];
    const deleteUser = await pool.query('delete from users where id = ?', [userId])
    res.send({ message: "User has been deleted."})
})

app.listen(PORT, () => {
  console.log(`Express web API running on port: ${PORT}.`);
});
