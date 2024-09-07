import { Route ,Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import EditorPage from './pages/Editor'
function App() {
  return (
   <div className='h-[100vh] w-[100vw] background-color overflow-hidden'>
     <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/editor/:roomId' element={<EditorPage></EditorPage>}></Route>
     </Routes>
   </div>
  );
}

export default App;
