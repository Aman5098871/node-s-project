// Importing necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Setting view engine to EJS for rendering templates
app.set("view engine", "ejs");

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Ensure the 'files' directory exists, if not create it
if (!fs.existsSync("./files")) {
  fs.mkdirSync("./files");
}

// GET route for homepage to display the list of files
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.log(err);
      return res.send("Error occurred while fetching tasks.");
    }
    // Render the index.ejs view with the list of files
    res.render("index", { files: files });
  });
});

// GET route to show the content of a specific file
app.get("/file/:filename", (req, res) => {
  const filePath = `./files/${req.params.filename}`;

  // Reading file content from the specified file
  fs.readFile(filePath, "utf-8", (err, filedata) => {
    if (err) {
      console.log(err);
      return res.send("Error occurred while fetching the file.");
    }
    // Render the show.ejs view with the file name and data
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});

// GET route to render the edit page for a specific file
app.get("/edit/:filename", (req, res) => {
  // Render the edit.ejs view with the filename
  res.render("edit", { filename: req.params.filename });
});

// POST route to create a new file
app.post("/create", (req, res) => {
  const { title, details } = req.body; // Extract title and details from the request body
  const filePath = `./files/${title}.txt`;

  // Write the new file with the content provided
  fs.writeFile(filePath, details, (err) => {
    if (err) {
      console.log(err);
      return res.send("Error occurred while creating the file.");
    }
    // Redirect back to the homepage after file creation
    res.redirect("/");
  });
});

// POST route to edit/rename an existing file
app.post("/edit", (req, res) => {
  const { previous, new: newFileName } = req.body;
  const oldPath = `./files/${previous}`;
  const newPath = `./files/${newFileName}`;

  // Rename the file from previous name to the new name
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err);
      return res.send("Error occurred while renaming the file.");
    }
    // Redirect back to the homepage after renaming
    res.redirect("/");
  });
});

// 404 route handler for undefined routes
app.use((req, res) => {
  // Render a custom 404 page when route is not found
  res.status(404).render("404"); // Make sure '404.ejs' exists in 'views' folder
});

// Starting the server and listening on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
