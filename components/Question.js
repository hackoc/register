import { useEffect, useState } from 'react';
import styles from '../styles/Question.module.css';

export function id () {
    return Math.floor(Math.random() * 1000) + '000' + Date.now();
}

export default function Modal ({ question, data, setData }) {
    const { type, placeholder, name, required, description } = question;
    const key = id();
    return (
        <>
            <div style={{
                marginTop: '3rem',
                marginBottom: 'calc(3rem + 10px)'
            }}>
                <center>
                    <div style={{
                        width: '500px',
                        maxWidth: 'calc(100vw - 60px)',
                        textAlign: 'left',
                        marginLeft: '20px'
                    }}>
            <label for={key}>{name}</label>
                    <small style={{ display: 'block', marginTop: '0.3rem', marginBottom: '0.5rem' }}>{description}</small>
            </div>
                </center>
        <center style={{
          position: 'relative',
          height: '55px'
            }}>
            <center className={styles.inputCenter} style={{
          display: 'block',
          marginTop: '2rem',
          display: 'flex',
          position: 'absolute',
          top: '0px',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div style={{
            background: 'white',
            padding: '0px',
            borderRadius: '8px',
            maxWidth: 'calc(100vw - 60px)',
            height: '52px',
            textAlign: 'center',
            boxSizing: 'border-box',
            width: '500px'
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
            <input id={key} name={key} type={type} placeholder={placeholder} required={required} style={{
              position: 'absolute',
              border: 'none',
              width: 'calc(100%)',
              background: 'transparent',
              height: '100%',
              top: '0px',
              left: '0px',
              outline: 'none',
              fontSize: '18px',
              padding: '13px',
              color: 'black',
              fontFamily: 'var(--font-stack)',
              cursor: 'text'
            }} />
          </div>
          </div>

          </center>
          </center>

            </div>
        </>
    )
}
