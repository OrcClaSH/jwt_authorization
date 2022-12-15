import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Context } from '../index';

const LoginForm: React.FC = () => {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const { store } = useContext(Context);

    return (
        <div>
            <input
                value={email}
                type="text"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
            />
            <input
                value={password}
                type="password"
                placeholder='Password'
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={() => store.login(email, password)}>
                Логин
            </button>
            <button onClick={() => store.registration(email, password)}>
                Регистрация
            </button>
        </div>
    )
};

export default observer(LoginForm);
