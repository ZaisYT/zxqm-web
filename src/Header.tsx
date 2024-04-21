import { Link } from 'react-router-dom';
import './css/Header.css';

type StorageType = "local" | "session";

export const Header = () => {
  function addToStorage(storagetype: StorageType, storagekey: string, text: string) {
    if (storagetype == "local") localStorage.setItem(storagekey, text);
    else if (storagetype == "session") sessionStorage.setItem(storagekey, text);
    else console.error("Not a valid storagetype");
  }

  return (
    <div className="header-wrapper">
      <div className='zxqm-header'>
        <div className='first'>
          <Link to="/" onClick={() => { addToStorage("local", "lastPage", "") }}>ZXQM</Link>
        </div>

        <div>
          <ul>
            <li>
              <Link className='search' to="search" onClick={() => { addToStorage("local", "lastPage", "search") }} />
            </li>
            <li>
              <Link className='about' to="about" onClick={() => { addToStorage("local", "lastPage", "about") }} />
            </li>
            <li>
              <Link className='config' to="config" onClick={() => { addToStorage("local", "lastPage", "config") }} />
            </li>
            <li>
              <Link className='account' to="account" onClick={() => { addToStorage("local", "lastPage", "account") }} />
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
