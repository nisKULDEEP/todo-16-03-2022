import React from 'react';


let Todo = () => {
    var [str, setStr] = React.useState("");
    var [todos, setTodos] = React.useState([]);
    var [loading, setLoading] = React.useState(true);
    var [err, setErr] = React.useState(false);
    var [count, setCount] = React.useState(1);
    var [page, setPage] =  React.useState(2);
    // console.log(count);

    function inputChange(e){
        let content = e.target.value;
        // console.log(content);
        setStr(content)
    }


    React.useEffect(() =>{
        getData();
    },[count, page])

    let getData = async () => {
   
        setLoading(true);
        setErr(false)
        fetch(`http://localhost:8080/lists?_page=${count}&_limit=3`)
        .then((res) => res.json())
       
        .then((res) => setTodos(res))
        .catch((error) =>{
            setErr(true);
            console.log(error)
        } )
        .finally(() => setLoading(false))
        setLoading(false)
        

        const res1 = await fetch(`http://localhost:8080/lists?_page=${count}&_limit=3`)
        const total = res1.headers.get('x-total-count')
        console.log(total)
        setPage(total);
    }
    // console.log(todos)
    let text = todos.map((e) => {
        
        return <div key={e.id}>{e.text}</div> ;
    })


    function saveLocal (){
        var data = {
            "text" : str,
            "status" : false
        }
        setLoading(true)
        data = JSON.stringify(data);
//POST METHOD
        fetch("http://localhost:8080/lists", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "application/json"
            }
        }).then(() => {
            getData(); 
        })
        .catch((err) => setErr(true))
        .finally(() => setLoading(false))
    }


    return (
    
        loading ? (<div>Loading Please Wait ☺</div>) : err ? (<div>Something went wrong</div> ):
        (<div className='container'>
            <p>TODO List</p>
            <input type="text" name="input" value={str} onChange={inputChange}/>
            <button onClick={() => saveLocal(str)}>ADD</button>
            <div className='textBox'>{text}</div>
            <button onClick={() => setCount(count-1)} disabled={count == 1}>Prev</button>
            <button onClick={() => setCount(count+1)} disabled = {count === Math.ceil(page/3)}>Next</button>
        
        </div>)
    )
}

export default Todo;