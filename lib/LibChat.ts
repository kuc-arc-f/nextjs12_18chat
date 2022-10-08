import moment from 'moment'
import LibConfig from './LibConfig'


//
const LibChat = {
  /**
  * get :
  * @param
  *
  * @return Promise<any>
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
  /**
  * delete :
  * @param id: number
  *
  * @return Promise<any>
  */      
  delete: async function(id: number): Promise<any>
  {
    try{
      let ret = {};
      const item = {
      id: Number(id),
    }
    const response = await fetch(process.env.MY_API_URL + "/chats/delete", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(item),
    });       
      const json = await response.json();
      if(json.ret === LibConfig.OK_CODE) {
        console.log(json.data);
      }
      ret = json.data;
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('Error , delete');
    }    
  },
  /**
  * getItems
  * @param searchKey string
  *
  * @return
  */   
   getItems : async function (): Promise<any>
   {
     try{
      const url = process.env.MY_API_URL + "/chats/index";
      const response = await fetch(url);
      const json = await response.json();
       if(json.ret !== LibConfig.OK_CODE ) {
         throw new Error('Error , search');
       }
 //console.log(json.data);
       return json.data;
     } catch (e) {
       console.error(e);
       throw new Error('Error, getItems');
     }
   },  
  /**
  * search
  * @param searchKey string
  *
  * @return
  */   
  search : async function (searchKey: string | undefined): Promise<any>
  {
    try{
      //seachKey
      // /chats/search
      const item = {
        seachKey: searchKey, 
      };
//console.log(item);
      const res = await fetch(process.env.MY_API_URL + '/chats/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if(json.ret !== LibConfig.OK_CODE ) {
        throw new Error('Error , search');
      }
//console.log(json.data);
      return json.data;
    } catch (e) {
      console.error(e);
      throw new Error('Error, search');
    }
  },   
}
export default LibChat;
