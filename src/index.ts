const autobind = (
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
) => {

    const tragetMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            return tragetMethod.bind(this);
        }
    }
    
    return adjustedDescriptor;
}

interface Dragable{
    dragStart(event: DragEvent): void,
    dragEnd(event: DragEvent): void
}

interface Droppable{
    dragOver(event: DragEvent): void,
    dragLeave(event: DragEvent): void,
    dropHandler(event: DragEvent): void
    
}

enum ProjectStatus {Active, Finished};

class Project {
    constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
    ){

    }
}

type ListenerFunc = (projects: Project[]) => void;

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


const ProgectAppState = AppState.getInstance();


abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement>{
    rootElement: T;
    templateEmelent: HTMLTemplateElement;
    templateInnerEmelent: U;

    constructor(templateElementId: string, rootElementId: string, insertPosition: InsertPosition, templateElementInnerId?: string, ){
        this.rootElement = document.getElementById(rootElementId)! as T;
        this.templateEmelent = document.getElementById(templateElementId)! as HTMLTemplateElement;

        const templateContentNode = document.importNode(this.templateEmelent.content,true);
        this.templateInnerEmelent = templateContentNode.firstElementChild as U;

        if(templateElementInnerId){
            this.templateInnerEmelent.id = templateElementInnerId;
        }

        this.rederComponent(insertPosition);
    }

    private rederComponent(insertPosition: InsertPosition){
        this.rootElement.insertAdjacentElement(insertPosition, this.templateInnerEmelent);
    }

    abstract configApp(): void;
    abstract renderContent(): void;
}

class AppForm extends BaseComponent<HTMLDivElement, HTMLFormElement>{
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;
    
    constructor(){
        super("project-input", "app", "afterbegin", "user-input");
        this.titleInput =  this.templateInnerEmelent.querySelector("#title") as HTMLInputElement;
        this.descriptionInput =  this.templateInnerEmelent.querySelector("#description") as HTMLInputElement;
        this.peopleInput =  this.templateInnerEmelent.querySelector("#people") as HTMLInputElement;

        this.configApp();
    }

    configApp(){
        this.templateInnerEmelent.addEventListener("submit", this.onSubmit);
    }

    renderContent(){}


    private checkFields (): [string, string, number] | void{
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const peopleNumber = Number(this.peopleInput.value);
        const titleMessage = document.querySelector("#title-message") as HTMLParagraphElement;
        const descriptionMessage = document.querySelector("#description-message") as HTMLParagraphElement;
        const peopleNumberMessage = document.querySelector("#people-message") as HTMLParagraphElement;

        
        if(title.trim().length === 0){
            titleMessage.style.color = "red";
            titleMessage.textContent = "A title must be provided!";
        }else{
            titleMessage.textContent = "";
        }

        if(description.trim().length === 0){
            descriptionMessage.style.color = "red";
            descriptionMessage.textContent = "A Description must be provided!";
        }else{
            descriptionMessage.textContent = "";
        }

        if((isNaN(peopleNumber) || peopleNumber === 0)){
            peopleNumberMessage
            peopleNumberMessage.style.color = "red";

            if(isNaN(peopleNumber)){
                peopleNumberMessage.textContent = "A number must be provided!";
            }else if(peopleNumber === 0){
                peopleNumberMessage.textContent = "A number must be bigger than 0!";
            }
        }else{
            peopleNumberMessage.textContent = "";
        }

        if(title.trim().length === 0 || description.trim().length === 0 || (isNaN(peopleNumber) || peopleNumber === 0)){
            
            return
        }else{
            return [title, description, peopleNumber]
        }
    };

    private clearFileds () {
        this.titleInput.value = "";
        this.descriptionInput.value = "";
        this.peopleInput.value = "";
    }

    @autobind
    private onSubmit(event: Event){
        event.preventDefault();
        const allFieldsValid = this.checkFields();

        if(Array.isArray(allFieldsValid)){
            console.log("Submit the values: ", allFieldsValid);
            const [title, description, people] = allFieldsValid;
            ProgectAppState.addNewProject(title, description, people);

            this.clearFileds()
        }
    }
}

class ListItem extends  BaseComponent<HTMLDivElement, HTMLElement> implements Dragable {
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

class AppList extends BaseComponent<HTMLDivElement, HTMLElement> implements Droppable{
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


const appForm = new AppForm();
const appActiveList = new AppList("active");
const appFinishedList = new AppList("finished");