require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// middleware-------->
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Create contact Schema----------->
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone_num: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  photo: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});


// Create contact model--------->
const Contact = mongoose.model("contacts", contactSchema);

// Connect to Mongodb---------->
mongoose
  .connect(
    "mongodb://connectifyDB:0wL7LjhKdyU7o22z@ac-tuztplb-shard-00-00.0o9qayn.mongodb.net:27017,ac-tuztplb-shard-00-01.0o9qayn.mongodb.net:27017,ac-tuztplb-shard-00-02.0o9qayn.mongodb.net:27017/?ssl=true&replicaSet=atlas-z73jlu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB is Connected"))
  .catch((error) => {
    console.log("DB is not Connected");
    console.log(error);
  });

// Create contact data---------->
app.post("/contacts", async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone_num: req.body.phone_num,
      address: req.body.address,
      photo: req.body.photo,
    });
    const contactData = await newContact.save();
    res.send(contactData);
  } catch (error) {
    res.send({ message: error.message });
  }
});

// Find contact data--------->
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (contacts) {
      res.status(200).send(contacts);
    } else {
      res.status(404).send({ message: "contact not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Update contact Data------------>
app.patch("/updateContact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const contact = req.body;
    const updatedContact = await Contact.updateOne(
      { _id: id },
      {
        $set: {
          name: contact.name,
          email: contact.email,
          phone_num: contact.phone_num,
          address: contact.address,
          photo: contact.photo,
        },
      }
    );
    if (updatedContact) {
      res.status(200).send(updatedContact);
    } else {
      res.status(404).send({ message: "contact was not update with this id" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
});

// add favourite contact Data----------->
app.patch("/favouriteContact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const favouriteContact = await Contact.updateOne(
      { _id: id },
      {
        $set: {
          status: "favourite",
        },
      }
    );
    if (updatedContact) {
      res.status(200).send(favouriteContact);
    } else {
      res.status(404).send({ message: "contact was not update with this id" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
});

// Delete contact
app.delete("/deleteContact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteContact = await Contact.deleteOne({ _id: id });
    if (deleteContact) {
      res.status(200).send(deleteContact);
    } else {
      res.status(404).send({ message: "contact was not delete with this id" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("connectify server is running....");
});

app.listen(port, () => {
  console.log(`Connectify listening on port ${port}`);
});
