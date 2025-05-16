import { useState,useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"
import axios from "axios"

function Updateusers(){
    const {id}=useParams()
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [age,setAge]=useState()
    const navigate =useNavigate()
useEffect(()=>{
    axios.get(`http://localhost:3000/getusers/`+id)
    .then(result => {
        console.log(result); 
        setName(result.data.name);
        setEmail(result.data.email);
        setAge(result.data.age);
    })
    .catch((err)=>console.log(err));
},[id]);

    const update=(e)=>{
        e.preventDefault()
        axios.put(`http://localhost:3000/updateUsers/`+id,{name,email,age})
        .then(result=>console.log(result))
        navigate('/')
        .catch(err=>console.log(err))
    }
    return(
        <>
        <div className="update-form-page">
            
                <form action="" onSubmit={update} className="update-form">
                <div className="inputs">
                    <label htmlFor="name">Name:</label>
                    <input type="text" 
                    name="name" 
                    id="name"  
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Name"/>
                </div>
                <div className="inputs">
                    <label htmlFor="email">Email:</label>
                    <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Email"/>

                </div>
                <div className="inputs">
                    <label htmlFor="age">Age:</label>
                    <input 
                    type="text" 
                    name="age" 
                    id="age"
                    value={age}
                    onChange={(e)=>setAge(e.target.value)}
                    placeholder="Age" />
                </div>
                <button>Update</button>
            </form>
            

            
        </div>
        
        </>
    )
}
export default  Updateusers