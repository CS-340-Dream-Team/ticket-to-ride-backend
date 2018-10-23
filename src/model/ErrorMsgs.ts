export enum ErrorMsgs{
    DATA_DOES_NOT_EXIST = "Could not send map data",
    GAME_ALREADY_EXISTS = "Game with this name already exists.",
    GAME_DOES_NOT_EXIST = "Game does not exist.",
    GAMENAME_UNDEFINED ="Game name is undefined.",
    INVALID_AUTHORIZATION = "Invalid authorization.",
    NO_AUTHORIZATION = "No authorization provided.",
    NOT_ENOUGH_PLAYERS = "Not Enough Players.",
    NOT_HOST = "Not Host",
    PLAYER_ALREADY_IN_GAME = "Player already joined a game. Cannot join.",
    PLAYER_ALREADY_IN_GAME_CANNOT_CREATE = "Player already joined a game. Cannot create game.",
    UNSTARTED_LIMIT = "Number of unstarted games exceeded.",
    USER_DOES_NOT_EXIST = "User does not exist. Invalid login.",
    USERNAME_EXISTS = "Username already exists.",
    USERNAME_OR_PASSWORD_UNDEFINED = "The username or password was not received",
    WRONG_USERNAME_OR_PASSWORD = "Wrong username or password"
}