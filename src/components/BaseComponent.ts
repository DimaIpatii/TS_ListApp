export default abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement>{
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