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

  return (
    <div className="row justify-content-center">
      <div className="task_card_box card shadow-lg mb-2">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row">
            <div className="card_col_body  p-md-2">
              <span className="fs-5">{props.user_name}</span> <br />
              <pre className="my-1">{props.body}</pre>
              <span className="mx-0 text-secondary">{props.updatedAt}</span> 
              <span className="mx-2">ID: {props.id}</span>
              {props.userId === props.user_uid ? (
                <span className="mx-2">
                  <button className="btn btn-sm btn-outline-danger"
                   onClick={() => childDeleteItem()} >Delete</button>
                </span>
              ): (
                <div />
              )}             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
;
export default IndexRow;
/*
<span className="mx-2"> 
  <button></>
  <Link href={`/chats/edit?id=${item.id}`}>
  <a className="btn btn-sm btn-outline-primary mx-2">Edit</a>
  </Link>
</span>
*/