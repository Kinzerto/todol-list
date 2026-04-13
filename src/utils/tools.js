import { Project } from "../models/Project.js";
import { format, differenceInYears, differenceInCalendarDays, isTomorrow, isToday, isBefore, startOfDay } from "date-fns";

export function createElement(element, className, text, parent) {
    const el = document.createElement(element);
    if (className) el.className = className;
    if (text) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;

}

export function findProjectNameByTaskId(targetId) {
    for (const [projectName, project] of Object.entries(Project.allProjects)) {
        const found = project.showList.some(task => task.id === targetId);
        if (found) {
            return Project.allProjects[projectName]
        }
    }
    return null;
}

export function formatSmartDate(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    const today = new Date();



    if (isToday(date)) {
        return 'Today';
    }

    if (isTomorrow(date)) {
        return 'Tomorrow';
    }

    if (isBefore(startOfDay(date), startOfDay(today))) {
        return 'Overdue'
    }

    const diffDays = differenceInCalendarDays(date, today);
    if (diffDays > 1 && diffDays <= 6) {
        return format(date, 'EEEE'); // Wednesday
    }

    if (differenceInYears(date, today) >= 1) {
        return format(date, 'd MMM yyyy');
    }

    return format(date, 'd MMM');
}