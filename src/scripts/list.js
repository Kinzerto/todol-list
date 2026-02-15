export class Project {
    static #allProjects = [];
    #list = {};
    constructor(name = 'default') {
        this.#list[name] = [];
        this.name = name;
        Project.#allProjects.push(this);
    }

    addProject(name) {
        this.#list[name] = [];
    }

    addTask(task) {
        this.#list[this.name].push(task);
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
    constructor(title, description, dueDate, priority, notes, checklist) {
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

// const task1 = new Project('Home Task');
// const task2 = new Project('School Task');

// task1.addTask(new AddTask('Clean Room', 'Clean the entire room', '2024-07-01', 'High', 'Use the new cleaning supplies', ['Vacuum', 'Dust', 'Mop']), 'Home Task');
// task1.addTask(new AddTask('Grocery Shopping', 'Buy groceries for the week', '2024-07-03', 'Medium', 'Make a list of needed items', ['Milk', 'Bread', 'Eggs']), 'Home Task');
// task2.addTask(new AddTask('Finish Homework', 'Complete all math problems', '2024-07-02', 'Medium', 'Focus on the difficult problems first', ['Problem 1', 'Problem 2', 'Problem 3']), 'School Task');

// console.log(task1.showList[0]);

