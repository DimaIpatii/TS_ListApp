export const autobind = (
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