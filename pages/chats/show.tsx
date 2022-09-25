/*
* Chat Show
*/
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Layout from '@/components/layout'
import LibChatPost from '@/lib/LibChatPost'
import LibStorage from '@/lib/LibStorage';
import LibNotify from '@/lib/LibNotify';
import LibCookie from '@/lib/LibCookie';
import IndexRow from './IndexRow';
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
      setChatId(Number(queryParamas.id));
      const key = process.env.COOKIE_KEY_USER_ID;
      const uid = LibCookie.getCookie(key);
console.log(uid);
      if(uid === null){
        location.href = '/auth/login';
      }   
      setUserId(Number(uid));   
      (async() => {
      // @ts-ignore
        const items = await get_items(Number(queryParamas.id));
        setItems(items);
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
      return json.data;
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
        const items = await get_items(chatId);
        setItems(items);
        if(items.length > 0){
          const item: any = items[0];
//console.log("lastCreateTime", lastCreateTime);
//console.log(item.body, item.UserName, item.createdAt);
          if(lastCreateTime !== item.createdAt) {
            sendNotify(item.UserName, item.body);
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
  const sendNotify = function (name: string, body: string) {
    LibNotify.displayNotification(name, body);
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
      console.log("parentFunc", id);
      console.log("chatId", chatId);
      const items = await get_items(chatId);
      setItems(items);
    } catch (e) {
      console.log(e);
      throw new Error('error, parentFunc');
    }
  }

  return (
    <Layout>
      <div className="container bg-light">
      <h3>Chat Sample</h3>
      ID: {chatId}
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
             updatedAt={item.updatedAt} userId={userId} user_uid={item.userId}
             parentFunc={parentFunc}
              />
          </div>
        )
      })}        
      </div>
      </div>
    </Layout>
  );
}
export default ChatShow;
/*
<div key={item.id}>
  <span className="fs-5">{item.UserName}</span> <br />
  <pre className="my-1">{item.body}</pre>
  <span className="mx-0 text-secondary">{item.updatedAt}</span>, ID: {item.id}
  <hr className="my-1" />
  <IndexRow id={item.id} user_name={item.UserName} body={item.body} updatedAt={item.updatedAt} />
</div>
<Link href={`/chats/edit?id=${item.id}`}>
  <a className="btn btn-sm btn-outline-primary mx-2">Edit</a>
</Link>
*/
