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
import LibConfig from '@/lib/LibConfig';
import LibChat from '@/lib/LibChat';
import LibThread from '@/lib/LibThread';
import IndexRow from './IndexRow';
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
  const [lastThreadTime, setLastThreadTime] = useState("");
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
    if (!router.isReady) return;
    console.log("#init", queryParamas.id);
    if(queryParamas.id !== 'undefined') {
      const envUrl = process.env.MY_NOTIFY_SOUND_URL;
      // @ts-ignore
      setSoundUrl(envUrl);
      setChatId(Number(queryParamas.id));
      const key = process.env.COOKIE_KEY_USER_ID;
      const uid = LibCookie.getCookie(key);
console.log("soundUrl=", envUrl);
      if(uid === null){
        location.href = '/auth/login';
      }   
      setUserId(Number(uid));
      //set chat_id
      const keyChatId = process.env.MY_LAST_CHAT_ID;
      LibCookie.setCookie(keyChatId, String(queryParamas.id));

      (async() => {
        const chat = await LibChat.get(Number(queryParamas.id));
        setChatName(chat.name);
//console.log(chatName);
        // @ts-ignore
        const items = await get_items(Number(queryParamas.id));
console.log(items);
        setItems(items);
        //thread Last
        const post = await LibChatPost.getLastTime(Number(queryParamas.id));
        if(typeof(post.thread.createdAt) !== 'undefined') {
          setLastThreadTime(post.thread.createdAt);
        }  
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
  const get_items = async function (id: number): Promise<any>
  {
    try{
      const item = {
        chatId: Number(id),
        userId : userId,
      }      
//console.log(item);    
      const response = await fetch(process.env.MY_API_URL + '/chat_posts/index', {
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
  //timer
  useEffect(() => {
    const timeoutId: any = setTimeout(() => updateTime(Date.now()), interval);
    let valid = LibChatPost.postUpdate();
//console.log("show.valid=", valid);
    if(valid) {
      (async() => {
        console.log("#execute_update");
        const post = await LibChatPost.getLastTime(chatId);
//console.log(post);
//console.log("lastThreadTime=", lastThreadTime);
        let createdAt = "";
        let thread_createdAt = "";
        let thread_id = 0;
        if(typeof(post.createdAt) !== 'undefined') {
          createdAt = post.createdAt;
        }
        if(typeof(post.thread.createdAt) !== 'undefined') {
          thread_createdAt = post.thread.createdAt;
        }  
        if(typeof(post.thread.id) !== 'undefined') {
          thread_id = post.thread.id;
        }             
        if(
          lastCreateTime !== createdAt || 
          lastThreadTime !== thread_createdAt
        ) 
        {
          //自動更新、通知判定
          if(lastCreateTime !== createdAt) {
            const items = await get_items(chatId);
            setItems(items);
            if(items.length > 0){
              const item: any = items[0];
//console.log(item.body, item.UserName, item.createdAt);
              sendNotify(item.UserName, item.body);
              //timer , sound
              setTimeout(async () => {
                console.log("#sound start");
                await soundPlay();
              }, 3000);
            }
            return;
          }
          //post Update, thread 通知なし
          if(lastThreadTime !== thread_createdAt && thread_id > 0) {
            //画面表示
            const badge_thread = document.getElementById("badge_thread_new");
            badge_thread?.classList.remove('hidden_badge_thread_new');
            setLastThreadTime(thread_createdAt);
            const thread = await LibThread.getItem(thread_id);
//console.log(thread);
            sendNotify("[ Thread Update ]", thread.body);
            await soundPlay();
          }
        }          
      })()      
    }
    return () => {
        clearTimeout(timeoutId);
    };
  }, [time]); // eslint-disable-line react-hooks/exhaustive-deps
  /**
  * sendNotify: 通知APIの起動
  * @param body : string
  *
  * @return
  */  
  const sendNotify = async function (name: string, body: string) {
    try{
      LibNotify.displayNotification(name, body);
    } catch (e) {
      console.error(e);
      throw new Error('Error , sendNotify');
    }    
  }
  /**
  * soundPlay:
  * @param
  *
  * @return
  */
  const soundPlay = async function (): Promise<void>
   {
    try{
      const validBroser  = LibCommon.getBrowserType();
//console.log("validBroser=", validBroser);
      if ( validBroser === "chrome") {
        const sound = document.querySelector<HTMLAudioElement>('#notify_sound');
        // @ts-ignore
        await sound.play();      
      }
    } catch (e) {
      console.error(e);
      throw new Error('Error , soundPlay');
    }    
  }
  /**
  * addItem
  * @param
  *
  * @return
  */   
  const addItem = async function () {
    try {
      const elemBody = document.querySelector<HTMLInputElement>('#body');
      const item = {
        title: '',
        chatId: chatId,
        body: elemBody?.value,
        userId : userId,
      }
  console.log(item)      
      const res = await fetch(process.env.MY_API_URL + '/chat_posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(item),
      });
      if (res.status != 200) {
        throw new Error(await res.text());
      }
      // @ts-ignore
      elemBody.value = "";
      const json = await res.json();
      console.log(json.ret);
      const items = await get_items(chatId);
      setItems(items);
    } catch (e) {
      console.log(e);
      alert("Error, add");
    }
  }
  /**
  * parentFunc : 下層コンポーネントから呼ぶ関数
  * @param
  *
  * @return
  */  
  const parentFunc = async function (id: number) 
  {
    try {
//console.log("parentFunc", id);
      const items = await get_items(chatId);
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
console.log(post);
      setModalUserName(post.UserName);
      setModalBody(post.body);
      setModalDatetime(post.createdAt);
      setModalId(post.id);
      setmodaluserId(post.UserId);
      const btn = document.getElementById("modal_open_button");
      btn?.click();
      //thread
      const thread = await LibThread.getItems(id);
console.log(thread);
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
//console.log(thread);
      setModalThreadItems(thread);      
      if(thread.length > 0) {
        const item: any = thread[0];
//console.log("createdAt=", item.createdAt);
        setLastThreadTime(item.createdAt);
      }
    } catch (e) {
      console.log(e);
      throw new Error('error, parentThreadAdd');
    }    
  }
  /**
  * clickSearch
  * @param
  *
  * @return
  */
  const clickSearch = async function() {
    try{
      const searchKey = document.querySelector<HTMLInputElement>('#searchKey');
      const skey = searchKey?.value;
      const items = await LibChatPost.search(chatId, skey);
//      console.log(items);
      setItems(items);
    } catch (e) {
      console.error(e);
      alert("Error, serach");
    }      
  }
  /**
  * clickClear
  * @param
  *
  * @return
  */
  const clickClear = async function() {
    try{
      const searchKey = document.querySelector<HTMLInputElement>('#searchKey');
      // @ts-ignore
      searchKey.value = "";
      const items = await get_items(chatId);
      setItems(items);
    } catch (e) {
      console.error(e);
      throw new Error('Error , clickClear');
    }    
  }
  //
  return (
    <Layout>
      <div className="container bg-light chat_show_wrap">
        {/* notify_sound */}      
        <audio className="notify_audio" src="/notify.mp3" id="notify_sound"
        controls></audio>         
        {/* name */}
        <div className="row">
          <div className="col-md-6"><h3>{chatName}</h3></div>
          <div className="col-md-6">ID: {chatId}</div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-6 text-center">
            <Link href={`/chats/thread?id=${chatId}`}><a className="fs-5">[ Thread ]</a>
            </Link>
            <span id="badge_thread_new"
             className="hidden_badge_thread_new mx-2 badge rounded-pill bg-primary">New</span>          
          </div>
          <div className="col-md-6 text-center">
            <Link href={`/chats/book_mark?id=${chatId}`}><a className="fs-5">[ BookMark ]</a>
            </Link>
          </div>
        </div>
        {/*
        */}
        <hr className="my-1" />
        <div className="row">
          <div className="col-sm-9">
            <textarea className="form-control" name="body" id="body" rows={3} />
          </div>
          <div className="col-sm-3">
            <button className="mt-2 btn btn-primary" onClick={() => addItem()} >
              Post</button>
          </div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-12 pt-1">
            <button onClick={() => clickClear()} className="btn btn-sm btn-outline-primary">Clear
            </button>            
            <span className="search_key_wrap">
              {/* form-control form-control-sm */}
              <input type="text" size={36} className="mx-2 " name="searchKey" id="searchKey"
              placeholder="Search Key" />        
            </span>
            <button onClick={() => clickSearch()} className="btn btn-sm btn-outline-primary">Search
            </button>            
          </div>
        </div>
        <hr className="my-1" />
        {/* Post */}
        <div>
        {items.map((item: any ,index: number) => {
  //console.log("uid=", item.userId);
          return (
            <div key={item.id}>
              <IndexRow id={item.id} user_name={item.UserName} body={item.body}
              updatedAt={item.dt_str} userId={userId} user_uid={item.userId}
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
          .hidden_badge_thread_new {display: none; }
          .chat_show_wrap .notify_audio{ display: none;}
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
/*
"Segoe UI",
*/
