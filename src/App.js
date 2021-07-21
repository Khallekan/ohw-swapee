import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';

const App = () => {
    return (
        <div className='App'>
            <Router>
                <Switch>
                    <Route path='/signin' component={SignIn} />
                    <Route path='/signup' component={SignUp} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
