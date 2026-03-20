import { createElement } from "../utils/createElement.js";

export class Project {
    static #allProjects = {
    };
    #list = [];
    constructor(name) {
        if (!name || Project.#allProjects[name]) return;
        this.name = name;
        Project.#allProjects[name] = this.#list;
    }

    addProject(name) {
        this.#list[name] = [];
    }

    addTask(task) {
        if (!task) return;
        this.#list.push(task);
    }

    removeTask(taskId) {
        this.#list = this.#list.filter((task) => task.id !== taskId);
        Project.#allProjects[this.name] = this.#list;
    }

    toggleTaskCompletion(taskId) {
        const task = this.#list.find((task) => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
    }

    get showList() {
        return structuredClone(this.#list);
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


// creating project
function createProject(project) {
    if (!project) return;
    const newProject = new Project(project);
    projectDisplay(newProject);
}

//display Projects (DOM)
function projectDisplay(data) {
    const DOMButtons = createElement('button', 'project', '', addedProjects);
    const spanHash = createElement('span', 'hash', '', DOMButtons);
    DOMButtons.append(data.name);

    DOMButtons.addEventListener('click', (e) => {
        tasksDisplay(data);
    });
}

// display tasks
function tasksDisplay(data) {

    tasks.replaceChildren();
    addButton.replaceChildren();
    titleContainer.replaceChildren();

    const title = createElement('div', 'projectTitle', data.name, titleContainer);
    console.log(data);
    //adds a button to add tasks to the project
    createElement('div', 'plusIcon', "\uFF0B", addButton)
    createElement('button', 'addTaskBtn', 'Add Task', addButton).addEventListener('click', () => {
        const title = prompt('Task Title');

        if (!title) return;
        const newTask = new AddTask(title);
        data.addTask(newTask);
        console.log(data);
        tasksDisplay(data);

    });


    console.log(data.showList);
    data.showList.forEach((element, index) => {
        const task = createElement('div', '', element.title, tasks);
        task.addEventListener('click', () => {

            data.toggleTaskCompletion(element.id);
            console.log(Project.allProjects);
            tasksDisplay(data);

        });
    });

}

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

const form = document.getElementById('myForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputNewProject.value;
    createProject(val)
    console.log(val);
    form.reset();

    modal.classList.remove('active');
});
