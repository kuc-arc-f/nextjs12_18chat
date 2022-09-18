import Link from 'next/link';
import Router from 'next/router'
//import flash from 'next-flash';
import React, {Component} from 'react';

import LibCookie from "@/lib/LibCookie";
//import LibTodo from "@/lib/LibTodo";
import Layout from '@/components/layout'

interface IState {
  title: string,
  content: string,
  _token: string,
  userId: string,
  button_display: boolean,
}
interface IProps {
  csrf: any,
  user_id: string,
}
//
export default class ChatCreate extends Component<IProps, IState> {
  static async getInitialProps(ctx: any) {
//console.log(json)
    return {}
  }  
  constructor(props: any){
    super(props)
    this.state = {
      title: '', content: '', _token : '', userId: '', button_display: false
    }
    this.handleClick = this.handleClick.bind(this);
//console.log(props)
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.getCookie(key);
//console.log( "user_id=" , uid)
    if(uid === null){
      Router.push('/auth/login');
    }else{
  //console.log(data.data.getToken);
      this.setState({
        userId: uid, button_display: true,
      });    
    }
  }   
  handleClick(){
    this.addItem()
  }
  /**
  * addItem
  * @param
  *
  * @return
  */     
  async addItem(): Promise<void>
  {
    try {
      const name = document.querySelector<HTMLInputElement>('#name');
      const item = {
        name: name?.value,
        content : '',
        userId:  this.state.userId,
      }
      const res = await fetch(process.env.MY_API_URL + "/chats/create", {
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
      alert("Error, addItem")
    }    
  } 

  render() {
console.log(this.state);
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
            <div className="col-md-4"><h3>Chat - Create</h3>
            </div>
            <div className="col-md-4 text-center">
              {this.state.button_display ? (
                <div className="form-group my-2">
                  <button className="btn btn-primary" onClick={this.handleClick}>Create
                  </button>
                </div>
              ): (<div />)
              }
            </div>
          </div>
          <hr className="mt-1 mb-2" />
          <div className="col-md-6 form-group">
            <label>Name:</label>
            <input type="text" className="form-control" name="name" id="name" />
          </div>
          <hr />
          {/*
          */}
        </div>
      </main>
    </Layout>
    )    
  } 
}

