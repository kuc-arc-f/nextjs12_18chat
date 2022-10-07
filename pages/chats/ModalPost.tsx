import Link from 'next/link';
import LibCommon from '@/lib/LibCommon';
import LibChatPost from '@/lib/LibChatPost'
//Types
interface IProps {
  id: number,
  userId: number, // Login userId
  user_name : string,
  postUserId: number,
  body: string,
  createdAt: any,
  parentFunc: any,
}

/**
* IndexRow
* @param
*
* @return
*/
const ModalPost: React.FC<IProps> = function (props: any) {
  let createdAt = props.createdAt;
  createdAt = LibCommon.converDatetimeString(createdAt);
//console.log(props.postUserId, props.userId);
  /**
  * childDeleteItem : 投稿の削除
  * @param
  *
  * @return
  */ 
   const childDeleteItem = async function () {
    try{
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
  //
  return (
    <div className="row justify-content-center"> 
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
              <span className="mx-2">{createdAt}</span>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body bg-light">
              <pre className="pre_text">{props.body}</pre>
              <hr className="my-1" />
              <span className="mx-2">ID: {props.id}</span>
            </div>
            <div className="modal-footer">
              {props.userId === props.postUserId ? (
                <button type="button" className="btn btn-outline-danger" onClick={() => childDeleteItem()}
                >Delete</button>
              ): (
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
      `}</style>              
    </div>
  )
}
;
export default ModalPost;
