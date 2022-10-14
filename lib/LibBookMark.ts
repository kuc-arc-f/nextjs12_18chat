import moment from 'moment'
import { exit } from 'process';
import LibConfig from './LibConfig'

//
const LibBookMark = {
  /**
  * getItems
  * @param chatPostId: number
  *
  * @return
  */   
   getItems : async function (chatPostId: number): Promise<any>
   {
    try{
      const item = {
        chatPostId: chatPostId,
      }      
      const url = process.env.MY_API_URL + "/thread/index";
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(item),
      });
      if (res.status != 200) {
        throw new Error(await res.text());
      }
      const json = await res.json();
console.log(json);
      return json.data;
    } catch (e) {
      console.error(e);
      throw new Error('Error, getItems');
    }
   }, 
  /**
  * create
  * @param chatPostId: number
  *
  * @return
  */   
   create : async function (chatPostId: number, chatId: number, userId: number): Promise<void>
   {
    try{
      const item = {
        userId: userId,
        chatId: chatId,
        chatPostId: chatPostId,
      }
      const url = process.env.MY_API_URL + "/book_marks/create";
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(item),
      });
      if (res.status != 200) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      console.log(json);
    } catch (e) {
      console.error(e);
      throw new Error('Error, create');
    }
   }, 
  /**
  * delete
  * @param threadId: number
  *
  * @return
  */
  delete : async function (BookMarkId: number): Promise<void>
  {
    try{
      const item = {
        id: BookMarkId,
      }
      const url = process.env.MY_API_URL + "/book_marks/delete";
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(item),
      });
      if (res.status != 200) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      console.log(json);
    } catch (e) {
      console.error(e);
      throw new Error('Error, delete');
    }
  },    
}
export default LibBookMark;
