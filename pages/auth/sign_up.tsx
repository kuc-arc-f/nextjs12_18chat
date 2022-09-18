import React, {Component} from 'react';
import Layout from '@/components/layout'
import SignUpBox from '@/components/auth/SignUpBox';

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
    try {
      event.preventDefault();
      const { name, email, password } = event.target.elements;
  console.log(name.value, email.value);
      const item = {
        name: name.value,
        email: email.value,
        password: password.value,
      }
  console.log(item);
      const url = process.env.MY_API_URL + "/users/add";
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);   
      if (res.status != 200) {
        throw new Error(await res.text());
      }     
      window.location.href = '/auth/login';
    } catch (error) {
      console.error(error);
      alert("Error, addItem")
    }  
  /*
      createUserWithEmailAndPassword(auth, email.value, password.value)
      .then( async(userCredential) => {
        console.log('user created');
        console.log(userCredential.user);
        console.log(userCredential.user.uid);
        //
        alert("OK, save");
        location.href= '/auth/login';      
      })
  */
  } 
   
  return (
  <Layout>
    <div className="container py-4">
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit}>
        <SignUpBox />
        <div>
          <button className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </Layout>
  );
}


export default Page;

