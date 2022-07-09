export const autobind = (_target, _methodName, descriptor) => {
    const tragetMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            return tragetMethod.bind(this);
        }
    };
    return adjustedDescriptor;
};
