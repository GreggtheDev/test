// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to the form, feed, and search input elements
  const postForm = document.getElementById("postForm");
  const feed = document.getElementById("feed");
  const searchInput = document.getElementById("search");

  // Function to load and display all tweets
  const loadTweets = () => {
    feed.innerHTML = ""; // Clear the feed
    const tweets = getTweets(); // Retrieve tweets from local storage
    tweets.forEach((tweet) => {
      const tweetElement = createTweetElement(tweet); // Create tweet element
      feed.appendChild(tweetElement); // Add tweet to the feed
    });
  };

  // Function to get tweets from local storage
  const getTweets = () => {
    return JSON.parse(localStorage.getItem("tweets")) || []; // Return parsed tweets or an empty array if none found
  };

  // Function to save tweets to local storage
  const saveTweets = (tweets) => {
    localStorage.setItem("tweets", JSON.stringify(tweets)); // Save tweets as a JSON string
  };

  // Function to create a tweet element
  const createTweetElement = (tweet) => {
    const div = document.createElement("div");
    div.classList.add("tweet"); // Add class to tweet element

    // Set the inner HTML of the tweet element
    div.innerHTML = `
            <p class="tweet-author">${tweet.author}</p>
            <p class="tweet-date">${new Date(tweet.date).toLocaleString()}</p>
            <p class="tweet-content">${tweet.content}</p>
            <p class="tweet-tags">${tweet.tags.join(", ")}</p>
            <button class="edit" data-id="${tweet.id}">Edit</button>
            <button class="delete" data-id="${tweet.id}">Delete</button>
        `;

    // Add event listeners for edit and delete buttons
    div
      .querySelector(".edit")
      .addEventListener("click", () => editTweet(tweet.id));
    div
      .querySelector(".delete")
      .addEventListener("click", () => deleteTweet(tweet.id));

    return div; // Return the tweet element
  };

  // Function to add a new tweet
  const addTweet = (tweet) => {
    const tweets = getTweets(); // Get current tweets
    tweets.push(tweet); // Add new tweet to the array
    saveTweets(tweets); // Save updated tweets
    loadTweets(); // Reload tweets to update the feed
  };

  // Function to edit an existing tweet
  const editTweet = (id) => {
    const tweets = getTweets(); // Get current tweets
    const tweet = tweets.find((t) => t.id === id); // Find the tweet to edit
    if (tweet) {
      // Populate form fields with tweet data
      document.getElementById("author").value = tweet.author;
      document.getElementById("content").value = tweet.content;
      document.getElementById("tags").value = tweet.tags.join(", ");

      deleteTweet(id); // Delete the tweet to prepare for update
    }
  };

  // Function to delete a tweet
  const deleteTweet = (id) => {
    let tweets = getTweets(); // Get current tweets
    tweets = tweets.filter((tweet) => tweet.id !== id); // Filter out the tweet to delete
    saveTweets(tweets); // Save updated tweets
    loadTweets(); // Reload tweets to update the feed
  };

  // Event listener for form submission to add a new tweet
  postForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    // Create a new tweet object
    const tweet = {
      id: Date.now(), // Use current timestamp as unique ID
      author: document.getElementById("author").value,
      content: document.getElementById("content").value,
      tags: document
        .getElementById("tags")
        .value.split(",")
        .map((tag) => tag.trim()), // Split and trim tags
      date: new Date(), // Use current date and time
    };

    addTweet(tweet); // Add the new tweet
    postForm.reset(); // Reset the form fields
  });

  // Event listener for search input to filter displayed tweets
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase(); // Get and convert search input to lowercase
    const tweets = getTweets().filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(searchValue) ||
        tweet.tags.some((tag) => tag.toLowerCase().includes(searchValue))
    ); // Filter tweets based on search input

    feed.innerHTML = ""; // Clear the feed
    tweets.forEach((tweet) => {
      const tweetElement = createTweetElement(tweet); // Create tweet element
      feed.appendChild(tweetElement); // Add filtered tweet to the feed
    });
  });

  loadTweets(); // Initial load of tweets when the page loads
});
