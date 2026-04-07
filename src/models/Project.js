export class Project {
    static #allProjects = {};
    #tasks = [];
    constructor(name) {
        if (!name || Project.#allProjects[name]) return;
        this.name = name;
        Project.#allProjects[name] = this;
    }
    removeProject(projectName) {
        if (Project.#allProjects[projectName]) {
            delete Project.#allProjects[projectName];
        }
    }
    
    addTask(task) {
        if (!task) return;
        this.#tasks.push(task);
    }

    removeTask(taskId) {
        this.#tasks = this.#tasks.filter((task) => task.id !== taskId);
    }

    toggleTaskCompletion(taskId) {
        const task = this.#tasks.find((task) => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
    }

    editTask(taskId, updatedData) {
        const task = this.#tasks.find((task) => task.id === taskId);
        if (task) {
            Object.assign(task, updatedData);
        }
    }

    get showList() {
        return this.#tasks;
    }

    static get allProjects() {
        return Project.#allProjects;
    }
}