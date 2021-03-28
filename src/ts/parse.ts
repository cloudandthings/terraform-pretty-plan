function equal(a: any, b: any): boolean {
    if (a === b) return true;
  
    if (a && b && typeof a == 'object' && typeof b == 'object') {
      if (a.constructor !== b.constructor) return false;
  
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (!equal(a[i], b[i])) return false;
        return true;
      }
  
  
      if ((a instanceof Map) && (b instanceof Map)) {
        if (a.size !== b.size) return false;
        for (i of a.entries())
          if (!b.has(i[0])) return false;
        for (i of a.entries())
          if (!equal(i[1], b.get(i[0]))) return false;
        return true;
      }
  
      if ((a instanceof Set) && (b instanceof Set)) {
        if (a.size !== b.size) return false;
        for (i of a.entries())
          if (!b.has(i[0])) return false;
        return true;
      }
  
      if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.byteLength;
        if (length != b.byteLength) return false;
        for (i = length; i-- !== 0;)
          if (a[i] !== b[i]) return false;
        return true;
      }
  
  
      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
  
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;
  
      for (i = length; i-- !== 0;)
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
  
      for (i = length; i-- !== 0;) {
        var key = keys[i];
  
        if (!equal(a[key], b[key])) return false;
      }
  
      return true;
    }
  
    // true if both NaN, false otherwise
    return a!==a && b!==b;
  };


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

    var planJson = JSON.parse(terraformPlan.trim());
    var resourceChanges = planJson.resource_changes;

    let removeNop = resourceChanges.filter(resource => !resource.change.actions.includes("no-op"));

    let actions: Action[] = removeNop.map( resource => {
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

    let propsBefore = changes.before ? Object.keys(changes.before) : [];
    let propsAfter = changes.after ? Object.keys(changes.after) : [];
    let propsAfterUnknown = changes.after ? Object.keys(changes.after_unknown) : [];

    let propsAllObj =  propsBefore.concat(propsAfter).concat(propsAfterUnknown).reduce( (acc, property) => {
        acc[property] = {property, old: null, new: null, forcesNewResource: ""};
        return acc;
    }, {});

    const propsAllArr = Object.keys(propsAllObj).map((key) => propsAllObj[key]);

    let props = propsAllArr.reduce((acc, property) => {

        property.old = changes.before ? ( changes.before[property.property] ? changes.before[property.property] : null) : null;
        property.new = changes.after ? ( changes.after[property.property] ? changes.after[property.property] : null) : null;
        property.new = changes.after_unknown ? ( property.new ? property.new : ( changes.after_unknown[property.property] ? '<computed>' : property.new ) ) : property.new;

        if (!equal(property.old,property.new)) acc.push(property);

        return acc;

    }, []);

    return props;
}