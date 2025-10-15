import express from "express"
import tasksRoute from './routes/tasksRouters.js'
import { connectDB } from "./configs/db.js";
import dotenv from 'dotenv'
import cors from "cors";

dotenv.config();

const PORT=process.env.PORT ||5001 

const app= express(); 

//middleware
app.use(express.json());
app.use(cors({origin:"http://localhost:5173"}))

app.use("/api/tasks",tasksRoute)

connectDB().then(()=>{
    app.listen(PORT, ()=> {
    console.log(`Server đã bắt đầu trên cổng ${PORT}`); 
    }); 
}); 








