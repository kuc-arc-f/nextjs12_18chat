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
  const [chatName, setChatName] = useState("");
  const [soundUrl, setSoundUrl] = useState("");
  const [modalUserName, setModalUserName] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalDatetime, setModalDatetime] = useState("");
  const [modalId, setModalId] = useState(0);
  const [modaluserId, setmodaluserId] = useState(0);
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
console.log("soundUrl=", envUrl);
      if(uid === null){
        location.href = '/auth/login';
      }   
      setUserId(Number(uid));   
      (async() => {
        const chat = await LibChat.get(Number(queryParamas.id));
        setChatName(chat.name);
//console.log(chatName);
        // @ts-ignore
        const items = await get_items(Number(queryParamas.id));
console.log(items);
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
//      items = LibCommon.getDateArray(items);
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
console.log(post.createdAt);
        let createdAt = "";
        if(typeof(post.createdAt) !== 'undefined') {
          createdAt = post.createdAt;
        }
        if(lastCreateTime === createdAt) {
          return;
        }
        const items = await get_items(chatId);
        setItems(items);
        if(items.length > 0){
          const item: any = items[0];
//console.log(item.body, item.UserName, item.createdAt);
          sendNotify(item.UserName, item.body);
          //timeer , sound
          setTimeout(async () => {
            console.log("#sound start");
            await soundPlay();
          }, 3000);
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
      const post = LibChatPost.getShowItem(items, id);
console.log(post);
      setModalUserName(post.UserName);
      setModalBody(post.body);
      setModalDatetime(post.createdAt);
      setModalId(post.id);
      setmodaluserId(post.UserId);
      const btn = document.getElementById("modal_open_button");
      btn?.click();
    } catch (e) {
      console.log(e);
      throw new Error('error, parentShow');
    }
  }

  return (
    <Layout>
      <div className="container bg-light chat_show_wrap">
        <h3>{chatName}</h3>
        ID: {chatId}
        <hr />
        {/* notify_sound */}      
        <audio className="notify_audio" src="/notify.mp3" id="notify_sound"
        controls></audio>         
        {/*
        <button onClick={() => {sendNotify();}}>[testNoti]</button>
        */}
        <div className="row">
          <div className="col-sm-9">
            <textarea className="form-control" name="body" id="body" rows={3} />
          </div>
          <div className="col-sm-3">
            <button className="mt-2 btn btn-primary" onClick={() => addItem()} >
              Post</button>
          </div>
        </div>
        <hr />
        <div>
        {items.map((item: any ,index: number) => {
  //console.log("uid=", item.userId);
          {/* uid={item.userId} , */}
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
         userId={userId} postUserId={modaluserId} parentFunc={parentFunc} ></ModalPost>        
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
/*
"Segoe UI",
*/
