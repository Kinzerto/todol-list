import { createElement } from "../utils/createElement.js";

export class Project {
    static #allProjects = {};
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


export function createProject(element) {
    element.addEventListener('click', (e) => {
        const inp = prompt();
        if (!inp) return;
        const newProject = new Project(inp);
        displayProject(newProject);
    });
}

function displayProject(data) {

    const DOMButtons = createElement('button', 'project', '', addedProjects);
    const spanHash = createElement('span', 'hash', '', DOMButtons);
    DOMButtons.append(data.name);

    DOMButtons.addEventListener('click', (e) => {
        displayTasks(data);
    });
}


function displayTasks(array) {
    tasks.replaceChildren();
    addButton.replaceChildren();
    console.log(array);
    //adds a button to add tasks to the project
    createElement('button', 'addTaskBtn', 'Add Task', addButton).addEventListener('click', () => {
        const title = prompt('Task Title');

        if (!title) return;
        const newTask = new AddTask(title);
        array.addTask(newTask);
        console.log(array);
        displayTasks(array);

    });


    console.log(array.showList);
    array.showList.forEach((element, index) => {
        const task = createElement('div', '', element.title, tasks);
        task.addEventListener('click', () => {

            array.toggleTaskCompletion(element.id);
            console.log(Project.allProjects);
            displayTasks(array);

        });
    });

}


