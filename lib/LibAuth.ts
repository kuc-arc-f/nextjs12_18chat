import LibCookie from '../lib/LibCookie'
//import Config from '@/config';
//
const LibAuth = {
  /**
  * validLogin
  * @param key: string
  *
  * @return
  */  
  validLogin: function(): boolean
  {
    try{
      let ret = true
      //process.env.COOKIE_KEY_USER_ID
//      const key: string = Config.COOKIE_KEY_USER_ID
      const key = process.env.COOKIE_KEY_USER_ID;
      const user_id = LibCookie.getCookie(key)
//console.log(user_id)
      if(user_id == null){
        location.href ="/#/users_login";
        return false;
      }      
      return ret
    } catch (e) {
      console.log(e);
      throw new Error('error, valid_login');
    }
  },
  /**
  * getUid
  * @param
  *
  * @return
  */    
  getUid: function(): string
  {
    try{
      let ret = ""
      const key = process.env.COOKIE_KEY_USER_ID;
      const user_id = LibCookie.getCookie(key)
//console.log(user_id)
      if(user_id !== null){
        ret = user_id
      }      
      return ret
    } catch (e) {
      console.log(e);
      throw new Error('error, get_uid');
    }
  },
  /**
  * getUser
  * @param
  *
  * @return
  */        
  getUser: function(mail: string , users: any)
  {
    try{
      let ret = null
      users.forEach(function(item: any){
//            console.log(item.id );
        if(item.mail === mail){
          ret = item
        }
      });      
//console.log(items)
      return ret
    } catch (e) {
      console.error(e);
      throw new Error('Error , get_user');
    }        
  },
}
export default LibAuth;
