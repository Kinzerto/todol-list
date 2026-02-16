import { createElement } from "../utils/createElement.js";

export class Project {
    static #allProjects = {};
    #list = [];
    constructor(name) {
        if(!name || Project.#allProjects[name]) return;
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


export function createProject(element) {
    element.addEventListener('click', (e) => {
        const inp = prompt();
        if (!inp) return;
        const newProject = new Project(inp);
        addFunctionality(newProject);
    });
}
const projectsContainer = document.querySelector('.projects')
const tasks = document.querySelector('.tasks');

function addFunctionality(data) {
    const DOMButtons = createElement('button', data.name, data.name, projectsContainer)
    DOMButtons.addEventListener('click', (e) => {
        const inp = prompt();
        data.addTask(inp)
        displayTasks(data.showList);
        // console.log(data.showList);

        console.log(Project.allProjects);
    })
}


function displayTasks(array) {
    tasks.replaceChildren();
    array.forEach(element => {
        const task = createElement('div', '', element, tasks)
        task.addEventListener('click', () => {
            console.log(array.indexOf(element));
        })
    });

}


