import {useState, useEffect}  from 'react';
import React from 'react';

import Link from 'next/link';
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'

const perPage = 100;
interface IProps {
  items: Array<object>,
  history:string[],
  projectId: string,
}
interface IState {
  items: any[],
  items_all: any[],
  itemsNone: any[],
  itemsWorking: any[],
  itemsComplete: any[],
//  category: string,
  perPage: number,
  offset: number,
  pageCount: number,
  button_display: boolean,
  userId: string | null,
  type_complete: number,
  project: any,
}
//
export default class TaskIndex extends React.Component<IProps, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      itemsNone:[], itemsWorking:[], itemsComplete:[],
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, 
      button_display: false, userId: '', type_complete: 0,
      project: {}
     };
console.log(props);   
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
//console.log(url);
    if(uid === null){
      location.href = '/auth/login';
    }
    const url = process.env.MY_API_URL + "/chats/index";
    const response = await fetch(url);
    const json = await response.json();
console.log(json.data);
    //items = json.data;    
    this.setState({
      items: json.data, items_all: [], button_display: true, pageCount: 0,
      userId: uid,  project: {}, 
    })  

  }
  render(){
    const data = this.state.items;
//    const project = this.state.project;
console.log(data);
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
          <div className="col-md-12">
          {this.state.items.map((item: any ,index: number) => {
    //console.log(item.values.title);  created_at
            return (
              <div key={item.id}>
                <Link  href={`/chats/show?id=${item.id}`}>
                  <a>
                    <span className="task_title fs-5"><h3 className="py-1">{item.name}</h3>
                    </span>
                    ID : {item.id}
                  </a>
                </Link>
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
      .card_col_body{ text-align: left; width: 100%;}
      .card_col_icon{ font-size: 1.4rem; }
      .task_index_row .task_card_bg_blue{ background : #E3F2FD; }      
      .task_index_row .task_card_bg_gray{ background : #FFF3E0; }
      .task_index_row .card-body{ padding: 0.2rem; } 
      .task_index_row .task_title{ margin-bottom: 0.1rem; }  
      .task_index_row .task_date_area{ }   
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