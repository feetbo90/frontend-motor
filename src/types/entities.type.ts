export interface Entities {
    id:          string;
    name:        string;
    entity_type: EntityType;
    parent_id:   null | string;
    created_at:  Date;
    updated_at:  Date;
    version:     number;
    is_active:   boolean;
    units?:      Entities[];
    parent?:     Entities | null;
}

export enum EntityType {
    Cabang = "CABANG",
    Unit = "UNIT",
}

export interface CabangResponse {
    message: string;
    data: Entities[];
}
