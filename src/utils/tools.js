import { Project } from "../models/Project.js";
export function createElement (element, className, text, parent){
    const el = document.createElement(element);
    if(className) el.className = className;
    if(text) el.textContent = text;
    if(parent) parent.appendChild(el);
    return el;

}

export function findProjectNameByTaskId(targetId) {
    for (const [projectName, project] of Object.entries(Project.allProjects)) {
        const found = project.showList.some(task => task.id === targetId);
        if (found) {
            return project
        }
    }
    return null;
}