import { useState } from 'react'

import './App.css'

const UnAuthenticatedSection = ({ setIsAuthenticated }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 允許發送和接收 Cookie
      body: JSON.stringify({ username: userName, password: password }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setIsAuthenticated(true)
      })
  }

  return (
    <div>
      <input type="text" placeholder="Username:123" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <input type="password" placeholder="Password:321" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

const AuthenticatedSection = ({ setIsAuthenticated }) => {
  const [protectedInfo, setProtectedInfo] = useState([])

  const getProtectedInfo = () => {
    fetch('http://localhost:3000/protected-info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 允許發送和接收 Cookie
    })
      .then(res => {
        return res.json().then(data => {
          if (!res.ok) { // 检查响应状态码
            throw new Error(data.message);
          }
          return data;
        });
      })
      .then(data => {
        console.log(data)
        setProtectedInfo(data.data)
      })
      .catch(err => {
        alert(err.message)
      })
  }

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include', // 允許發送和接收 Cookie
    })
      .then(() => {
        setIsAuthenticated(false)
      })
  }


  return (
    <div>
      <button onClick={getProtectedInfo}>Get Protected Info in 10s</button>
      <button onClick={handleLogout}>Logout</button>
      {protectedInfo.length > 0 && (
        <table border={1}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {protectedInfo.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <>
      <h1>JWT try out</h1>
      {isAuthenticated
        ? <AuthenticatedSection setIsAuthenticated={setIsAuthenticated} />
        : <UnAuthenticatedSection setIsAuthenticated={setIsAuthenticated} />
      }
    </>
  )
}

export default App
