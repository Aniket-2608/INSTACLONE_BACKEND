const express=require("express");
const multer=require("multer");
const mongoose=require("mongoose");
const cors=require('cors');
const app=express();
app.use(cors());
const port=process.env.PORT || 5001;
app.use(express.json());

app.use("/uploads",express.static("./uploads"));


mongoose.connect("mongodb+srv://Instaclone1:QWERTYinstac@cluster0.8nzzhn6.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connected to database");
}).catch((error)=>{
    console.log(error);
})

const postSchema= new mongoose.Schema({
    PostImage:{type:String},
    name:{type:String },
    location:{type:String},
    description:{type:String}
})

const PostUser=new mongoose.model("PostUser", postSchema);
//storage
const Storage=multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
//upload
const upload=multer({
    storage:Storage
})


// app.post("/post-page", upload.single("PostImage"),async(req,res)=>{
//     try{
//         console.log(req.body);
//         console.log("hoihii")
//         const user=  await PostUser.create({
//             PostImage:req.file.filename,
//             name:req.body.name,
//             location:req.body.location,
//             description:req.body.description  
//         })
//         res.status(200).json({user:user});
       

//     }catch(e){
//         res.status(400).json({status:"failed",
//         message:e.message})
//     }
   
// })

app.post("/post-page" ,upload.single('PostImage'), async(req, res) => {
	try {
		
			console.log(req.file)
			const data={
                PostImage:  req.file.filename,
				name: req.body.name,
				location: req.body.location,
				description: req.body.description
			}
			const users = await PostUser.create(data);
			res.json({
					status: "Success",
					users
			})

	}catch(e) {
			res.status(500).json({
					status: "failed",
					message: e.message
			})
	}

})
app.get("/post-page",async (req,res)=>{
    try{
        const User= await PostUser.find();
     res.json({
        status:"success",
        user:User
         })
    }catch(e){
        res.json({
            status:"failed",
            message:e.message
        })
    }
})

app.listen(port,()=>{
    console.log("server is running at port "+port);
})
