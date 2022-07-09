import { Project } from "../utils/project.js";
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
;
class AppState {
    constructor() {
        this.projects = [];
        this.listeners = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new AppState();
            return this.instance;
        }
    }
    addNewProject(title, description, people) {
        const newProject = new Project(String(new Date().getTime()), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateState();
    }
    addListener(inputFunction) {
        this.listeners.push(inputFunction);
    }
    moveListener(projectId, newStatus) {
        const projectToMove = this.projects.find(project => project.id === projectId);
        if (projectToMove && projectToMove.status !== newStatus) {
            projectToMove.status = newStatus;
            this.updateState();
        }
    }
    updateState() {
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}
export const ProgectAppState = AppState.getInstance();
