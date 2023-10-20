


export function validateBody(target: any, propertyKey: string, parameterIndex: number) {
    const originalMethod: Record<string, any> = target[propertyKey]

    target[propertyKey] = function (...args: any[]) {
        const paramValue = args[parameterIndex]
        console.log('DECORATOR TESTE!!!!!!')
        for (let key in paramValue) {
            if (paramValue.hasOwnProperty(key)) {

            }
            console.log(key)
        }

        return originalMethod.apply(this, args);
    }
}