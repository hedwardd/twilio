import React, { useState, useEffect } from 'react';

async function textFriend(_id) {
  const response = await fetch(`/api/friends/${_id}/text`);
  if (response.status !== 200) return null;
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

async function deleteFriend(_id) {
  const response = await fetch(`/api/friends/${_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 200) return null;
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

function FriendsList (props) {
  const [friends, setFriends] = useState([]);
  const [toFetch, setToFetch] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      const response = await fetch('/api/friends');
      const data = await response.json();
      if (data) setFriends(data);
      setToFetch(false);
    }
    if (toFetch) fetchFriends();
  }, [toFetch]);


  return (
    <div className="App">
      {/* Render the passwords if we have them */}
      {friends.length ? (
        <div>
          <h1>Friends</h1>
          <ul className="friends">
            {/*
              Generally it's bad to use "index" as a key.
              It's ok for this example because there will always
              be the same number of passwords, and they never
              change positions in the array.
            */}
            {friends.map((friend, index) =>
              <li className="friend" key={index}>
                <p>{friend.name}</p>
                <p>{friend.number}</p>
                <button onClick={() => textFriend(friend._id)}>
                  Text
                </button>
                <button onClick={() => deleteFriend(friend._id)}>
                  Delete Friend
                </button>
              </li>
            )}
          </ul>
          <button
            className="more"
            onClick={() => setToFetch(true)}>
            Refresh
          </button>
        </div>
      ) : (
        // Render a helpful message otherwise
        <div>
          <h1>No friends :(</h1>
          <button
            className="more"
            onClick={() => setToFetch(true)}>
            Try Again?
          </button>
        </div>
      )}
    </div>
  );
}

export default FriendsList;
