import {Project} from '../utils/project.js';
import BaseComponent from './BaseComponent.js';
import { Droppable } from '../interfaces/Drag&Drop.js';
import { autobind } from '../utils/autobind.js';
import { ProgectAppState,ProjectStatus } from '../states/appState.js';
import ListItem from './ListItem.js';


export default class AppList extends BaseComponent<HTMLDivElement, HTMLElement> implements Droppable{
    assignedProjects: Project[];

    constructor(private state: "active" | "finished"){
        super("project-list", "app", "beforeend", `${state}-projects`);
        this.assignedProjects = [];

        this.configApp()
        this.renderListContent();
    }

    private renderListItems(){
        const listElem = this.templateInnerEmelent.querySelector("ul") as HTMLUListElement;
        listElem.innerHTML = "";

        for(const project of this.assignedProjects){
            new ListItem(listElem.id, project);
        }
    }

    private renderListContent(){
        const listCaption = this.templateInnerEmelent.querySelector("h2") as HTMLHeadingElement;
        const listContainer = this.templateInnerEmelent.querySelector("ul") as HTMLUListElement;

        listCaption.textContent = `${this.state.toUpperCase()} - PROJECT`
        listContainer.id = `${this.state}-projects-list`;
    }

    configApp(): void {
        this.templateInnerEmelent.addEventListener("dragover", this.dragOver)
        this.templateInnerEmelent.addEventListener("dragleave", this.dragLeave)
        this.templateInnerEmelent.addEventListener("drop", this.dropHandler)
        
        ProgectAppState.addListener((propjects) => {
            const relativeProjects = propjects.filter(project => {
                if(this.state === "active"){
                    return project.status === ProjectStatus.Active;
                }else{
                    return project.status === ProjectStatus.Finished;
                }
            })
            this.assignedProjects = relativeProjects;
            this.renderListItems();
        });
    }
    renderContent(): void {}

    @autobind
    dragOver(event: DragEvent): void {

        if(event.dataTransfer && event.dataTransfer.types[0] === "text/plain"){
            event.preventDefault()
            const listContainer = this.templateInnerEmelent.querySelector("ul")!;
            listContainer.classList.add('droppable'); 
        }
        
    }

    @autobind
    dragLeave(event: DragEvent): void {
        const listContainer = this.templateInnerEmelent.querySelector("ul");
        listContainer?.classList.remove("droppable"); 
        //console.log("Drag leav", event);
    }

    @autobind
    dropHandler(event: DragEvent): void {
        console.log("Drop", event);
        const projectToMoveId = event.dataTransfer?.getData("text/plain");
        if(projectToMoveId){
            ProgectAppState.moveListener(projectToMoveId, this.state === "active" ? ProjectStatus.Active : ProjectStatus.Finished)
        }
        
    }
}