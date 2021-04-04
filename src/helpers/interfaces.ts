export interface RawResource {
    address: string;
    name: string;
    type: string;
    index: any
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
}

export interface ResourceId {
    name: string;
    type: string;
    prefixes: string[];
    index: string | null;
    address: string;
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

export interface Action {
    id: ResourceId;
    type: ChangeType;
    changes: Diff[];
}

export interface Plan {
    warnings: Warning[];
    actions: Action[];    
}
