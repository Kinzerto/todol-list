import { Project } from "../models/Project.js";
import { AddTask } from "../models/Tasks.js";
import { createProject } from "./projectController.js";

export function saveProjects() {
    localStorage.setItem(
        'projects',
        JSON.stringify(Project.allProjects)
    );
}

export function loadProject() {

    const load = localStorage.getItem('projects');
    if (!load) return;
    const data = JSON.parse(load);
    console.log(data);
    Project.clearAll();
    for (const name in data) {
        const project = new Project(name);
        // ();
        data[name].tasks.forEach(task => {
            // project.addTask(Object.values(task));
            project.addTask(
                new AddTask(
                    task.title,
                    task.description,
                    task.dueDate,
                    task.priority,
                    task.completed,
                    task.id
                )
            );

        });

        // project.addTask(new AddTask())
    }

}

console.log(loadProject());