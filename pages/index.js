import { ethers } from 'ethers';
import Link from 'next/link';
import styles from '../styles/styles.module.css';
import { useEffect, useState } from 'react';

function HomePage() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

  useEffect(() => {
    setIsMetamaskInstalled(!!window.ethereum);
  }, []);

  async function handleMetamaskLogin() {
    try {
      if (!isMetamaskInstalled) {
        throw new Error("You must install Metamask");
      }

      // Check the ethers object for BrowserProvider
      console.log("Ethers object:", ethers); 

      const provider = new ethers.BrowserProvider(window.ethereum); // Ensure this is correct
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      

      const response = await fetch('api/nonce',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      if(!response.ok){
        const error = await response.json();
        console.log(error);
      }

      const resp = await response.json();
      const nonce = await resp.message;
      const signedMessage = await signer.signMessage(nonce);
      const data = {signedMessage, nonce, address};
      const authResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const tokenData = await authResponse.json();  // Store the token
      console.log(tokenData);
      
      if (authResponse.ok) {
        localStorage.setItem('token', tokenData.token);  // Store the token with a consistent key
        window.location.href = './protected-route';      // Redirect to protected route
      } else {
        console.error('Authentication failed:', tokenData.error);
      }
      

      window.location.href = './protected-route';


    } catch (error) {
      console.error("Failed to login with MetaMask", error.message);
      alert("Failed to login with MetaMask: " + error.message);
      return;
    }
  }

  return (
    <div className={styles.container}>
      <h1> Welcome, Please select an option to continue</h1>
      <div>
        <button className={styles.btn} onClick={handleMetamaskLogin}>Login with MetaMask</button>
        <br />
        <br />
      </div>
      <Link href="./signup"><button className={styles.btn}>Signup</button></Link>
    </div>
  );
}

export default HomePage;


