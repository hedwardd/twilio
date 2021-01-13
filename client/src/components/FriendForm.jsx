import React, { useState, useEffect } from 'react';

const InitState = {name: '', number: '',}

const postFriend = async (formValues) => {
  // Post friend to friends endpoint
  const response = await fetch('/api/friends', {
    method: 'POST',
    body: JSON.stringify(formValues),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 200) return null;
  const responseData = await response.json();
  return responseData;
}


function FriendForm (props) {

  const [formValues, setFormValues] = useState(InitState);
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setIsSubmitting(true);
    const result = await postFriend(formValues);
    // setIsSubmitting(false);
    if (result.error) {
      // setMessage(result.error);
      console.log(result.error);
    } else if (result) {
      // setMessage('Your listing was successfully added!');
      setTimeout(() => {
        // setMessage('');
        setFormValues(InitState);
      }, 3000);
    } 
    // else {
    //   setMessage('Something went wrong.  Please try again.');
    //   setTimeout(() => {
    //     setMessage('');
    //   }, 3000);
    // }
  };

  return (
    <form
      className="form"
      onSubmit={(event) => handleSubmit(event)}
    >
      <h2>
        Add Friend
      </h2>
      <label>
        <p>Name</p>
        <input
          type="text"
          required
          id="name"
          name="name"
          label="Name"
          value={formValues.name}
          onChange={(event) => handleChange(event)}
        />
      </label>
      <label>
        <p>Number</p>
        <input
          type="text"
          required
          id="number"
          name="number"
          label="Number"
          value={formValues.number}
          onChange={(event) => handleChange(event)}
        />
      </label>
      <input
        type="submit"
        value="Submit"
      />
    </form>
  );
}

export default FriendForm;

