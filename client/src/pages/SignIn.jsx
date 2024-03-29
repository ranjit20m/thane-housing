import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Using this hook we can dispatch the function we have
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'; // Import functions we created
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {loading, error} = useSelector((state) => state.user); // import error and laoding from global state - user
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();     
    try {
      dispatch(signInStart()) // setLoading(true);
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
      });      
      const data = await response.json(); // convert the respose we get to json
      console.log(data);
      if(data.success === false) {
        dispatch(signInFailure(data.message)) // setLoading(false); setError(data.message);        
        return;
      }
      dispatch(signInSuccess(data)) // setLoading(false); setError(null);
      navigate('/'); // if everything ok navigate to home page
    } catch (error) {
      dispatch(signInFailure(error.message)) // setLoading(false); setError(error.message)
    } 
  };
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={ handleSubmit }>        
        <input id="email" type="email" placeholder="email" className="border p-3 rounded-lg" onChange={ handleChange } />
        <input id="password" type="password" placeholder="password" className="border p-3 rounded-lg" onChange={ handleChange } />
        <button 
          disabled={loading} 
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign in'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}><span className='text-blue-700'>Sing up</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn;