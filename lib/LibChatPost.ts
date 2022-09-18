import moment from 'moment'
import LibStorage from './LibStorage';

// 初期値
const initParam =  {
  ACTIVE_UPDATE_SEC: 180,      
  STATE_ACTIVE: 1,      
  STATE_NON_ACTIVE: 2,      
  STATE_DISPLAY_ACTIVE: "Active",      
  STATE_DISPLAY_NONE : "noneActive",      
};
//タイマー状態
const chatParams = {
  INIT_TIME : new Date(),
  STAT : initParam.STATE_ACTIVE,
  STAT_DISPLAY : initParam.STATE_DISPLAY_ACTIVE,
  REMAIN_TIME : 0,
}

//
const LibChatPost = {
  /**
  * postUpdate : 投稿の更新判定
  * @param
  *
  * @return ret: true(update)
  */      
  postUpdate: function(): boolean
  {
    let ret = false;
    const sec = this.get_remain_time(chatParams.INIT_TIME, new Date() );
    chatParams.REMAIN_TIME = this.get_next_time(sec);
    const valid = this.valid_update(sec, chatParams.STAT);
    const auto_update = LibStorage.get_exStorage("auto_update")
console.log(chatParams.STAT, sec, valid , auto_update, chatParams.REMAIN_TIME );
    if(parseInt(auto_update) === 1) {
      if(valid) {
        chatParams.INIT_TIME = new Date();
        ret = true;
      }
    }
    return ret;
  },
  /**
  * get_remain_time : 初期化からの経過時間
  * @param
  *
  * @return ret: true(update)
  */     
  get_remain_time(init_time: any, now_time: any)
  {
    const bef = moment(init_time)
    const now = moment(now_time)
    let duration = moment.duration(now.diff(bef), 'milliseconds'); 
    //差分をミリ秒で取得し、ミリ秒→durationへ変換
    let min = duration.minutes()
//    let time = duration.minutes() + ":" + duration.seconds();
    let time = (min * 60) + duration.seconds();
//console.log(time)
    return time
  },
  /*
  get_stat_label(stat){
    const cfg = this.get_params()
    var ret = cfg.STATE_DISPLAY_NONE
    if(stat == cfg.STATE_ACTIVE){
      ret = cfg.STATE_DISPLAY_ACTIVE
    }   
    return ret
  },
  */
  /**
  * get_next_time :　更新までの残り時間
  * @param
  *
  * @return number
  */ 
  get_next_time(sec: number)
  {
    var ret = 0
    const cfg = initParam;
    const max = cfg.ACTIVE_UPDATE_SEC
    ret = max - sec
    return ret
  },
  /**
  * valid_update : 更新するか判定
  * @param
  *
  * @return ret: true(update)
  */    
  valid_update(sec: number, stat: number): boolean
  {
    var ret = false;
    const cfg = initParam;
    var max = cfg.ACTIVE_UPDATE_SEC
    if(stat == cfg.STATE_ACTIVE){
      if(sec >= max){
        ret = true
      }
    }
//console.log(cfg)
    return ret
  },
  /**
  * get_chat_items
  * @param
  *
  * @return ret: true(update)
  */  
  get_chat_items: function(items: any[], chat_id: number)
  {
    try{
      let ret: any[] = []
      items.forEach(function(item){
        if(item.chat_id == chat_id){
          ret.push(item)
        }
      });      
      return ret
    } catch (e) {
      console.log(e);
      throw new Error('error, get_chat_items');
    }
  },  
  /**
  * convert_users
  * @param
  *
  * @return ret: true(update)
  */   
  convert_users: function(items: any[] , users: any[])
  {
    try{
      let ret: any[] = []
      items.forEach(function(item: any){
        users.forEach(function(user){
          if(item.user_id == user.id){
            item.user = user
//console.log(item );
            ret.push(item)
          }
        })
      });      
      return ret
    } catch (e) {
      console.log(e);
      throw new Error('error, convert_users');
    }
  },  
}
export default LibChatPost;
