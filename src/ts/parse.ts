import * as diff from "../../node_modules/jest-diff/build/index";

export interface RawResource {
    address: string;
    name: string;
    type: string;
}

export interface RawChanges {
    actions: string[];
    before?: any;
    after?: any;
    after_unknown?:any;
}

export interface Diff {
    property: string;
    old?: string;
    new: string;
    forcesNewResource?: string;
}

export interface ResourceId {
    name: string;
    type: string;
    prefixes: string[];
}
export interface Warning {
    id: ResourceId;
    detail: string;
}
export enum ChangeType {
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Destroy = 'destroy',
    Recreate = 'recreate',
    Unknown = 'unknown'
}
export interface Diff {
    property: string;
    old?: string;
    new: string;
    forcesNewResource?: string;
}
export interface Action {
    id: ResourceId;
    type: ChangeType;
    changes: Diff[];
}
export interface Plan {
    warnings: Warning[];
    actions: Action[];    
}

export function parse(terraformPlan: string): Plan {

    var planJson = JSON.parse(terraformPlan);
    var resourceChanges = planJson.resource_changes;

    let actions: Action[] = resourceChanges.map( resource => {
        let id:ResourceId = parseId(resource);

        let type:ChangeType = parseChangeType(resource.change.actions);

        let changes:Diff[] = parseChanges(resource.change);

        return { id, type, changes };
    });

    var plan = { warnings: [], actions };

    console.log(plan)

    return plan;
}

export function parseChangeType(changes: string[]): ChangeType {

    if (changes.includes("no-op")) return ChangeType.Unknown;
    if (changes.includes("read")) return ChangeType.Read;
    if (changes.includes("update")) return ChangeType.Update;

    if (changes.includes("create") && changes.includes("delete")) return ChangeType.Recreate;

    if (changes.includes("create")) return ChangeType.Create;
    if (changes.includes("delete")) return ChangeType.Destroy;
}

export function parseId(resource: RawResource): ResourceId {

    var idSegments = resource.address.split('.');
    var resourcePrefixes = idSegments.slice(0, idSegments.length - 2);

    return { name: resource.name, type: resource.type, prefixes: resourcePrefixes };
}

export function parseChanges(changes: RawChanges): Diff[] {

    let props = {};

    if (changes.before) {
        for (const prop in changes.before) {
            
            if (!props[prop]) {
                props[prop] = {property:prop, old:""}
            }

            props[prop].old = changes.before[prop];
        }
    }

    if (changes.after) {
        for (const prop in changes.after) {
            
            if (!changes.after[prop]) {
                continue;
            }

            if (!props[prop]) {
                props[prop] = {property:prop, new: ""}
            }

            props[prop].new = changes.after[prop];
        }
    }

    if (changes.after_unknown) {
        for (const prop in changes.after_unknown) {
            
            if (!props[prop]) {
                props[prop] = {property:prop, new: ""}
            }

            props[prop].new = changes.after_unknown[prop] ? '<computed>': null;
        }
    }


    return Object.keys(props).map((key) => props[key]);
}