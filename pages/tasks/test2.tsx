/*
* timer sample
*/

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Layout from '@/components/layout'
import LibChatPost from '@/lib/LibChatPost'
import LibStorage from '@/lib/LibStorage';
//
LibStorage.set_exStorage("auto_update", 1)
//
function Sample() {
	const router = useRouter();
	const queryParamas = router.query;
	const id = queryParamas.id;
//console.log(queryParamas);
//console.log("id=", id);
  const [time, updateTime] = useState(Date.now());
  const interval = 1000;
  //init
  useEffect(() => {
    console.log("#init");
  }, []);
  //timer
  useEffect(() => {
    const timeoutId: any = setTimeout(() => updateTime(Date.now()), interval);
    let valid = LibChatPost.postUpdate();
console.log("show.valid=", valid);
    if(valid) {
      console.log("#execute_update");
      //todo
    }
    return () => {
        clearTimeout(timeoutId);
    };
  }, [time]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <>
      <h3>timer Sample</h3>
      <div>
      </div>
      </>
    </Layout>
  );
}
export default Sample;