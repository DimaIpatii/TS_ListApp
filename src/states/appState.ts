import { Project } from "../utils/project.js";

export enum ProjectStatus {Active, Finished};
export type ListenerFunc = (projects: Project[]) => void;

class AppState {
    private projects: Project[] = [];
    private listeners: ListenerFunc[] = [];
    static instance: AppState;

    static getInstance(){
        if(this.instance){
            return this.instance;
        }else{
            this.instance = new AppState();
            return this.instance;
        }
    }

    constructor(){

    }

    public addNewProject (title: string, description: string, people: number){

        const newProject = new Project(
            String(new Date().getTime()), 
            title,
            description,
            people, 
            ProjectStatus.Active
        );

        this.projects.push(newProject);
        this.updateState();
    }

    public addListener(inputFunction: ListenerFunc){
        this.listeners.push(inputFunction);
    }
     
    public moveListener(projectId: string, newStatus: ProjectStatus){
        const projectToMove = this.projects.find(project => project.id === projectId);
        if(projectToMove && projectToMove.status !== newStatus){
            projectToMove.status = newStatus;
            this.updateState();
        }
    }

    private updateState(){
        for(const listenerFunction of this.listeners){
            listenerFunction(this.projects.slice());
        }
    }

}


export const ProgectAppState = AppState.getInstance();