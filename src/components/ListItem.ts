import { Project } from "../utils/project.js";
import BaseComponent from "./BaseComponent.js";
import { Dragable } from "../interfaces/Drag&Drop.js";
import { autobind } from "../utils/autobind.js";

export default class ListItem extends  BaseComponent<HTMLDivElement, HTMLElement> implements Dragable {
    private project: Project;

    get persones (){
        if(this.project.people === 1){
            return "1 person";
        }else{
            return `${this.project.people} persones`
        }
    }

    constructor(rootId: string, project: Project){
        super("single-project", rootId, "afterbegin", project.id );
        this.project = project;

        this.configApp();
        this.renderContent();
    };

    configApp(): void {
        this.templateInnerEmelent.addEventListener("dragstart", this.dragStart);
        this.templateInnerEmelent.addEventListener("dragend", this.dragEnd);
    }

    renderContent(): void {
        this.templateInnerEmelent.querySelector("h2")!.textContent = this.project.title;
        this.templateInnerEmelent.querySelector("h3")!.textContent = this.persones + " assigned";
        this.templateInnerEmelent.querySelector("p")!.textContent = this.project.description;
    }

    @autobind
    dragStart(event: DragEvent): void {
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";

        console.log("Start drag", event);
    }

    @autobind
    dragEnd(event: DragEvent): void {
        console.log("Drag end", event);
    }

}