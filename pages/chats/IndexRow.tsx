import Link from 'next/link';
import LibChatPost from '@/lib/LibChatPost'
//Types
interface IProps {
//  history:string[],
  id: number,
  user_name: string,
  body: string,
  updatedAt: any,
  userId: number,
  user_uid: any,
  parentFunc: any,
  parentShow: any
}

/**
* IndexRow
* @param
*
* @return
*/
const IndexRow: React.FC<IProps> = function (props: any) {
  /**
  * childDeleteItem : 投稿の削除
  * @param
  *
  * @return
  */ 
  const childDeleteItem = async function () {
    try{
console.log("childDeleteItem");
      await LibChatPost.delete(props.id);
      props.parentFunc(props.id);
    } catch (e) {
      console.error(e);
      alert("Error, delete NG");
    }
  }
  //showItem
  const showItem = async function () {
    try{
console.log("showItem");
//      await LibChatPost.delete(props.id);
      props.parentShow(props.id);
    } catch (e) {
      console.error(e);
      alert("Error, delete NG");
    }
  }
  return (
  <div className="card task_card_box shadow-lg mb-2">
    <h5 className="card-header">{props.user_name}</h5>
    <div className="card-body">
      <pre className="pre_text my-1">{props.body}</pre>
      <hr className="my-1" />
      <span className="mx-0 text-secondary">{props.updatedAt}</span>
      <span className="mx-2">ID: {props.id}</span>
    </div>
    <div className="card-footer text-muted text-center">
      <button className="btn btn-sm btn-primary"
        onClick={() => showItem()} >More</button>
    </div>    
  </div>      
  )
}
;
export default IndexRow;
/*
<span className="mx-2">
<button className="btn btn-sm btn-outline-danger"
onClick={() => childDeleteItem()} >
<i className="row_trash_icon bi bi-trash-fill"></i>
</button>
</span>
*/
