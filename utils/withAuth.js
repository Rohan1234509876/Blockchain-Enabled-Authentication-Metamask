import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const token = localStorage.getItem('token');  // Retrieve the token

          if (token) {
            const response = await fetch('/api/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Send token in Authorization header
              },
            });

            const result = await response.json();
            if (result.message === 'Valid') {
              setIsAuthenticated(true);  // Token is valid, allow access
            } else {
              localStorage.removeItem('token');  // Remove invalid token
              router.push('/');  // Redirect to login
            }
          } else {
            router.push('/');  // No token, redirect to login
          }
        } catch (err) {
          console.error('Error during authentication:', err);
          router.push('/');  // Redirect to login on error
        }
      };

      checkAuthentication();
    }, [router]);

    if (!isAuthenticated) {
      return <p>Loading...</p>;  // Show loading state until authentication is done
    }

    return <Component {...props} />;  // Render the protected component after authentication
  };

  return Auth;
};

export default withAuth;


