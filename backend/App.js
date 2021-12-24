import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import postRoutes from "./routes/postRoutes.js";
import AddpostSchema from "./db/postSchema.js";
import http from "http";
import { registration, login, postSocket } from "./routes/socketroutes.js";
import multer from "multer";
const upload = multer();
const PORT = 5000;
const app = express();
const httpServer = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/posts", postRoutes);
const db = "mongodb://localhost:27017/chat_app";
const io = new Server(3001, { cors: { origin: "http://localhost:3000" } });
// const io = require("socket.io")(3001, {
//     cors: {
//         origin: ['http://localhost:3000']
//     }
// });

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MondoDB connected");
  } catch (err) {
    console.log(err.message);
  }
};
connectDB();

io.on("connection", (socket) => {
  socket.on("registration", (data) => {
    registration(data);
  });

  socket.on("login", async (data) => {
    login(data);
  });

  socket.on("addpost", async (data) => {
    let ins = new AddpostSchema({
      name: data.name,
      email: data.email,
      title: data.title,
      description: data.description,
      comment: data.comment,
    });

    console.log("in Socket Router", ins);
    await ins.save((e) => {
      if (e) {
        console.log("Error in AddPOst", e);
      } else {
        console.log("Post added");
      }
    });
  });

  socket.on("fetchpost", async () => {
    AddpostSchema.find({}, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("data added successfully in fetch post", data);
        io.emit("fetchdata", data);
      }
    });
  });

  //     socket.on('sendcomment',async(body)=>{
  //     await AddpostSchema.findOneAndUpdate({_id:body.id},{$set:{comment:body.storeComment}}).exec((err,data)=>{
  //            if(err) throw err;
  //            else {
  //                console.log(data,"in line 64")
  //            }
  //        })
  //        await AddpostSchema.find({}).exec((err,data)=>{
  //            if(err){
  //                console.log(err)
  //            }
  //            else {
  //                console.log('data added successfully in send comment',data)
  //                io.emit('fetchcomment',data)
  //            }
  //        })
  //    })

  socket.on("sendcomment", async (body) => {
    let comm = await AddpostSchema.findOneAndUpdate(
      { _id: body.id },
      { $set: { comment: body.storeComment } }
    );
    console.log(comm);
    let comm2 = await AddpostSchema.find({});
    console.log("data added successfully in send comment", comm2);
    io.emit("fetchcomment", comm2);
  });
});

httpServer.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Work on ${PORT}`);
});
