import Link from 'next/link';
//import LibChatPost from '@/lib/LibChatPost'
import LibBookMark from '@/lib/LibBookMark'
//Types
interface IProps {
  id: number,
//  BookMarkId: number,
  chatPostId: number,
  user_name: string,
  body: string,
  updatedAt: any,
  userId: number,
  user_uid: any,
  parentFunc: any,
  parentShow: any
}

/**
* ThreadRow
* @param
*
* @return
*/
const ThreadRow: React.FC<IProps> = function (props: any) {
  /**
  * bmDelete :
  * @param
  *
  * @return
  */  
  const bmDelete = async function() {
    try{
      await LibBookMark.delete(props.BookMarkId);
      await props.parentFunc(); 
    } catch (e) {
      console.error(e);
      alert("Error, bmDelete NG");
    }
  }
  /**
  * showItem :
  * @param
  *
  * @return
  */  
  const showItem = async function () {
    try{
console.log("showItem", props.chatPostId);
      props.parentShow(props.chatPostId);
    } catch (e) {
      console.error(e);
      alert("Error, delete NG");
    }
  }
  //
  return (
  <div className="card task_card_box shadow-lg mb-2">
    <h5 className="card-header">{props.user_name}</h5>
    <div className="card-body">
      <pre className="pre_text my-1">{props.body}</pre>
      <hr className="my-1" />
      <span className="mx-0 text-secondary">{props.updatedAt}</span>
      <span className="mx-2">ID: {props.id}</span>
      {/*
      <button className="btn btn-sm btn-outline-secondary"
        onClick={() => bmDelete()} ><i className="bi bi-trash-fill"></i>
      </button>      
      */}
    </div>
    <div className="card-footer text-muted text-center">
      <button className="btn btn-sm btn-primary"
        onClick={() => showItem()} >Recent Post</button>
    </div>    
  </div>      
  )
}
;
export default ThreadRow;
