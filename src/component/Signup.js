import React,{useState} from 'react'
import {  useNavigate } from 'react-router-dom'


const Signup = (props) => {
  const[credentials, setCredentials]=useState({name: "", email: "", password: "",cpassword: ""})
  let navigate =useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = credentials
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
           
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },

        body: JSON.stringify({name, email, password}),
    });
    const json = await response.json()
    console.log(json);
    if (json.success) {
        // save token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/home");
        props.showAlert("Account is create successfully","success");

        
    }
    else{
        props.showAlert("credential is invalide","danger");
    }
}
  const onChange =(e)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
}
  return (
    <div className='container my-2'>
      <h2>Signup to use Notebook</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" onChange={onChange} name = "name" aria-describedby="emailHelp"/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" onChange={onChange} name = "email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" onChange={onChange} name='password' minLength={5}required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">confirm Password</label>
    <input type="password" className="form-control" id="cpassword" onChange={onChange} name ="cpassword" minLength={5}required/>
  </div>
 
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
