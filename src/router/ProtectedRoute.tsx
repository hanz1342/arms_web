import { useRouter } from 'next/router';

interface ProtectedRouteProps {
   children: any
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const router = useRouter();

  // Replace with your authentication check logic
  const isAuthenticated = !!localStorage.getItem('userToken');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return props.children;
};

export default ProtectedRoute;
