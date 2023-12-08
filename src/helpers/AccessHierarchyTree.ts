

export default class AccessHierarchyTree {
    data: any;
    hierarchy;

    constructor(data: any) {
        this.data = data;
        this.hierarchy = this.buildHierarchyTree();
    }

    buildHierarchyTree(parentId: any = null) {
        const tree = [];

        for (const hierarchy of this.data) {
            if (hierarchy.parent_level_id === parentId) {
                const children = this.buildHierarchyTree(hierarchy.hierarchy_id);
                if (children.length) {
                    hierarchy.children = children;
                }
                tree.push(hierarchy);
            }
        }

        return tree;
    }

    getHierarchyTree() {
        return this.hierarchy;
    }
}