const BASE_URL = "http://127.0.0.1:8000/tasks/";


let incompleteTaskCount = 0;

function updateItemsLeftCount() {
    const itemsLeftElement = document.getElementById('items-left');
    itemsLeftElement.textContent = `${incompleteTaskCount} ${incompleteTaskCount === 1 ? 'item' : 'items'} left`;
}

const taskList = document.getElementById("taskList");
async function fetchTasks(filter = {}) {
    try {
        const response = await fetch(BASE_URL);
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear the task list

        // Filter tasks based on the provided criteria
        const filteredTasks = tasks.filter(task => {
            if (filter.completed !== undefined) {
                return task.completed === filter.completed;
            }
            return true; // Show all tasks if no filter is provided
        });

        // Reverse the order of tasks
        filteredTasks.reverse();

        // Render the filtered tasks
        filteredTasks.forEach(task => {
            const taskTemplate = renderTasksTemplate(task);
            taskList.insertAdjacentHTML('beforeend', taskTemplate);
            
        });

        // Count incomplete tasks based on the fetched tasks
        incompleteTaskCount = tasks.filter(task => !task.completed).length;
        updateItemsLeftCount();
        return filteredTasks; // Return the filtered tasks

    } catch (error) {
        throw new Error(error);
    }
}

async function createTask(taskText) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: taskText })
        });
        const json = await response.json();
        // Increment the incomplete task count
        incompleteTaskCount++;
        updateItemsLeftCount();
        return json;  

    } catch (error) {
        throw new Error(error);
    } 
}

async function deleteTask(task_id, completed){
    try {
        const response = await fetch(`${BASE_URL}${task_id}`, {
            method: 'DELETE',
        });

        // Decrement the incomplete task count if the deleted task was incomplete
        const task = await fetchTasks(task_id);
        if (!completed) {
            incompleteTaskCount--;
        }
        updateItemsLeftCount();
        
    } catch (error) {
        throw new Error(error);
    } 
}

async function updateTask(task_id, taskText){
    try {
        const response = await fetch(`${BASE_URL}${task_id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskText)
        });
        const json = await response.json();
        
        // Update the incomplete task count based on the task's completion status
        if (json.completed) {
            incompleteTaskCount--;
        }
        updateItemsLeftCount();
        return json;

    } catch (error) {
        throw new Error(error);
    } 
}

async function fetchTask(task_id){
    const response = await fetch(`${BASE_URL}${task_id}/`);
    return await response.json();
    
}




