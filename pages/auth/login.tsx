import React, {Component} from 'react';
import Link from 'next/link';
import Layout from '@/components/layout'
import LoginBox from '@/components/auth/LoginBox';
import LibCookie from '@/lib/LibCookie'

interface IProps {
  history:string[],
  tasks: any[],
}
interface IObject {
  id: number,
  title: string
}
//
function Page(props:IProps) {
//console.log(props.tasks);

  /**
  * handleSubmit
  * @param
  *
  * @return
  */ 
  const handleSubmit = async (event: any) => {
    try{
      event.preventDefault();
      const key: any = process.env.COOKIE_KEY_USER_ID;
      const { email, password } = event.target.elements;
      const item = {
        email: email.value,
        password: password.value,
      }
      //console.log(item); 
      const res = await fetch(process.env.MY_API_URL + "/users/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify(item),
      });
      const json = await res.json();
//console.log(json);   
      if (res.status != 200) {
        throw new Error(await res.text());
      }
      if (json.ret != 'OK') {
        alert("Error, login")
        return
      }
      //console.log(key, json.data);
      LibCookie.setCookie(key, json.data.id);
      window.location.href = '/'  
    } catch (e) {
      console.error(e);
    }    
  } 
   
  return (
  <Layout>
    <div className="container py-4">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <LoginBox />
        <div>
          <button className="btn btn-primary">Login</button>
        </div>
      </form>
      <hr />
      <div>
      <Link href="/auth/sign_up">
        <a><button className="btn btn-outline-primary">SignUp</button></a>
      </Link>        
      </div>      
    </div>
  </Layout>
  );
}

export default Page;

