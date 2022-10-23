/*
* Chat Show
*/
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
//
import { useRouter } from "next/router";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import LibChatPost from '@/lib/LibChatPost'
import LibStorage from '@/lib/LibStorage';
import LibNotify from '@/lib/LibNotify';
import LibCookie from '@/lib/LibCookie';
import LibCommon from '@/lib/LibCommon';
import LibChat from '@/lib/LibChat';
import LibThread from '@/lib/LibThread';
import BookMarkRow from './BookMarkRow';
import ModalPost from './ModalPost';
// Global
let userId : number = 0;
let chatName: string = "";
let chatId: number = 0;

//
LibStorage.set_exStorage("auto_update", 1)
//
const BookMark: React.FC = function () {
  const router = useRouter();
  const queryParamas = router.query;
  const [items, setItems] = useState([]);
  const [modalUserName, setModalUserName] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalDatetime, setModalDatetime] = useState("");
  const [modalId, setModalId] = useState(0);
  const [modaluserId, setmodaluserId] = useState(0);
  const [modalThreadItems, setModalThreadItems] = useState([]);
  const [loadingDisplay, setloadingDisplay] = useState(true);
//console.log("chatId=", chatId);  

  /**
  * hiddenModalButton
  * @param
  *
  * @return
  */  
  const hiddenModalButton = function ()
  {
    try{
      //bookmark済は。add-button消す
      const add_btn = document.getElementById("modal_post_btn_bookmark");
      add_btn?.classList.add('add_bookmark_diplay_remove');
      //Postは、削除できない
      const delete_btn = document.getElementById("modal_post_btn_delete");
      delete_btn?.classList.add('delete_bookmark_diplay_remove');
    } catch (e) {
      console.error(e);
      throw new Error('Error , hiddenModalButton');
    }
  }

  /**
  * 起動処理
  * @param
  *
  * @return
  */  
  useEffect(() => {
    if (!router.isReady) return;
//console.log("#init", queryParamas.id);
    if(queryParamas.id !== 'undefined') {
      chatId = Number(queryParamas.id);
//console.log(chatId);
      const key = process.env.COOKIE_KEY_USER_ID;
      const uid = LibCookie.getCookie(key);
      if(uid === null){
        location.href = '/auth/login';
      }   
      userId = Number(uid); 
      (async() => {
        // @ts-ignore
        const items = await get_items(Number(queryParamas.id), Number(uid));
//console.log(items);
        setItems(items);
        if(items.length > 0) {
          const chatOne = items[0];
//console.log(chatOne);
          chatName = chatOne.ChatName;
        }
        setloadingDisplay(false); //loading=false        
      })()
    }
    LibNotify.validNotification();
  }, [queryParamas, router]);
  /**
  * get_items : chatデータ取得
  * @param
  *
  * @return
  */
  const get_items = async function (id: number, userId: number): Promise<any>
  {
    try{
      const item = {
        chatId: Number(id),
        userId : userId,
      }      
//console.log(item);   
      const response = await fetch(process.env.MY_API_URL + '/book_marks/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });           
      const json = await response.json();
//console.log(json.data); 
      let items = json.data;
      items = LibCommon.getMmddhmmArray(items);
//console.log(items);
      return items;
    } catch (e) {
      console.error(e);
      throw new Error('Error , get_items');
    }
  }
  /**
  * parentFunc : 下層コンポーネントから呼ぶ関数
  * @param
  *
  * @return
  */  
  const parentFunc = async function () 
  {
    try {
//console.log("parentFunc", id);
      const items = await get_items(chatId, userId);
      setItems(items);
    } catch (e) {
      console.log(e);
      throw new Error('error, parentFunc');
    }
  }
  /**
  * parentShow : 下層コンポーネントから ダイアログ開く
  * @param
  *
  * @return
  */
  const parentShow = async function (id: number) 
  {
    try {
console.log("parentShow", id);
      setModalThreadItems([]);
      const post = LibChatPost.getShowItem(items, id);
      setModalUserName(post.UserName);
      setModalBody(post.Body);
      setModalDatetime(post.createdAt);
      setModalId(post.id);
      setmodaluserId(post.UserId);
//console.log(userId, post.UserId);
      //modal Open
      const btn = document.getElementById("modal_open_button");
      btn?.click();
      //thread
      const thread = await LibThread.getItems(id);
//console.log(thread);
      setModalThreadItems(thread);
    } catch (e) {
      console.log(e);
      throw new Error('error, parentShow');
    }
  }
  /**
  * parentThreadAdd : 下層コンポーネントから Thread Add
  * @param
  *
  * @return
  */  
  const parentThreadAdd = async function (chatPostId: number)
  {
    try {
      const thread = await LibThread.getItems(chatPostId);
console.log(thread);
      setModalThreadItems(thread);      
    } catch (e) {
      console.log(e);
      throw new Error('error, parentThreadAdd');
    }    
  }
  if(typeof(document) !== "undefined") {
    hiddenModalButton();
  }
  //
  return (
    <Layout>
      <>
      {loadingDisplay ? (<LoadingBox></LoadingBox>): (
        <div></div>
      )}      
      <div className="container bg-light chat_show_wrap">
        {/* name */}
        <div className="row">
          <div className="col-md-6"><h3>BookMark : {chatName}</h3></div>
          <div className="col-md-6 text-end">ID: {chatId}</div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-6 text-center">
            <Link href={`/chats/show?id=${chatId}`}><a className="fs-5">[ Post ]</a>
            </Link>
          </div>
          <div className="col-md-6 text-center">
            <Link href={`/chats/thread?id=${chatId}`}><a className="fs-5">[ Thread ]</a>
            </Link>
          </div>
          {/*
          */}
        </div>
        <hr className="my-1" />        
        {/* Post */}
        <div>
        {items.map((item: any ,index: number) => {
//console.log(item.BookMarkId, userId, item.userId);
          return (
            <div key={item.BookMarkId}>
              <BookMarkRow id={item.id} user_name={item.UserName} body={item.Body}
              updatedAt={item.dt_str} userId={userId} user_uid={item.userId}
              BookMarkId={item.BookMarkId}
              parentFunc={parentFunc} parentShow={parentShow}
                />
            </div>
          )
        })}  
        </div>
        {/* modal  */}
        <ModalPost id={modalId} user_name={modalUserName} body={modalBody} createdAt={modalDatetime}
         userId={userId} postUserId={modaluserId} parentFunc={parentFunc} 
         chatId={chatId} parentThreadAdd={parentThreadAdd} modalThreadItems={modalThreadItems}
         ></ModalPost>        
        <style>{`
          .chat_show_wrap .notify_audio{ display: none ;}
          .chat_show_wrap .row_trash_icon{ font-size: 1rem; }
        `}</style>        
      </div>
      </>
    </Layout>
  );
}
export default BookMark;
