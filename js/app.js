fetchTasks();

const addTaskForm = document.getElementById('add-task-form');
const taskLists = document.getElementById('taskList');
const taskInput = document.getElementById("taskInput");
const allTab = document.querySelector(".all");
const activeTab = document.querySelector(".active");
const completedTab = document.querySelector(".completed");
const leftItem = document.querySelector(".leftItem");
const clearCompleted = document.querySelector(".clearCompleted");



taskInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of adding a newline
        const taskText = taskInput.value.trim();

        if (taskText) {
            // Add the task to the list
            const listItem = document.createElement('div');
            listItem.textContent = taskText;
            listItem.className = "task";
            
            // Clear the input field
            taskInput.value = '';

            await createTask(taskText);
            fetchTasks();
            //taskList.insertBefore(listItem, taskList.firstChild); // Add at the top
        }
    }   
});


taskLists.addEventListener('click', async (e) => {
    if (e.target.classList.contains('checkbox-1')) {
        const div = e.target.closest('div');
        const task_id = div.getAttribute('data-task-id');
        const task = await fetchTask(task_id);
        await updateTask(task_id, { ...task, completed: !task.completed });
        fetchTasks();
    } else if (e.target.nodeName === "BUTTON" || e.target.nodeName === "IMG") {
        const action = e.target.getAttribute('data-action');
        // Inside your event listener for the "completed" action
        if (action === "completed") {
            const div = e.target.parentNode;
            const task_id = div.getAttribute("data-task-id");
            const task = await fetchTask(task_id);
            await updateTask(task_id, { ...task, completed: !task.completed });
            
            fetchTasks(); // Refresh the task list
        } else if (action === "delete") {
            const div = e.target.parentNode;
            const task_id = div.getAttribute("data-task-id");
            await deleteTask(task_id);
            fetchTasks();
            
        } else if (action === "update") {
            const div = e.target.parentNode;
            const task_id = div.getAttribute("data-task-id");
            const task = await fetchTask(task_id);
            // Prompt the user for the updated task text or make changes programmatically.
            const updatedTaskText = prompt("Update task:", task.title);
            
            if (updatedTaskText !== null) {
                task.title = updatedTaskText;
                await updateTask(task_id, task); // Send updated data to the server.
                fetchTasks(); // Re-fetch tasks from the server (or update the task in the UI directly).
            }
        }  
   }
});


clearCompleted.addEventListener('click', async () => {
    const completedTasks = document.querySelectorAll('.task[data-completed="completed"]');
    
    for (const task of completedTasks) {
        const task_id = task.getAttribute('data-task-id');
        await deleteTask(task_id, true); // Pass true for completed tasks
    }
    fetchTasks(); // Update the task list and "Items left" count
});


allTab.addEventListener("click",  function () {
    fetchTasks();
});

activeTab.addEventListener("click",  function () {
    fetchTasks({ completed: false });
});

completedTab.addEventListener("click",  function () {
    fetchTasks({ completed: true });
    
});

