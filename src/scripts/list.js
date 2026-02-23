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
        this.#list[this.name] = this.#list[this.name].filter(task => task.id !== taskId);
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

const addedProjects = document.querySelector('.addedProjects');
const tasks = document.querySelector('.tasks');
tasks.textContent = 'mdwdomwd';

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
        // const inp = prompt();
        // data.addTask(inp);

        
        displayTasks(data.showList);
        console.log(Project.allProjects);
    })
}


function displayTasks(array) {
    tasks.replaceChildren();
    //adds a button to add tasks to the project
    createElement('button', 'addTaskBtn', 'Add Task', tasks).addEventListener('click', () => {
        const title = prompt('Task Title');
        if (!title) return;
        const newTask = new AddTask(title);
        array.push(newTask);
        console.log(array);
        displayTasks(array);
        
    });
    array.forEach(element => {
        const task = createElement('div', '', element.title, tasks);
        task.addEventListener('click', () => {
            console.log(array.indexOf(element));
        });
    });

}


