const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")


db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)")
db.run("CREATE TABLE IF NOT EXISTS Posts (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, title TEXT, content TEXT)")




app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs")
app.get("/", (req,res) => {
    let posts = db.all("SELECT * FROM Posts", (err, rows) => {
        if(err) {
            console.log(err)
        }
        res.render("index", {posts: rows})
    })
})

app.get("/users", (req,res) => {
    let users = db.all("SELECT * FROM Users", (err, rows) => {
        if(err) {
            console.log(err)
        }
        res.render("users", {users: rows})
    })
})

app.get("/posts", (req,res) => {
    res.render("posts")
})

app.post("/add", (req,res) => {
    db.run("INSERT INTO Users (name, password) VALUES (?, ?)", [req.body.name, req.body.password], (err) => {
        if(err) {
            console.log(err)
        }
        res.redirect("/users")
    })
    })
    app.get("/edit/:id", (req,res) => {
        let user = db.get("SELECT * FROM Users WHERE id = ?", [req.params.id], (err, row) => {
            if(err) {
                console.log(err)
            }
            res.render("edit", {user: row})
        })
    })
    app.post("/edit/done/:id", (req,res) => {
        db.run("UPDATE Users SET name = ?, password = ? WHERE id = ?", [req.body.name, req.body.password, req.params.id], (err) => {
            if(err) {
                console.log(err)
            }
            res.redirect("/users")
        })
    })

    app.get("/delete/:id", (req,res) => {
        db.run("DELETE FROM Users WHERE id = ?", [req.params.id], (err) => {
            if(err) {
                console.log(err)
            }
            res.redirect("/users")
        })
    })
    

    app.get("/posts", (req,res) => {
        let posts = db.all("SELECT * FROM Posts", (err, rows) => {
            if(err) {
                console.log(err)
            }
            res.render("posts", {posts: rows})
        })
    })


    app.post("/addpost", (req,res) => {
        db.run("INSERT INTO Posts (author, title, content) VALUES (?, ?, ?)", [req.body.author, req.body.title, req.body.content], (err) => {
            if(err) {
                console.log(err)
            }
            res.redirect("/posts")
        })
        })
        app.get("/editpost/:id", (req,res) => {
            let post = db.get("SELECT * FROM Posts WHERE id = ?", [req.params.id], (err, row) => {
                if(err) {
                    console.log(err)
                }
                res.render("editpost", {post: row})
            })
        })
        app.post("/editpost/done/:id", (req,res) => {
            db.run("UPDATE Posts SET author = ?, title = ?, content = ? WHERE id = ?", [req.body.author, req.body.title, req.body.content, req.params.id], (err) => {
                if(err) {
                    console.log(err)
                }
                res.redirect("/posts")
            })
        })



app.listen(3000, () =>console.log("Aplikacja działa na porcie 3000"))