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
const container2 = document.querySelector('.container2');

const addTaskModalContainer = document.getElementById('addTaskModalContainer');
const cancel = document.getElementById('cancel');
const addTaskForm = document.querySelector('.AddTaskForm');


// creating project
function createProject(project) {
    if (!project) return;
    const newProject = new Project(project);
    // projectDisplay(newProject);

    const DOMButtons = createElement('button', 'project', '', addedProjects);
    const spanHash = createElement('span', 'hash', '', DOMButtons);
    DOMButtons.append(newProject.name);

    DOMButtons.addEventListener('click', () => {
        const currentProject = newProject;
        tasksDisplay(currentProject);
    });
}

// display tasks
function tasksDisplay(currentProject) {
    tasks.replaceChildren();
    addButton.replaceChildren();
    titleContainer.replaceChildren();
    const title = createElement('div', 'projectTitle', currentProject.name, titleContainer);
    console.log(currentProject);
    // ADD TASK BUTTON CONTAINER
    const addButtonContainer = createElement('div', 'addButtonContainer', '', addButton);
    //ADD TASK BUTTON
    createElement('div', 'plusIcon', "\uFF0B", addButtonContainer);
    createElement('button', 'addTaskBtn', 'Add Task', addButtonContainer);

    //open modal
    addButtonContainer.addEventListener('click', () => {
        addTaskModalContainer.classList.add('show')
    });
    // form
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
        tasksDisplay(currentProject);
        console.log(currentProject); // ✅ collected data 
        addTaskModalContainer.classList.remove('show');
        addTaskForm.reset();
    });
    //close modal
    cancel.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskModalContainer.classList.remove('show');
        addTaskForm.reset();
    });
    //submit modal inputs


    // addButtonContainer.addEventListener('click', () => {
    //     const title = prompt('Task Title');

    //     if (!title) return;
    //     const newTask = new AddTask(title);
    //     data.addTask(newTask);
    //     console.log(data);
    //     tasksDisplay(data);
    // });

    console.log(currentProject.showList);
    currentProject.showList.forEach((element, index) => {
        const task = createElement('div', '', element.title, tasks);
        task.addEventListener('click', () => {

            currentProject.toggleTaskCompletion(element.id);
            console.log(Project.allProjects);
            tasksDisplay(currentProject);

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

// modal 2