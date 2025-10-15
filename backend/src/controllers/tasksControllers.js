import Task from "../models/Task.js";



export const getAllTasks= async(req, res)=> {
    const {filter="hom nay"}= req.query; 
    const now= new Date();
    let startDate; 

    switch(filter){
        case "today":{
            startDate= new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
            break; 
    }
        case "week":{   
            const mondayDate= now.getDate() - (now.getDate-1)-(now.getDate===0 ?0 :7); 
            startDate=new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break; 

        }
        case "month":{
            startDate= new Date(now.getFullYear(), now.getMonth(), 1);
            break; 
        }
        case "all":
            default:{
                startDate= null;
            }
    }


    const query=startDate?{createdAt:{$gte:startDate}}:{}; 
    try{
        // const tasks= await Task.find().sort({createdAt:-1}); 
        const result= await Task.aggregate([
            {$match:query},
            {
                $facet:{
                    tasks:[{$sort :{createdAt: -1}}], 
                    activeTaskCount:[{$match:{status:"active"}}, {$count:"count"}], 
                    completeTaskCount:[{$match:{status:"complete"}}, {$count:"count"}]
                }
            }
        ])

        const tasks= result[0].tasks; 
        const activeTaskCount= result[0].activeTaskCount[0]?.count||0; 
        const completeTaskCount= result[0].completeTaskCount[0]?.count||0; 

        res.status(200).json({tasks, activeTaskCount, completeTaskCount});
    }catch(error){
        console.error("Lỗi khi gọi getAllTasks: ",error); 
        res.status(500).json({
            message:"Lỗi hệ thống"
        }); 

    } 
}

export const createTasks= async (req,res)=> {
    try{
        const {title}= req.body; 
        const task= new Task({title}); 
        const newTask= await task.save(); 
        res.status("201").json(newTask); 

    }catch(error){
        console.error("Lỗi khi gọi CreateTasks",error); 
        res.status("500").json({
            message:"Lỗi hệ thống"
        }); 

    }
}

export const updateTask= async (req,res)=>{
    try{

        const {title, status, completeAt}= req.body; 
        const updatedTask= await Task.findByIdAndUpdate(
            req.params.id,{
                title, 
                status, 
                completeAt
            }, 
            {new  : true}
        ); 


        if(!updatedTask){
            return res.status(404).json({
                message:"Nhiệm vụ không tồn tại"
            })
        }

        res.status(200).json(updatedTask); 

    }catch(error){
          console.error("Lỗi khi gọi UpdateTask",error); 
        res.status(500).json({
            message:"Lỗi hệ thống"
        }); 
    }
}

export const deleteTasks= async (req,res)=>{
    try{
    const deleteTask= await Task.findByIdAndDelete(req.params.id); 
    if(!deleteTask){
        return res.status(404).json({
            message:"Nhiệm vụ không tồn tại"
        }); 
    }
    res.status(200).json(deleteTask); 
}catch(error){
       console.error("Lỗi khi gọi DeleteTask",error); 
        res.status("500").json({
            message:"Lỗi hệ thống"
        }); 
}
}