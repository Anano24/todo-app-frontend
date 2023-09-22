function renderTasksTemplate(task){
    return `
    <div class="task" data-task-id="${task.id}" data-completed="${task.completed ? 'completed' : ''}">
        <label class="checkbox-label" >
            <input class="checkbox-1" type="checkbox" data-action="completed" ${task.completed ? "checked" : ""}>
            <span class="checkmark"></span>
        </label>
        
        ${task.title}
        <button data-action="update" class="update-pan">🖊️</button>
        <img class="delete-img" src="../img/icon-cross.svg" data-action="delete">
        
    </div>
     `;
}
