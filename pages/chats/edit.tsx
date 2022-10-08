import Link from 'next/link';
import Router from 'next/router'
import React, {Component} from 'react';

import LibCookie from "@/lib/LibCookie";
import LibChat from "@/lib/LibChat";
import Layout from '@/components/layout'

interface IState {
  name: string,
  content: string,
  _token: string,
  userId: string | null,
  button_display: boolean,
}
interface IProps {
  id: string,
  csrf: any,
  user_id: string,
}
//
export default class ChatEdit extends Component<IProps, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      name: '', content: '', _token : '', userId: '', button_display: false
    }
console.log(props)
  }
  /**
  * componentDidMount
  * @param
  *
  * @return
  */     
  async componentDidMount(): Promise<void>
  {
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid: string | null = LibCookie.getCookie(key);
console.log( "user_id=" , uid)
    if (uid === null) {
      Router.push('/auth/login');
      return;
    }
    const chat = await LibChat.get(Number(this.props.id));
    console.log(chat);
    this.setState({
      userId: uid, button_display: true, name: chat.name,
    });    
  }   
  /**
  * update
  * @param
  *
  * @return
  */     
  async update(): Promise<void>
  {
    try {
      const name = document.querySelector<HTMLInputElement>('#name');
      const item = {
        name: name?.value,
        content : '',
        id: Number(this.props.id),
      }
      const res = await fetch(process.env.MY_API_URL + "/chats/update", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);
      if(json.ret !== 'OK'){
        throw new Error('Error , fetch');
      }      
      Router.push('/chats');
    } catch (error) {
      console.error(error);
      alert("Error, update")
    }    
  } 
  //delete
  /**
  * delete
  * @param
  *
  * @return
  */     
  async delete(): Promise<void>
  {
    try {
      const chat = await LibChat.delete(Number(this.props.id));
      console.log(chat);
      Router.push('/chats');
    } catch (error) {
      console.error(error);
      alert("Error, update")
    }    
  }
  //  
  render() {
//console.log(this.props);
    return (
    <Layout>
      <main>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <Link href="/chats">
                <a className="btn btn-outline-primary mt-2">Back</a>
              </Link>
            </div>
            <div className="col-md-4"><h3>Chat - Edit</h3>
            ID: {this.props.id}
            </div>
            <div className="col-md-4 text-center">
            </div>
          </div>
          <hr className="mt-1 mb-2" />
          <div className="col-md-6 form-group">
            <label>Name:</label>
            <input type="text" className="form-control" name="name" id="name" 
            defaultValue={this.state.name}/>
          </div>
          <hr />
          {this.state.button_display ? (
            <div className="form-group my-2">
              <button className="btn btn-primary" onClick={() => this.update()}>Save
              </button>
              <hr className="my-2" />
              <button className="btn btn-danger" onClick={() => this.delete()}>Delete
              </button>
            </div>
          ): (<div />)
          }
        </div>
      </main>
    </Layout>
    )    
  } 
}
export const getServerSideProps = async (ctx: any) => {
  const id = ctx.query.id;
console.log(id);
  return {
    props: { id: id},
  }
}

/*
   async get(): Promise<any>
   {
     try {
       const url = process.env.MY_API_URL + "/chats/show/" + this.props.id;
       const res = await fetch(url, { method: 'GET',});
       const json = await res.json();
       console.log(json);
       if(json.ret !== 'OK'){
         throw new Error('Error , fetch');
       }
       return json.data;
     } catch (error) {
       console.error(error);
       alert("Error, get")
     }    
   } 

*/