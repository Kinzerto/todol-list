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

// DOM Elements
const content = document.querySelector('.content');
const addedProjects = document.querySelector('.addedProjects');
const tasks = document.querySelector('.tasks');
const addButton = document.querySelector('.addButton');
const titleContainer = document.querySelector('.title')

// For adding task(MODAL)
const addTaskModalContainer = document.getElementById('addTaskModalContainer');
const cancel = document.getElementById('cancel');
const addTaskForm = document.querySelector('.AddTaskForm');

let currentProject = null;
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
    });

    currentProject.showList.forEach((task) => {
        const taskElement = createElement('div', '', task.title, tasks);
        taskElement.addEventListener('click', () => {
            currentProject.toggleTaskCompletion(task.id);
            console.log(currentProject.showList);
            tasksDisplay();
        });
    });
}

createProject('Default');

//MODALS
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.querySelector('.modal-overlay');
const inputNewProject = document.querySelector('#newProject');


openBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

overlay.addEventListener('click', () => {
    modal.classList.remove('active');
});

const form = document.getElementById('projectForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputNewProject.value;
    createProject(val)
    console.log(val);
    form.reset();

    modal.classList.remove('active');
});

// ADD TASK MODAL
addTaskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(addTaskForm);
    const inputData = {
        title: formData.get("title"),
        description: formData.get("descrip"),
        date: formData.get("date"),
        priority: formData.get("priority")
    };
    if (!inputData.title) return;
    const newTask = new AddTask(inputData.title, inputData.description, inputData.date, inputData.priority);
    currentProject.addTask(newTask);
    tasksDisplay();
    console.log(currentProject); // ✅ collected data 
    addTaskModalContainer.classList.remove('show');
    addTaskForm.reset();
    addButton.classList.remove('hideAddButton');
});