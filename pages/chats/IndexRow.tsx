import Link from 'next/link';

const IndexRow = (props: any) => (
  <div className="row justify-content-center">
    <div className="task_card_box card shadow-lg mb-2">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row">
          <div className="card_col_body  p-md-2">
            <span className="fs-5">{props.user_name}</span> <br />
            <pre className="my-1">{props.body}</pre>
            <span className="mx-0 text-secondary">{props.updatedAt}</span>, ID: {props.id}
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default IndexRow;
/*
<h3>
  <Link href={`/todos/${props.id}`}><a>{props.title}</a>
  </Link>
</h3>
<Link href={`/chats/edit?id=${item.id}`}>
  <a className="btn btn-sm btn-outline-primary mx-2">Edit</a>
</Link>
*/