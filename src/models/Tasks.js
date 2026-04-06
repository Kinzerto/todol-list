export class AddTask {
    constructor(title, description = '', dueDate = '', priority = '', completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        // this.notes = notes;
        // this.checklist = checklist;
        this.id = crypto.randomUUID();
    }
}