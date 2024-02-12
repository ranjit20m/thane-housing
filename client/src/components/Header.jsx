import { FaSearch } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const { currentUser } = useSelector(state => state.user); // name of userSlice is user
  return (
    <header className="bg-slate-200 shadow-md">        
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            {/* Logo */}
            <Link to="/">
                <h1 className="font-bold text-sm sm:text-xl flex-wrap">
                    <span className="text-slate-500">Thane</span>
                    <span className="text-slate-700">Housing</span>
                </h1>
            </Link>
            {/* Searchbar */}
            <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
                <FaSearch className='text-slate-600' />
            </form>
            {/* Menu */}
            <ul className='flex gap-4'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>
                    <Link to="/">Home</Link>
                </li>
                <li className='hidden sm:inline text-slate-700 hover:underline'>
                    <Link to="/about">About</Link>
                </li>                
                {/* {currentUser ? () : ()} */}
                <Link to="/profile">
                    {currentUser ? (
                        <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile' />
                    ) : (
                        <li className='text-slate-700 hover:underline'>Sign in</li>
                    )}
                </Link>
            </ul>
        </div>        
    </header>
  )
}
export default Header