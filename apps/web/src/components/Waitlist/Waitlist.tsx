import { Button } from '../ui/button';
import { Input } from '../ui/input';
import S from './Waitlist.module.css';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useState, useEffect, SetStateAction, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Loader2 } from 'lucide-react';
import Logo from "../../assets/Logo.svg";
import Introanimation from '../Animation/Introanimation';


export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [className, setClassName] = useState(S.button);
  const [clicked, setClicked] = useState(false);
  const [text, setText] = useState('');
  const buttonRef=useRef<HTMLButtonElement>(null);


  useEffect(() => {
    // Establish WebSocket connection when component mounts
    try {
      const ws =  new WebSocket("wss://collide-test.up.railway.app/");
      ws.onopen = () => {
        console.log('Connected to WebSocket server');
      };
  
      ws.onmessage =async (event) => {
        const data = await JSON.parse(event.data);
        if (data.count !== undefined) {
          setUserCount(data.count);
        }
      };
  
   
      ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };
  
      return () => {
        ws.close();
      };
    } catch (error) {
      console.log('Error:', error);
    }
    
  }, []);

  const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  }

  const isValidEmail = (test: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(test);
  }

  const handleSubmit = async () => {
    setClicked(true);
    if (isValidEmail(email)) {
      try {
        setButtonDisabled(true);
        setClassName(S.buttonDisabled);
        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        };    

        const response = await axios.post(`https://collide-test.up.railway.app/submit`, { email },{headers:headers});
        if(response.status===200){
          setEmail("");
          setText('');
        }else{
          setText("Some error occured");
        }
        setButtonDisabled(false);
        setClassName(S.button);
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      setText('Enter a valid email address');
    }
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter' && buttonRef.current) {
      buttonRef.current.click();
    }
  }

  return (
    <>
    <div className={S.animate}>
    <Introanimation />
    </div>
    <>

    <div className={S.App}>
      <Card className={S.Waitlistbox}>
        <div className={S.logo}>
          <img src={Logo} alt="logo" />
        </div>
        <CardHeader className={S.header}>
          <CardTitle className={S.boxTitle}>
            <p> <span className={S.themeFont}>Something’s</span>  cooking </p>
          </CardTitle>
          <div className={S.fireContainer}>
            <Player
              className={S.fire}
              src="https://lottie.host/b00042d8-47f0-4adc-bf28-c91382ebadd9/rOhxjAuKus.json"
              loop
              autoplay
            ></Player>
          </div>
        </CardHeader>
        <CardDescription className={S.boxDescription}>Be among the first to explore an innovative platform redefining how you engage with others. Prepare to dive into a realm of endless intrigue and unexpected connections, where every interaction unveils new mysteries. Secure your place now to become part of a groundbreaking experience.</CardDescription>
        <CardContent className={S.WaitlistContent}>
          <span className={S.themeFont}>Join our</span> waiting list<span className={S.themeFont}> to get updated asap</span>
        </CardContent>
        <CardContent className={S.container}>
          <Input type="email" placeholder="Email" className={S.email_input} onChange={onChange} onKeyDown={handleKeyDown} value={email} />
          
          <Button ref={buttonRef} className={S.button} onClick={handleSubmit} disabled={buttonDisabled} >
            {buttonDisabled ? <Loader2 className={S.loader} /> : <>Join waitlist 
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className='arrow'>
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg></>}
          </Button>
        </CardContent>
        {!isValidEmail(email) && clicked && <div className={S.error}>{text}</div>}
        <CardContent className={S.userCount}>
          {userCount} USERS WAITING
        </CardContent>
      </Card>
    </div>
    </>
    </>
  );
}
