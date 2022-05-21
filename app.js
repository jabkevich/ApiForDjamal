const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

const filePath = "tasks.json";
app.get("/api/tasks", function(req, res){

    const content = fs.readFileSync(filePath,"utf8");
    const tasks = JSON.parse(content);
    res.send(tasks);
});
// получение одного пользователя по id
app.get("/api/tasks/:id", function(req, res){

    const id = req.params.id; // получаем id
    const content = fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(content);
    let task = null;
    // находим в массиве пользователя по id
    for(var i=0; i<tasks.length; i++){
        if(tasks[i].id==id){
            task = tasks[i];
            break;
        }
    }
    // отправляем пользователя
    if(task){
        res.send(task);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/api/tasks", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const taskName = req.body.name;
    const taskDescription = req.body.description;

    if(!taskName){
        res.status(400).send("Имя не может быть пустым")
    }
    if(taskDescription === undefined || taskDescription === null){
        res.status(400).send("Описание не может быть пустым")
    }

    let task = {name: taskName, description: taskDescription};

    let data = fs.readFileSync(filePath, "utf8");
    let tasks = JSON.parse(data);

    // находим максимальный id
    const id = Math.max.apply(Math,tasks.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    task.id = id+1;
    // добавляем пользователя в массив
    tasks.push(task);
    data = JSON.stringify(tasks);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("tasks.json", data);
    res.send(task);
});
// удаление пользователя по id
app.delete("/api/tasks/:id", function(req, res){

    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let tasks = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < tasks.length; i++){
        if(tasks[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const task = tasks.splice(index, 1)[0];
        data = JSON.stringify(tasks);
        fs.writeFileSync("tasks.json", data);
        // отправляем удаленного пользователя
        res.send(task);
    }
    else{
        res.status(404).send("задачи с таким id не существует");
    }
});
// изменение пользователя
app.put("/api/tasks", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    const taskId = req.body.id;
    const taskName = req.body.name;
    const taskDescription = req.body.description;

    let data = fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(data);
    let task;
    for(var i=0; i<tasks.length; i++){
        if(tasks[i].id==taskId){
            task = tasks[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(task){
        task.description = taskDescription;
        task.name = taskName;
        data = JSON.stringify(tasks);
        fs.writeFileSync("tasks.json", data);
        res.send(task);
    }
    else{
        res.status(404).send(task);
    }
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});