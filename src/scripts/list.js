import { createElement } from "../utils/createElement.js";

export class Project {
    static #allProjects = {};
    #tasks = [];
    constructor(name) {
        if (!name || Project.#allProjects[name]) return;
        this.name = name;
        Project.#allProjects[name] = this;
    }

    addTask(task) {
        if (!task) return;
        this.#tasks.push(task);
        Project.#allProjects[this.name] = this;
    }

    removeTask(taskId) {
        this.#tasks = this.#tasks.filter((task) => task.id !== taskId);
        Project.#allProjects[this.name] = this;
    }

    toggleTaskCompletion(taskId) {
        const task = this.#tasks.find((task) => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
        Project.#allProjects[this.name] = this;
    }

    editTask(taskId, updatedData) {
        const task = this.#tasks.find((task) => task.id === taskId);
        if (task) {
            Object.assign(task, updatedData);
            console.log(task);
            console.log(updatedData);
        }
        Project.#allProjects[this.name] = this;
    }


    get showList() {
        return structuredClone(this.#tasks);
    }

    static get allProjects() {
        return structuredClone(Project.#allProjects);
    }
}

export class AddTask {
    constructor(title, description = '', dueDate = '', priority = '', notes = '', checklist = '') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.completed = false;
        this.id = crypto.randomUUID();
    }
}

// Content and DOM elements
const content = document.querySelector('.content');

const addedProjects = document.querySelector('.addedProjects');
const tasks = document.querySelector('.tasks');
const addButton = document.querySelector('.addButton');
const titleContainer = document.querySelector('.title')

// For adding task(MODAL) elements
const addTaskModalContainer = document.getElementById('addTaskModalContainer');
const cancel = document.getElementById('cancel');
const addTaskForm = document.querySelector('.AddTaskForm');
const inputTitle = addTaskForm.querySelector('input[name="title"]');



// Current project state(to know which project is currently active)
let currentProject = null;

let editingTaskId = null; // Track the task being edited
// creating project
function createProject(name) {
    if (!name) return;
    const newProject = new Project(name);
    // projectDisplay(newProject);

    const DOMButtons = createElement('button', 'project', '', addedProjects);
    const spanHash = createElement('span', 'hash', '', DOMButtons);
    DOMButtons.append(newProject.name);

    DOMButtons.addEventListener('click', () => {
        currentProject = newProject;
        tasksDisplay();
    });
}
// display tasks
function tasksDisplay() {
    if (!currentProject) return;

    tasks.replaceChildren();
    addButton.replaceChildren();
    titleContainer.replaceChildren();
    const title = createElement('div', 'projectTitle', currentProject.name, titleContainer);
    // ADD TASK BUTTON CONTAINER
    const addButtonContainer = createElement('div', 'addButtonContainer', '', addButton);
    //ADD TASK BUTTON
    createElement('div', 'plusIcon', "\uFF0B", addButtonContainer);
    createElement('button', 'addTaskBtn', 'Add Task', addButtonContainer);

    //open modal
    addButtonContainer.addEventListener('click', () => {
        addTaskModalContainer.classList.add('show')
        addButton.classList.add('hideAddButton');
    });
    //close modal
    cancel.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskModalContainer.classList.remove('show');
        addTaskForm.reset();
        addButton.classList.remove('hideAddButton');
        // Reset edit mode
        editingTaskId = null;
        // Reset button text
    });
    //loop through tasks and display them
    currentProject.showList.forEach((task) => {
        if (task.completed === true) return;
        const taskContainer = createElement('div', 'taskContainer', '', tasks);
        const radio = createElement('input', '', '', taskContainer);
        radio.type = 'radio';
        radio.checked = task.completed;
        // add priority class color to radio button based on task priority
        if (task.priority) radio.classList.add(task.priority);
        // task title
        const taskTitle = createElement('div', 'taskTitle', task.title, taskContainer);

        const buttonContainer = createElement('div', 'buttonContainer', '', taskContainer);

        // edit button
        const editBtn = createElement('button', 'editBtn', 'Edit', buttonContainer);
        // delete button
        const deleteBtn = createElement('button', 'deleteBtn', 'Delete', buttonContainer);
        // toggle completed class based on task completion status
        taskTitle.classList.toggle('completed', task.completed);

        //radio button to toggle task completion
        radio.addEventListener('click', () => {
            currentProject.toggleTaskCompletion(task.id);
            // taskTitle.classList.add('completed');
            tasksDisplay();
        });

        // delete a task

        editBtn.addEventListener('click', () => {
            addButton.classList.add('hideAddButton');
            addTaskModalContainer.classList.remove('show');
            addTaskModalContainer.classList.add('edit-modal');
            // addButton.classList.add('hideAddButton');
            // Disable add button while editing
            if (editingTaskId) return; // Prevent multiple edit modals
            // Clone the modal and insert it above the task

            const modalClone = addTaskModalContainer.cloneNode(true);
            modalClone.classList.add('show', 'edit-modal');

            taskContainer.parentNode.insertBefore(modalClone, taskContainer);
            taskContainer.style.display = 'none'; // Hide the task while editing
            // Disable delete button while editing
            // Add a class to style the edit modal differently if needed

            editingTaskId = task.id;  // Set edit mode

            // Populate form with existing task data
            const form = modalClone.querySelector('.AddTaskForm');
            form.elements['title'].value = task.title;
            form.elements['descrip'].value = task.description || '';
            form.elements['date'].value = task.dueDate || '';
            form.elements['priority'].value = task.priority || '';

            // Update modal UI for editing
            form.querySelector('button[type="submit"]').textContent = 'Update';
            // Handle cancel
            const cancelBtn = modalClone.querySelector('#cancel');
            cancelBtn.addEventListener('click', (e) => {
                addButton.classList.remove('hideAddButton');
                e.preventDefault();
                modalClone.remove();
                editingTaskId = null;
                taskContainer.style.display = ''; // Show the task again after canceling
            });

            // Handle form submission for this modal
            form.addEventListener('submit', function (e) {
                addButton.classList.remove('hideAddButton');
                e.preventDefault();
                const formData = new FormData(form);
                const inputData = {
                    title: formData.get("title"),
                    description: formData.get("descrip"),
                    dueDate: formData.get("date"),
                    priority: formData.get("priority")
                };
                if (!inputData.title) return;

                currentProject.editTask(editingTaskId, inputData);
                modalClone.remove();
                tasksDisplay();
                editingTaskId = null;
                taskContainer.style.display = ''; // Show the task again after editing
            });
        });

        deleteBtn.addEventListener('click', () => {
            if(editingTaskId) return; // Prevent deletion while editing
            currentProject.removeTask(task.id);
            tasksDisplay();
            console.log(currentProject);
        });
        console.log(Project.allProjects);
    });
}

createProject('Default');

//MODALS
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.querySelector('.modal-overlay');
const inputNewProject = document.querySelector('#newProject');
const form = document.getElementById('projectForm');


openBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

overlay.addEventListener('click', () => {
    modal.classList.remove('active');
});

// CREATE PROJECT MODAL FORM SUBMISSION
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputNewProject.value;
    createProject(val)
    console.log(val);
    form.reset();

    modal.classList.remove('active');
});

// ADD TASK MODAL FORM SUBMISSION
addTaskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(addTaskForm);
    const inputData = {
        title: formData.get("title"),
        description: formData.get("descrip"),
        date: formData.get("date"),
        priority: formData.get("priority")
    };
    if (!inputData.title) {
        // alert('Please enter a task title.');
        return;
    }

    // Adding mode: create new task
    const newTask = new AddTask(inputData.title, inputData.description, inputData.dueDate, inputData.priority);
    currentProject.addTask(newTask);

    tasksDisplay();
    console.log(currentProject); // ✅ collected data 
    addTaskModalContainer.classList.remove('show');
    addTaskForm.reset();
    addButton.classList.remove('hideAddButton');
});
