import Link from 'next/link';
import Head from 'next/head';
import React from 'react'

interface IProps {
  messages_success: string,
  messages_error: string,
}
//
export default class Page extends React.Component<IProps> {
  componentDidMount(){
  }
  render(){
    let messages_success = ""
    if( typeof this.props.messages_success != 'undefined'){
      messages_success = this.props.messages_success
    }
    let messages_error = ""
    if( typeof this.props.messages_error != 'undefined'){
      messages_error = this.props.messages_error
    }
    return (
    <div>
      { messages_success ? 
      <div className="alert alert-success" role="alert">{messages_success}</div> 
      : <div /> 
      }
      { messages_error ? 
      <div className="alert alert-danger" role="alert">{messages_error}</div> 
      : <div /> }      
    </div>
    );
  }
}
