
export class Project {
    static #allProjects = {};
    #tasks = [];
    constructor(name) {
        if (!name) throw new Error('Project name required');
        if (Project.#allProjects[name]) {
            throw new Error('Project already exists');
        }

        this.name = name;
        Project.#allProjects[name] = this;
    }

    static removeProject(projectName) {
        if (Project.#allProjects[projectName]) {
            delete Project.#allProjects[projectName];
        }
    }
    static addTask(projectName, task) {
        if (!projectName || !task) return false;

        const project = Project.#allProjects[projectName];
        if (!project) {
            console.error(`Project "${projectName}" not found`);
            return false;
        }

        project.#tasks.push(task);
        return true;
    }

    addTask(task) {
        if (!task) return;
        const exists = this.#tasks.some(t => t.title === task.title);
        if (exists) {
            console.warn('Task with same title already exists');
            return;
        }
        this.#tasks.push(task);
    }

    removeTask(taskId) {
        const index = this.#tasks.findIndex(task => task.id === taskId);
        if (index === -1) return null;

        const [task] = this.#tasks.splice(index, 1);
        console.log(task);
        return task;

    }

    moveTask(taskId, fromName, toName, updatedData) {
        const from = Project.allProjects[fromName];
        const to = Project.allProjects[toName];

        if (!from || !to) return;

        const task = from.removeTask(taskId);
        if (!task) return;

        to.addTask(task);
        to.editTask(taskId, updatedData)
    }

    toggleTaskCompletion(taskId) {
        const task = this.#tasks.find((task) => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
    }

    editTask(taskId, updatedData) {
        const task = this.#tasks.find((task) => task.id === taskId);
        console.log(updatedData);
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