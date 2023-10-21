class DependencyContainer {
    private dependencies: { [key: string]: any } = {};

    // Registrar uma dependência
    register(key: string, dependency: any) {
        this.dependencies[key] = dependency;
    }

    // Registrar várias dependências uma única vez
    registerAll(dependencies: { [key: string]: any }) {
        for (const key in dependencies) {
            this.register(key, dependencies[key]);
        }
    }

    // Obter uma dependência registrada
    resolve<T>(key: string): T | null {
        if (key in this.dependencies) {
            return this.dependencies[key];
        }
        return null;
    }
}


export default DependencyContainer