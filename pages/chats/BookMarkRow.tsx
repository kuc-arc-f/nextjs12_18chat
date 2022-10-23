import Link from 'next/link';
import LibChatPost from '@/lib/LibChatPost'
import LibBookMark from '@/lib/LibBookMark'
import LibCommon from '@/lib/LibCommon';
//Types
interface IProps {
  id: number,
  BookMarkId: number,
  user_name: string,
  body: string,
  updatedAt: any,
  userId: number,
  user_uid: any,
  parentFunc: any,
  parentShow: any
}

/**
* BookMarkRow
* @param
*
* @return
*/
const BookMarkRow: React.FC<IProps> = function (props: any) {
  /**
  * bmDelete :
  * @param
  *
  * @return
  */  
  const bmDelete = async function() {
    try{
      await LibBookMark.delete(props.BookMarkId);
//console.log("bmDelete");
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
console.log("showItem");
      props.parentShow(props.id);
    } catch (e) {
      console.error(e);
      alert("Error, delete NG");
    }
  }
  const mdText = LibCommon.replaceBrString(props.body);
  //
  return (
  <div className="card task_card_box shadow-lg mb-2">
    <h5 className="card-header">{props.user_name}</h5>
    <div className="card-body">
      <div id="post_item" dangerouslySetInnerHTML={{__html: `${mdText}`}}>
      </div>      
      <hr className="my-1" />
      <span className="mx-0 text-secondary">{props.updatedAt}</span>
      <span className="mx-2">ID: {props.id}</span>
        <button className="btn btn-sm btn-outline-secondary"
        onClick={() => bmDelete()} ><i className="bi bi-trash-fill"></i>
        </button>      
    </div>
    <div className="card-footer text-muted text-center">
      <button className="btn btn-sm btn-primary"
        onClick={() => showItem()} >More</button>
    </div>    
  </div>      
  )
}
;
export default BookMarkRow;
/*
      {props.userId === props.user_uid ? (
        <button className="btn btn-sm btn-outline-secondary"
        onClick={() => bmDelete()} ><i className="bi bi-trash-fill"></i>
        </button>      
      ) 
      : ""}
*/