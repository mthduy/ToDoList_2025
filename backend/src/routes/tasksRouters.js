import express from 'express'
import { getAllTasks,createTasks,updateTask, deleteTasks } from '../controllers/tasksControllers.js';
const router= express.Router(); 


router.get("/",getAllTasks); 

router.post("/",createTasks); 

router.put("/:id",updateTask); 

router.delete("/:id",deleteTasks); 

export default router; 