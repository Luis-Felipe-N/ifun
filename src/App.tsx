import { Switch, Route, BrowserRouter} from 'react-router-dom'

import { Login } from './page/Login'
import { SingUp } from './page/SingUp'
import { Home } from './page/Home'
import { CreateMeme } from './page/CreateMeme';
import { Perfil } from './page/Pefil';

import { AuthContextProvider } from './context/AuthContext'
import { MemeConetextProvider } from './context/MemeContext';
import Footer from './component/Footer';
import Categories from './page/Categories';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <AuthContextProvider>
                    <MemeConetextProvider>
                        <Route path="/" exact component={ Home } />
                        <Route path="/login" component={ Login } />
                        <Route path="/singup" exact component={ SingUp } />
                        <Route path="/create" component={ CreateMeme } />
                        <Route path="/user/:id" component={ Perfil }/>
                        <Route path="/categories/:categorie" component={ Categories } />
                        <Footer />
                    </MemeConetextProvider>
                </AuthContextProvider>
            </Switch>
        </BrowserRouter>
        
    );
}

export default App;
