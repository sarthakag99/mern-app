import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './App.css'
import * as styles from './App.module.css' 
function App() {
   
  const [state, setState] = useState({
    title: '',
    body: '',
    posts: []
  });

  //class based
  // const componentDidMount = () => {
  //   getBlogPost();
  // }

  //function based <-------------- (function based) useEffect() = (class based) componentDidMount() -------------->

  // <--------------THEORY-------------->
  // Passing [] as the second argument, useEffect to behave like componentDidMount as this tells useEffect that your effect isn’t dependent on any values from props or state thus never re-running. By default useEffect() would run on every update on the component but by passing an array of dependencies, in this case no dependencies so it never runs again.
  // By adding dependencies for example:

  // useEffect(()=>{
  //   getBlogPost();
  // },[someFunction])

  // Instead of passing through no dependencies we now pass someFunction. By doing this when someFunction changes the function shall be run again, this is essentially ComponentDidUpdate().
  // <--------------END THEORY-------------->

  useEffect(() => {
    getBlogPost();
  },[]);

  const getBlogPost = () => {
    axios.get('/api')
      .then((response) => {
        const data = response.data;
        setState((previousData) => {
          return {
            ...previousData,
            posts: data
          };
        });

        console.log('Data has been recieved!!');
      })
      .catch(() => {
        alert('Error retrieving data!!');
      });;

  }

  const handleChange = (event) => {

    // const name = event.target.name;
    // const value = event.target.value;
    const { name, value } = event.target;

    setState((prevData) => {
      return {
        ...prevData,
        [name]: value
      };
    });
  }

  const submit = (event) => {
    event.preventDefault();

    const payload = {
      title: state.title,
      body: state.body
    };

    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
    })
      .then(() => {
        console.log('Data has been sent to the server');
        resetUserInputs();
        getBlogPost();
      })
      .catch(() => {
        console.log('Internal server error');
      });;
  }; 

  const resetUserInputs = () => {
    // setState({
    //   title: '',
    //   body: ''
    // });
    setState((previousDataEntry) => {
      return {
        ...previousDataEntry,
        title: '',
        body: ''
      };
    });
  };

  const displayBlogPost = (posts) => {
    if (!posts.length) return null;

    return posts.map((post, index) => (
      <div key={index} className={styles['blog-post-display']}>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    ));
  };


  console.log(state);
  return (

    <div className={styles.app}>
      <h2>welcome folks!! This is clone for classroom</h2>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles['form-input']}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={state.title}
            onChange={handleChange} />
        </div>
        <div className={styles['form-input']}>
          <textarea
            placeholder="Body"
            name="body"
            col="30"
            rows="10"
            value={state.body}
            onChange={handleChange} />
        </div>
        <button className={styles.btn}>Submit</button>
        <div className="blog-post">
          {displayBlogPost(state.posts)}
        </div>
      </form>
    </div>
  );   
}

export default App;