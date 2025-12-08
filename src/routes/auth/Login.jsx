import './auth.css';
import Input from '../../components/general/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';

function Login({ username, password, setUsername, setPassword }) {
  return (
    <div className="auth-content">
      <div className="auth-field">
        <Input
          label="Username:"
          type="text"
          value={username}
          setValue={setUsername}
          icon={<FontAwesomeIcon icon={faUser} />}
        />
      </div>

      <div className="auth-field">
        <Input
          label="Password:"
          type="password"
          value={password}
          setValue={setPassword}
          icon={<FontAwesomeIcon icon={faKey} />}
        />
      </div>
    </div>
  );
}

export default Login;
