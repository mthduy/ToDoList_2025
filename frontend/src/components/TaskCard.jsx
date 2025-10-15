import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import api from '@/lib/axios';
import { toast } from 'sonner';

const TaskCard = ({task,index, handleTaskChanged}) => {
  const [isEditting, setIsEditting]=useState(false); 
  const [updateTaskTitle, setUpdateTaskTitle]= useState(task.title ||""); 

  const deleteTask = async(taskId) =>{
    try{
      await api.delete(`/tasks/${taskId}`)
      toast.success("Nhiệm vụ đã xóa thành công.")
      handleTaskChanged(); 
    }catch(error){
         console.error("Lỗi xảy ra khi xóa task: ",error) 
         toast.error("Lỗi xảy ra khi xóa nhiệm vụ.")
    }

  }

  const updateTask= async() =>{
    try{
      setIsEditting(false); 
      await api.put(`/tasks/${task._id}`,{
        title: updateTaskTitle
      }); 
      toast.success(`Nhiệm vụ ${task.title} đã cập nhật thành ${updateTaskTitle}`)
      handleTaskChanged(); 
    }catch(error){
      console.error("Lỗi xảy ra khi cập nhật task: ",error) 
      toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ.")
    }

  }

  const toggleTaskCompleteButton =async () =>{
    try{
      if(task.status==='active'){
        await api.put(`/tasks/${task._id}`,{
          status:'complete',
          completeAt: new Date().toISOString(),
        }); 
        toast.success(`${task.title} đã hoàn thành.`)
      }else {
        await api.put(`/tasks/${task._id}`,{
          status:'active', 
          completeAt:null,
        })
         toast.success(`${task.title} đã được đổi thành chưa hoàn thành.`)
      }
      handleTaskChanged(); 
    }catch(error){
      console.error("Lỗi xảy ra khi cập nhật task: ",error) 
      toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ.")
    }



  }
  const handleKeyPress=(event)=>{
    if(event.key==="Enter"){
      updateTask(); 
    }
  }

  return (
    // dùng cn để gộp nhiều class Tailwind
    <Card className={cn(
      "p-4 bg-gradient-background border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
      task.status ==="completed" &&"opacity-75"
    )}
    style={{ animationDelay: `${index*50}ms`}}>
    
    <div className="flex items-center gap-4">
      <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex-shrink-0 size-8 rounded-b-full transition-all duration-200", 
            task.status==="complete"
            ?"text-success hover:text-success/80"
            :"text-muted-foreground hover:text-primary"
              
          )}
          onClick={toggleTaskCompleteButton}
        >
          { task.status==='complete'?(
            <CheckCircle2 className="size-5" />
          ):(
            <Circle className="size-5"/> 
          )
          }    
      </Button>
      <div className="flex-1 min-w-0">
        {
           isEditting ? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updateTaskTitle}
              onChange={(e)=> setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={()=>{
                setIsEditting(false)
                setUpdateTaskTitle(task.title || "")
              }}
            /> 
           ) :(
            <p className={cn(
              "text-base transition-all duration-200", 
                task.status==="complete"
                ?"line-through text-muted-foreground"
                :"text-foreground"     
            )}>
              {task.title}
              
            </p>
           )
        }
        <div className="flex items-center gap-2 mt-1">
        <Calendar className="size-3 text-muted-foreground"/>
        <span className="text-xs text-muted-foreground">
        {
          new Date(task.createdAt).toLocaleString()
        }
        </span> 
        {task.completeAt &&(
          <>
            <span className="text-xs text-muted-foreground">-</span>
            <Calendar className="size-3 text-muted-foreground"/>
            <span className="text-xs text-muted-foreground">
              {new Date(task.completeAt).toLocaleString()}
            </span>
          </>
        )

        }
      </div>
      </div>
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={()=> {
              setIsEditting(true)
                setUpdateTaskTitle(task.title || "")
            }}

          >
            <SquarePen className="size-4"/>

          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={()=> deleteTask(task._id)}
          >
            <Trash2 className="size-4"/>

          </Button>

        </div>
    </div>
    </Card>
  );
}

export default TaskCard