import { Project } from "../models/Project.js";
import { compareAsc, isToday } from "date-fns";

export const count = document.querySelectorAll('.primaryButton button .count');
// let current = null;
export function countData() {
    count.forEach((cn) => {
        // console.log(cn.classList[0]);
        // cn.replaceChildren()
        switch (cn.classList[0]) {
            case 'homeCount':
                cn.textContent = countFilter('homeCount')
                break;

            case 'todayCount':
                cn.textContent = countFilter('todayCount')
                cn.style.color = 'red';
                break;

            case 'upcomingCount':
                cn.textContent = countFilter('upcomingCount')
                break;

            case 'importantCount':
                cn.textContent = countFilter('importantCount')
                break;

            case 'completedCount':
                cn.textContent = countFilter('completedCount')
                break;

            default:
                break;
        }
    });
}

function countFilter(current) {
    const projects = Project.allProjects;
    let filtered = null;
    let combined = [];
    let num = 0
    for (const [projectName, project] of Object.entries(projects)) {
        // ✅ filter ONLY this project's completed tasks
        if (current === 'completedCount') {
            filtered = project.showList.filter(task => task.completed);

        } else if (current === 'importantCount') {
            filtered = project.showList.filter(task => task.priority === 'high' && !task.completed);

        } else if (current === 'homeCount') {
            filtered = project.showList.filter(task => !task.completed);

        } else if (current === 'todayCount') {
            filtered = project.showList.filter((task) => {
                // console.log(task.due);
                return !task.completed && task.dueDate && isToday(new Date(task.dueDate));
            });

        } else if (current === 'upcomingCount') {
            filtered = project.showList
                .filter(task => !task.completed && task.dueDate && !isToday(new Date(task.dueDate)))
                .sort((a, b) => compareAsc(new Date(a.dueDate), new Date(b.dueDate)));
        }

        num += filtered.length;
    }

    return num === 0 ? '' : num
}