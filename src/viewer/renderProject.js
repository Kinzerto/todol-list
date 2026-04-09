import { createElement } from "../utils/tools.js";
import { Project } from "../models/Project.js";
import { tasksDisplay } from "../controllers/taskController.js";
import { state } from "../state.js";
import { filterTask } from "../controllers/filterTaskController.js";
import { addedProjects } from "../controllers/projectController.js";

export function renderProject(newProject) {
    console.log(newProject);
    const DOMButtons = createElement('button', 'project', '', addedProjects);

    DOMButtons.dataset.projName = newProject.name;

    const spanHash = createElement('span', 'hash', '#', DOMButtons);

    const projName = createElement('span', 'projName', newProject.name, DOMButtons);

    //Container for Edit and delete
    const editDelete = document.createElement('span');
    editDelete.classList.add('editDelete')
    DOMButtons.append(editDelete)

    const editIcon = createElement('span', 'material-symbols-outlined', 'edit', editDelete);

    const deleteIcon = createElement('span', 'material-symbols-outlined', 'delete', editDelete);

    editIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(newProject.name);
        console.log(Project.allProjects);
    });

    deleteIcon.addEventListener('click', (e) => {
        console.log('click');
        e.stopPropagation();
        Project.removeProject(newProject.name);
        state.currentView = 'allTasks';
        filterTask()
        DOMButtons.remove();
        console.log(Project.allProjects);

    })

    DOMButtons.addEventListener('click', () => {
        state.currentProject = newProject
        tasksDisplay();
    });
}