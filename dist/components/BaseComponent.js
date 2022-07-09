export default class BaseComponent {
    constructor(templateElementId, rootElementId, insertPosition, templateElementInnerId) {
        this.rootElement = document.getElementById(rootElementId);
        this.templateEmelent = document.getElementById(templateElementId);
        const templateContentNode = document.importNode(this.templateEmelent.content, true);
        this.templateInnerEmelent = templateContentNode.firstElementChild;
        if (templateElementInnerId) {
            this.templateInnerEmelent.id = templateElementInnerId;
        }
        this.rederComponent(insertPosition);
    }
    rederComponent(insertPosition) {
        this.rootElement.insertAdjacentElement(insertPosition, this.templateInnerEmelent);
    }
}
