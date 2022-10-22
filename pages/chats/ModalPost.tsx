import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import LibCommon from '@/lib/LibCommon';
import LibChatPost from '@/lib/LibChatPost'
import LibThread from '@/lib/LibThread'
import LibBookMark from '@/lib/LibBookMark'
//Types
interface IProps {
  id: number,
  chatId: number,
  userId: number, // Login userId
  user_name: string,
  postUserId: number,
  body: string,
  createdAt: any,
  parentFunc: any,
  parentThreadAdd: any,
  modalThreadItems: any[],
}

/**
* IndexRow
* @param
*
* @return
*/
const ModalPost: React.FC<IProps> = function (props: any) {
  const [items, setItems] = useState([]);
  let createdAt = props.createdAt;
  createdAt = LibCommon.converDatetimeString(createdAt);
//console.log(props.modalThreadItems);
  /**
  * childDeleteItem : 投稿の削除
  * @param
  *
  * @return
  */
  const childDeleteItem = async function () {
    try {
      console.log("childDeleteItem");
      const btn = document.getElementById("modal_close_button");
      btn?.click();
      await LibChatPost.delete(props.id);
      props.parentFunc(props.id);
    } catch (e) {
      console.error(e);
      alert("Error, childDeleteItem");
    }
  }
  /**
  * deleteThread : threadの削除
  * @param
  *
  * @return
  */  
  const deleteThread = async function (threadId: number) {
    try {
console.log("deleteThread");
      await LibThread.delete(threadId);
      await props.parentThreadAdd(props.id);      
    } catch (e) {
      console.error(e);
      alert("Error, deleteThread");
    }
  }
  /**
  * createReply :
  * @param
  *
  * @return
  */
  const createReply = async function () {
    try {
      const body = document.querySelector<HTMLInputElement>('#modal_reply_body');
      const bodyString = body?.value; 
      await LibThread.create(props.id, bodyString, props.chatId, props.userId);
      props.parentThreadAdd(props.id);
      //@ts-ignore
      body.value = "";
//console.log(items);
    } catch (e) {
      console.error(e);
      alert("Error, createReply");
    }
  }
  /**
  * createReply :
  * @param
  *
  * @return
  */  
  const addBookMark = async function () {
    try {
      await LibBookMark.create(props.id, props.chatId, props.userId);
      alert("Complete, BookMark add");
//console.log(items);
    } catch (e) {
      console.error(e);
      alert("Error, addBookMark");
    }
  };
  //
  const mdText = LibCommon.replaceBrString(props.body);
  //
  return (
    <div className="row justify-content-center modal_post_wrap">
      {/* button */}
      <button type="button" id="modal_open_button" className="btn btn-primary"
        data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      {/* Modal */}
      <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{props.user_name}</h5>
              <span className="mx-2 text-secondary">{createdAt}</span>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body bg-light">
              {/*  <pre className="pre_text">{props.body}</pre>
              */}
              <div id="post_item" dangerouslySetInnerHTML={{__html: `${mdText}`}}>
              </div>
              <hr className="my-1" />
              <span className="mx-2">ID: {props.id}</span>
              <hr className="my-1" />
              <div className="row">
                <div className="col-sm-9"><textarea className="form-control" id="modal_reply_body" rows={3} />
                </div>
                <div className="col-sm-3">
                  <button className="mt-2 btn btn-primary" onClick={() => createReply()} >
                    Reply</button>
                </div>
              </div>
              <hr className="my-1" />
              <div className="row">
              {props.modalThreadItems ? (
                props.modalThreadItems.map((item: any ,index: number) => {
 //console.log("uid=", item.id, item.userId);
                  const threadCreatedAt = LibCommon.converMmddTimeString(item.createdAt);
                  let bodyText = LibCommon.replaceBrString(item.body);
                  return (
                    <div key={item.id}>
                      <span className="fs-5">{item.UserName}: </span> 
                      <span className="mx-1 text-secondary">{threadCreatedAt}</span>
                      {props.userId === item.userId ? (
                        <button type="button" className="btn btn-sm btn-outline-secondary mx-2"
                          onClick={() => deleteThread(item.id)} ><i className="bi bi-trash-fill"></i>
                        </button>
                      ) : (
                        <span></span>
                      )}
                      <br />
                      {/* <pre className="mb-1">{item.body}</pre>
                      */}
                      <div dangerouslySetInnerHTML={{__html: `${bodyText}`}}>
                      </div>                      
                      <hr className="my-1" />
                    </div>
                  )                  
                })
              )
              : ""}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-primary" id="modal_post_btn_bookmark" 
                onClick={() => addBookMark()}>BookMark</button>              
              {props.userId === props.postUserId ? (
                <button type="button" className="btn btn-outline-danger" id="modal_post_btn_delete"
                onClick={() => childDeleteItem()}
                >Delete</button>
              ) : (
                <span></span>
              )}
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                id="modal_close_button">Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        #modal_open_button { display: none ;}
        .modal_post_wrap .bi {font-size: 0.8rem;}
        .add_bookmark_diplay_remove {display: none;}
        .delete_bookmark_diplay_remove {display: none;}
      `}</style>
    </div>
  )
}
  ;
export default ModalPost;
