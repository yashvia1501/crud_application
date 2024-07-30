import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaSearch } from "react-icons/fa";

function Function() {
    const[posts,setPosts]=useState([])
    const[originalposts,setoriginalPosts]=useState([])
    const[editDetails, setEditDetails]=useState('')
    const[tempData,setTempdata]=useState({})
    const[array, setArray]=useState([])
    // const[name,setName]=useState('')
    // const[email,setEmail]=useState('')
    // const[role,setRole]=useState('')
    const [details,setDetails] = useState({
        name:"",
        role:"",
        email:""
    })

    useEffect(()=>{
        axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then(response=>{
            setPosts(response.data)
            setoriginalPosts(response.data)
        })
        .catch(error=>{
            console.log('error detected')
        })
    },[])
    const HandleDelete=(value)=>{
        setPosts(posts.filter(post=>post.id !==value))
    }
    const HandleSearch=(e)=>{
     const SearchData=originalposts.filter(item=>item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
     item.role.toLowerCase().includes(e.target.value.toLowerCase()) ||
     item.email.toLowerCase().includes(e.target.value.toLowerCase())
    )
    
    setPosts(SearchData)
    }
    const InputnewData=(e)=>{
        setDetails({...details,[e.target.name]:e.target.value})
        
        // if(e.target.name==="email"){
        //     setEmail(e.target.value)
        // }
        // else if(e.target.name==="role"){
        //     setRole(e.target.value)
        // }   
    }
    const HandleSubmit=()=>{
        // if(typeof details.name !== 'string' || details.name=== ''){alert("please enter correct name")}
        // if(!details.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){ alert("please enter correct email")}
        // if(!(details.role === 'member' || details.role === 'admin')) { alert("please enter correct role")}
        {onValidate()}

        const obj={
            id:Math.random(),
            name:details.name,
            email:details.email,
            role:details.role,
        }
        if(obj.name==='' || obj.email==='' || obj.role==='') return ;
        setPosts([obj,...posts]) 
        setoriginalPosts([obj,...originalposts])
        
        setDetails({
            name:'',
            email:"",
            role:""
         }) 
    }

    const onEdit = (value) => {
     const tempData=posts.find(post=>post.id===value)
     setEditDetails(value)
     setTempdata(tempData);
    }

    const HandleEdit=(e,field)=>{
        console.log(e.target.value)
       setTempdata({
            ...tempData,
            [field] : e.target.value
        }) 
        
        
    }

    const HandleSave=()=>{
      const updatedPosts=posts.map(post=>post.id===tempData.id ? tempData : post)
      if(tempData.name==='' || tempData.email==='' ||  (tempData.role !== 'member' && tempData.role !== 'admin')){
        alert("You did not enter the correct data")
        setEditDetails('')
        return ; 
      }
      setPosts(updatedPosts)
      setEditDetails('')
    }
    const HandleCheckbox=(value,check)=>{
      if(check){
            setArray([...array, value])
        }
        else {
            setArray(array.filter(item => item !== value));
        }
    } 
    console.log(array, "array");

    const HandleSelectedDelete=()=>{
        const updatedpost = posts.filter((data) => !array.includes(data.id));
        setPosts(updatedpost);
    }
    const onValidate=()=>{
        if(typeof details.name !== 'string' || details.name=== ''){alert("please enter correct name")}
        if(!details.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){ alert("please enter correct email")}
        if(!(details.role === 'member' || details.role === 'admin')) { alert("please enter correct role")}
     }
    
    
    
   
    // setName(e.target.value)-one of the method
  return (
    <div>
        <div className='newEntry'>
        <input type='text' name="name" value={details.name} onChange={(e)=>InputnewData(e)} placeholder='name'/>
        <input type='email' name="email" value={details.email} onChange={(e)=>InputnewData(e)} placeholder='email'/>
        {/* <input type='text' name="role" value={details.role}  onChange={(e)=>InputnewData(e)} placeholder='role'/> */}
        <select name="role" value={details.role}  onChange={(e)=>InputnewData(e)} placeholder='role'>
        <option value="" disabled selected hidden>role</option>
            <option>member</option> <option>admin</option>
        </select>
        <button onClick={()=>HandleSubmit()} >SUBMIT</button>
        </div>

        {/* on search */}
        
        <div className='table-responsive'>
        <input className='searchBar' type='text' onChange={(e)=>HandleSearch(e)} placeholder='search' ></input>
        <FaSearch className='search-icon' />
        <table className='table'>
        <thead>
            <tr>
                <th></th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            
        {
            
          posts.map(post=><tr key={post.id}>
            <td><input type='checkbox' onChange={(e)=>HandleCheckbox(post.id, e.target.checked)}></input></td>
            {editDetails===post.id ?
            <>
             <td><input value={tempData.name} onChange={(e) =>HandleEdit(e,"name")} /></td>
             <td><input value={tempData.email} onChange={(e) =>HandleEdit(e,"email")} /></td>
             <td><input value={tempData.role} onChange={(e) =>HandleEdit(e,"role")} /></td>
             <td><button onClick={HandleSave}>Save</button></td>
             </>
             :
             <>
             <td>{post.name}</td>
             <td>{post.email}</td>
             <td>{post.role}</td>
             <td>
                 <button onClick={()=>HandleDelete(post.id)} style={{width:'100px', marginRight:'3px'}}>DELETE</button>
                 <button onClick={() => onEdit(post.id)} style={{width:'100px', marginRight:'3px'}}>EDIT</button>
             </td>
             </>
            }
            
          </tr>
          
            
          )
        }
         <tr>
            <td colSpan="5">
            <button onClick={HandleSelectedDelete}>Delete Selected</button>
            </td>
        </tr>
        
        </tbody>
        </table>
       
        </div>
        
    </div>
  )
}

export default Function
