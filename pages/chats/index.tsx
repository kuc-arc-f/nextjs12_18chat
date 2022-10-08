import {useState, useEffect}  from 'react';
import React from 'react';

import Link from 'next/link';
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'
import LibChat from '@/lib/LibChat';

const perPage = 100;
//
interface IProps {
  items: Array<object>,
  history:string[],
  projectId: string,
}
interface IState {
  items: any[],
  items_all: any[],
  perPage: number,
  offset: number,
  pageCount: number,
  button_display: boolean,
  userId: number | null,
  type_complete: number,
  project: any,
}
//
export default class ChatIndex extends React.Component<IProps, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, 
      button_display: false, userId: 0, type_complete: 0,
      project: {}
     };
//console.log(props);  
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
    const uid = LibCookie.getCookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
      return;
    }
    const items = await LibChat.getItems();
console.log(items);
    this.setState({
      items: items, items_all: [], button_display: true, pageCount: 0,
      userId: Number(uid),  project: {}, 
    })  
  }
  /**
  * clickClear
  * @param
  *
  * @return
  */  
  async clickClear() {
    try {
      const searchKey = document.querySelector<HTMLInputElement>('#searchKey');
      // @ts-ignore
      searchKey.value = "";
      const items = await LibChat.getItems();
console.log(items); 
      this.setState({ items: items});
    } catch (e) {
      console.error(e);
      throw new Error('Error , clickClear');
    } 
  }
  /**
  * clickSearch
  * @param
  *
  * @return
  */  
  async clickSearch() {
    try {
      const searchKey = document.querySelector<HTMLInputElement>('#searchKey');
      // @ts-ignore
      const skey = searchKey.value;
      const items = await LibChat.search(skey);
//console.log(items);
      this.setState({ items: items }); 
    } catch (e) {
      console.error(e);
      throw new Error('Error , clickClear');
    } 
  }
  //
  render(){
    const data = this.state.items;
//console.log(this.state.userId);
    return(
    <Layout>
      <>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container mt-1 mb-4 bg-white">
        <div className="row">
          <div className="col-md-7"><h3>{""}</h3>
          </div>
          <div className="col-md-5 text-center">
            <Link href={`/chats/create`}>
              <a><button className="btn btn-sm btn-primary mt-0">Create</button>
              </a>
            </Link>
          </div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-12 pt-1">
            <button onClick={() => this.clickClear()} className="btn btn-sm btn-outline-primary">Clear
            </button>            
            <span className="search_key_wrap">
              {/* form-control form-control-sm */}
              <input type="text" size={36} className="mx-2 " name="searchKey" id="searchKey"
              placeholder="Search Key" />        
            </span>
            <button onClick={() => this.clickSearch()} className="btn btn-sm btn-outline-primary">Search
            </button>            
          </div>
        </div>        
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-12">
          {this.state.items.map((item: any ,index: number) => {
//console.log(item.userId, this.state.userId);
            return (
              <div key={item.id}>
                <Link  href={`/chats/show?id=${item.id}`}>
                  <a><span className="task_title fs-5"><h3 className="py-1">{item.name}</h3>
                    </span>
                  </a>
                </Link>
                <span>ID: {item.id}</span>
                {this.state.userId === item.userId ? (
                  <Link  href={`/chats/edit?id=${item.id}`}>
                    <a><span className="btn btn-sm btn-outline-primary mx-2">Edit
                      </span>
                    </a>
                  </Link>                
                ): (
                  <span></span>
                )}                 
                <hr />
              </div>
            )
          })}            
          </div>
        </div>
        {/* data */}      
        <hr />
      </div>
      <style>{`
      `}</style>
      </>
      {/* font-size: 2.4rem;*/}
    </Layout>
    );
  }
}
export const getServerSideProps = async (ctx: any) => {
//  const id = ctx.query.project;
//console.log(id);
  return {
//    props: { projectId: id },
    props: { projectId: 0},
  }
}