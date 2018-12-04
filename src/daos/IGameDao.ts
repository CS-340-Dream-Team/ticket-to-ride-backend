export interface IGameDao{
    saveGame(id:number):void
    getGame(id:number):JSON
}