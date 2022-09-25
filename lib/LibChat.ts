import moment from 'moment'
import LibConfig from './LibConfig'


//
const LibChat = {
  /**
  * get :
  * @param
  *
  * @return
  */      
  get: async function(id: number): Promise<any>
  {
    try{
      let ret = {};
      const response = await fetch(process.env.MY_API_URL + '/chats/show/' + id);           
      const json = await response.json();
      if(json.ret === LibConfig.OK_CODE) {
        console.log(json.data);
      }
      ret = json.data;
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('Error , get');
    }    
  },

}
export default LibChat;
