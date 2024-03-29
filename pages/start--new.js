import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Icon from '@hackclub/icons'
import Modal from '../components/Modal'
import Question from '../components/Question';
import { questions, sections } from '../lib/questions.js';
import { useEffect, useState } from 'react';

const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const timelapseId = "9x00RCb1N7WTpAl6cIN0000Kult00vyzslROW6A1RblWwxM"

// const timelapseId = "402YMZJfp6kW02302E3r1RMe013Ub9AqlPwzr4VjD00HO7ME"

export default function Home() {
  const [modal, setModal] = useState(false);
  const handleFormEnter = () => { 
    if (regex.test(email)) {
      fetch('https://ip.yodacode.xyz').then(res => res.json()).then(({ geo }) => {
        fetch('/api/v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            city: geo.city
          })
        }).then(() => {
          setSubmitted(true);
        });
      })
    }
  };
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params?.email) setEmail(params?.email);    
  }, []);
  return (
    <>
    <Modal visible={modal} setVisible={setModal}>
    <iframe src="https://bank.hackclub.com/donations/start/hackoc" style={{
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
      border: '2px solid var(--orange)'
    }}>

      </iframe>
    </Modal>
    <div className={styles.container} style={{
      position: 'relative',
      zIndex: '10',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Hack OC</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="background-charcoal color-white" style={{
          width: '100%',
          minHeight: '100vh',
          padding: '5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '35vh',
        }}>
          <a href="https://hackoc.org">
            <h1 className={styles.title}> 
              Hack <span className="color-orange" style={{
                marginLeft: '-12px',
                position: 'relative'
              }}>
                OC
                <img src="/orange.svg" style={{
                  position: 'absolute',
                  bottom: '50%',
                  left: '0px',
                  transform: 'translate(10%, 44.5%)'
                }} className="noselect" />
              </span>
            </h1>
          </a>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={`https://image.mux.com/${timelapseId}/thumbnail.png?width=214&height=121&fit_mode=pad`}
            duration={2000}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 'auto!important',
              width: '100% !important',
              minHeight: '100vh',
              objectFit: 'cover',
              zIndex: -1
            }}
        >
          <source src={`https://stream.mux.com/${timelapseId}.m3u8`} />
          <source src={`https://stream.mux.com/${timelapseId}/medium.mp4`} />
        </video>
        <p className={styles.description}>
          <span className="color-orange">
            <b>
              <Icon glyph="member-add" size={32} style={{
                transform: 'translate(2px, 6px)'
              }} />
            </b>
          </span>{' '}Registration
        </p>
        <center style={{
          position: 'relative',
          height: '55px'
        }}>
          <p style={{opacity: 0.7, color: 'white'}}>Let's start off with your email.</p>
          {!submitted &&
        <center className={styles.inputCenter} style={{
          display: 'block',
          marginTop: '2rem',
          display: 'flex',
          position: 'absolute',
          top: '0px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <div style={{
            background: 'black',
            padding: '0px',
            borderRadius: '6px',
            maxWidth: '300px',
            height: '53px',
            textAlign: 'center',
            boxSizing: 'border-box',
            width: '300px'
          }}>
          <div className={styles.input} style={{
            background:  'rgba(var(--orange-3-values), 0.3)',
            cursor: 'text',
            textAlign: 'center',
            transform: 'translate(0px, 0px)',
            margin: '0px',
            fontSize: '18px',
            padding: '13px',
            position: 'relative',
            boxSizing: 'border-box',
            height: '52px'
          }}>
            <input placeholder="Email" type="email" style={{
              position: 'absolute',
              border: 'none',
              width: 'calc(100% - 50px)',
              background: 'transparent',
              height: '100%',
              top: '0px',
              left: '0px',
              outline: 'none',
              fontSize: '18px',
              padding: '13px',
              color: 'white',
              fontFamily: 'var(--font-stack)',
              cursor: 'text'
            }} value={email} onKeyUp={e => {
              if (e?.key == 'Enter') handleFormEnter();
            }} onChange={e => setEmail(e.target.value)} />
          <button className={styles.button} style={{
            width: '40px',
            height: '40px',
            fontSize: '20px',
            padding: '6px',
            border: '1px solid var(--orange)',
            marginLeft: '20px',
            position: 'absolute',
            borderRadius: '2px',
            top: '4px',
            right: '4px',
            fontWeight: 'bolder'
          }} onClick={handleFormEnter}>
            →
          </button>
          </div>
          </div>

          </center>
}
          </center>
        </div>
        <Question question={sections[0].questions[0]} />
      </main>
      </div>
    </>
  )
}