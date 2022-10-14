import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LibChat from '@/lib/LibChat';
import LibCookie from '@/lib/LibCookie';
//
interface IProps {
}
//
const TopChatRow: React.FC<IProps> = function (props: any) {  
  const [chatId, setChatId] = useState(0);
  const [chatName, setChatName] = useState("");

  /**
  * 起動処理
  * @param
  *
  * @return
  */
  const initPage = async function (): Promise<any>
  {
    try {
      const key = process.env.MY_LAST_CHAT_ID;
      const chatId = LibCookie.getCookie(key);
      if(chatId !== null){
        const chat = await LibChat.get(Number(chatId));
        console.log(chat);
        setChatId(Number(chatId));
        setChatName(chat.name);
      }         
      console.log("chatId", chatId);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    initPage();
  }, []);
   //
  return (
    <>
      <h3>Recent Chat</h3>
      <hr />
      <div className="col-md-12">
        {chatName? (
          <div>
            <Link  href={`/chats/show?id=${chatId}`}>
              <a>
                <span className="task_title fs-5"><h3 className="py-1">{chatName}</h3>
                </span>
                <span>ID: {chatId}</span>
                <button className="btn btn-sm btn-outline-primary mx-2">Open
                </button>
              </a>        
            </Link>
            
          </div>
        ): 
        ""}
              
      </div>
    </>
  )
}

export default TopChatRow;
