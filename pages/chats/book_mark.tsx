/*
* Chat Show
*/
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
//
import { useRouter } from "next/router";
import Layout from '@/components/layout'
import LibChatPost from '@/lib/LibChatPost'
import LibStorage from '@/lib/LibStorage';
import LibNotify from '@/lib/LibNotify';
import LibCookie from '@/lib/LibCookie';
import LibCommon from '@/lib/LibCommon';
import LibChat from '@/lib/LibChat';
import LibThread from '@/lib/LibThread';
import BookMarkRow from './BookMarkRow';
import ModalPost from './ModalPost';
//
LibStorage.set_exStorage("auto_update", 1)
//
const ChatShow: React.FC = function () {
  const router = useRouter();
  const queryParamas = router.query;
  const [time, updateTime] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [chatId, setChatId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [lastCreateTime, setLastCreateTime] = useState("");
  const [chatName, setChatName] = useState("");
  const [soundUrl, setSoundUrl] = useState("");
  const [modalUserName, setModalUserName] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalDatetime, setModalDatetime] = useState("");
  const [modalId, setModalId] = useState(0);
  const [modaluserId, setmodaluserId] = useState(0);
  const [modalThreadItems, setModalThreadItems] = useState([]);
//console.log("chatId=", chatId);  
  const interval = 3000;

  /**
  * 起動処理
  * @param
  *
  * @return
  */  
  useEffect(() => {
    //import bootstrap from 'bootstrap';
    if (!router.isReady) return;
    console.log("#init", queryParamas.id);
    if(queryParamas.id !== 'undefined') {
      const envUrl = process.env.MY_NOTIFY_SOUND_URL;
      // @ts-ignore
      setSoundUrl(envUrl);
      setChatId(Number(queryParamas.id));
      const key = process.env.COOKIE_KEY_USER_ID;
      const uid = LibCookie.getCookie(key);
//console.log("soundUrl=", envUrl);
      if(uid === null){
        location.href = '/auth/login';
      }   
      setUserId(Number(uid));   
      (async() => {
        const chat = await LibChat.get(Number(queryParamas.id));
        setChatName(chat.name);
        // @ts-ignore
        const items = await get_items(Number(queryParamas.id), Number(uid));
//console.log(items);
        setItems(items);
      })()
      //modal
      const modalArea = document.getElementById('modalArea');
      const openModal = document.getElementById('openModal');
      const closeModal = document.getElementById('closeModal');
      const modalBg = document.getElementById('modalBg');
      const toggle = [openModal,closeModal,modalBg];
      
      for(let i=0, len=toggle.length ; i<len ; i++){
        toggle[i]?.addEventListener('click',function(){
          modalArea?.classList.toggle('is-show');
        },false);
      }      
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
      if(json.data.length > 0) {
        const row = json.data[0];
        setLastCreateTime(row.createdAt);
      }
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
//console.log(post);
      setModalUserName(post.UserName);
      setModalBody(post.Body);
      setModalDatetime(post.createdAt);
      setModalId(post.id);
      setmodaluserId(post.UserId);
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
  //
  return (
    <Layout>
      <div className="container bg-light chat_show_wrap">
        {/* name */}
        <div className="row">
          <div className="col-md-6"><h3>BookMark : {chatName}</h3></div>
          <div className="col-md-6 text-end">ID: {chatId}</div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-6 text-center">
            <Link href={`/chats/show?id=${chatId}`}><a>[ Post ]</a>
            </Link>
          </div>
          <div className="col-md-6 text-center">
            <Link href={`/chats/thread?id=${chatId}`}><a>[ Thread ]</a>
            </Link>
          </div>
          {/*
          */}
        </div>
        <hr className="my-1" />        
        {/* Post */}
        <div>
        {items.map((item: any ,index: number) => {
//console.log("BookMarkId=", item.BookMarkId);
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
          .chat_show_wrap .pre_text {
            font-family: BlinkMacSystemFont,Roboto;
            font-size: 1rem;
          }
        `}</style>        
      </div>
    </Layout>
  );
}
export default ChatShow;
