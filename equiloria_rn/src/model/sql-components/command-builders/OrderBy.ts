export default interface OrderBy {
    column: string
    direction: Direction
}

export enum Direction{
    ASC
    , DSC
}