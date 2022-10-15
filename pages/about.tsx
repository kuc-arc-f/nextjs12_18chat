import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '@/components/layout'

const About: React.FC = function () {

  const play = async function() {
//    const sound = document.querySelector<HTMLInputElement>('#notify_sound');
    const sound = document.querySelector<HTMLAudioElement>('#notify_sound');
    // @ts-ignore
    await sound.play();
    
  }

  return (
    <Layout>
    <div className="container test_wrap">
      <h1>About</h1>
      <hr />
      <p>chat App :</p>
      <p>https://github.com/kuc-arc-f/nextjs12_18chat</p>
      <style>{`
      .test_wrap .notify_audio{ display: none ;}
      `}</style>
    </div>
    </Layout>
  )
}
export default About;
