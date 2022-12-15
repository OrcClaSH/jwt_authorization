import React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import LoginForm from './components/LoginForm';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: React.FC = () => {
  const { store } = React.useContext(Context)
  const [users, setUsers] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, []);

  if (store.isLoading) {
    return <div><h2>Загрузка...</h2></div>
  };

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Получить список пользователей</button>
      </div>
    )

  };

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data)
      console.log(response.data)
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован - ${store.user.email}` : `Пользователь не АВТОРИЗОВАН!`}</h1>
      <h2>{store.user.isActivated ? 'Аккаунт подтвержден' : 'Необходимо подтвердить аккаунт'}</h2>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить список пользователей</button>
        {users.map(user =>
          <div key={user.email}>
            {user.email} - {user.isActivated.toString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(App);
