const {ccclass, property} = cc._decorator;

//@ccclass
export default class GameMessage {

    static SOUND_LOADED = "gm_sound_loaded";

    static GLOBAL_LOADED = "gm_global_loaded";

    static CHARACTER_MOVE_ON_BY_TOUCH  =   "character_move_left_right_control_by_touch_on";
    static CHARACTER_MOVE_OFF_BY_TOUCH  =   "character_move_left_right_control_by_touch_off";
    static CHARACTER_MOVE_SWIPE_BY_TOUCH  =   "character_move_swipe_by_touch";

    static CONTACT_ENABLE_JUMP  =   "contact_enable_jump";
    static CONTACT_DISABLE_JUMP  =   "contact_disable_jump";  
    
    static GAME_OVER_STATE    =   "game_over_state";
}
