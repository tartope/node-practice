const cors = require("cors");
const express = require("express");
const { pool } = require("./db");
const { body, check, param, validationResult } = require("express-validator");

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

// Serve static assests from the public folder
// app.use(express.static(path.join(__dirname, "../public")));

// Routes:

// Test
// app.get('/message', cors(corsOptions), async (req, res)=>{
//     res.send({message: "Hello world"})
// })

app.get(
  "/users/:id",
  cors(corsOptions),
  // Tests if parameter id is a number
  param("id").isNumeric(),
  async (req, res) => {
    // Validate...
    const errors = validationResult(req);
    // If id is not a number, the error message is executed
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Business logic...
    const userId = req.params["id"];
    const [userRow] = await pool.query("select * from users where id = ?", [
      userId,
    ]);
    // console.log(userRow)
    userRow[0] ? res.send(userRow) : res.status(404).send({ message: 'User not found.'});
  }
);


app.get("/users", cors(corsOptions), async (req, res) => {
  const userName = req.query["name"];
  const userAge = req.query['age'];
  const [nameRow] = await pool.query("select * from users where name = ? AND age = ?", [
    userName, userAge
  ]);
  // console.log(nameRow)
  nameRow[0] ? res.send(nameRow) : res.status(404).send({ message: 'User not found.'});
});

app.post("/users", cors(corsOptions), async (req, res) => {
  const { name, age, followers, verified, country } = req.body;
//   console.log(req.body)
  const [newUserRow] = await pool.query(
    "insert into users (name, age, followers, verified, country) values (?, ?, ?, ?, ?)",
    [name, age, followers, verified, country]
  );
//   console.log(newUserRow)
  newUserRow ? res.send({ message: " User added successfully." }) : res.status(400).send({ message: 'Unable to add new user.'});
});

app.put("/users/:id", cors(corsOptions), async (req, res) => {
  const userId = req.params["id"];
  const { name, age, followers, verified, country } = req.body;
  const updateUser = await pool.query(
    "update users set name = ?, age = ?, followers = ?, verified = ?, country = ? where id = ?",
    [name, age, followers, verified, country, userId]
  );
  updateUser ? res.status(200).send({ message: "User updated successfully." }) : res.status(400).send({ message: 'Unable to update user.'});
});

app.delete("/users/:id", cors(corsOptions), async (req, res) => {
  const userId = req.params["id"];
  const deleteUser = await pool.query("delete from users where id = ?", [
    userId,
  ]);
  console.log(deleteUser)
  deleteUser ? res.status(200).send({ message: "User deleted successfully." }) : res.status(404).send({ message: "User not found."});
});


app.listen(PORT, () => {
  console.log(`Express web API running on port: ${PORT}.`);
});
