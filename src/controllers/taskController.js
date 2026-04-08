import { AddTask } from "../models/Tasks.js"
import { state } from "../state.js";
import { tasks, addButton } from '../index.js';
import { renderTasks } from "../viewer/renderTasks.js";

const addTaskModalContainer = document.getElementById('addTaskModalContainer');
const cancel = document.getElementById('cancel');
const addTaskForm = document.querySelector('.AddTaskForm');
const inputTitle = addTaskForm.querySelector('input[name="title"]');

export function tasksDisplay() {
    if (!state.currentProject) return;
    state.currentView = 'project';
    tasks.replaceChildren();
    addButton.replaceChildren();

    renderTasks()
}

// MODAL FOR ADD TASK  FORM SUBMISSION
addTaskForm.addEventListener('submit', function (e) {

    e.preventDefault();
    const formData = new FormData(addTaskForm);
    const inputData = {
        title: formData.get("title"),
        description: formData.get("descrip"),
        dueDate: formData.get("date"),
        priority: formData.get("priority")
    };
    if (!inputData.title) {
        // alert('Please enter a task title.');
        return;
    }

    // Adding mode: create new task
    const newTask = new AddTask(inputData.title, inputData.description, inputData.dueDate, inputData.priority);
    state.currentProject.addTask(newTask);

    tasksDisplay();
    addTaskModalContainer.classList.remove('show');
    addTaskForm.reset();
    addButton.classList.remove('hideAddButton');
});

// Cancel button in Add Task Modal
cancel.addEventListener('click', (e) => {
    e.preventDefault();
    addTaskModalContainer.classList.remove('show');
    addTaskForm.reset();
    addButton.classList.remove('hideAddButton');
});
