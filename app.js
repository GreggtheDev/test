document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm");
  const feed = document.getElementById("feed");
  const searchInput = document.getElementById("search");

  const loadTweets = () => {
    feed.innerHTML = "";
    const tweets = getTweets();
    tweets.forEach((tweet) => {
      const tweetElement = createTweetElement(tweet);
      feed.appendChild(tweetElement);
    });
  };

  const getTweets = () => {
    return JSON.parse(localStorage.getItem("tweets")) || [];
  };

  const saveTweets = (tweets) => {
    localStorage.setItem("tweets", JSON.stringify(tweets));
  };

  const createTweetElement = (tweet) => {
    const div = document.createElement("div");
    div.classList.add("tweet");

    div.innerHTML = `
            <p class="tweet-author">${tweet.author}</p>
            <p class="tweet-date">${new Date(tweet.date).toLocaleString()}</p>
            <p class="tweet-content">${tweet.content}</p>
            <p class="tweet-tags">${tweet.tags.join(", ")}</p>
            <button class="edit" data-id="${tweet.id}">Edit</button>
            <button class="delete" data-id="${tweet.id}">Delete</button>
        `;

    div
      .querySelector(".edit")
      .addEventListener("click", () => editTweet(tweet.id));
    div
      .querySelector(".delete")
      .addEventListener("click", () => deleteTweet(tweet.id));

    return div;
  };

  const addTweet = (tweet) => {
    const tweets = getTweets();
    tweets.push(tweet);
    saveTweets(tweets);
    loadTweets();
  };

  const editTweet = (id) => {
    const tweets = getTweets();
    const tweet = tweets.find((t) => t.id === id);
    if (tweet) {
      document.getElementById("author").value = tweet.author;
      document.getElementById("content").value = tweet.content;
      document.getElementById("tags").value = tweet.tags.join(", ");

      deleteTweet(id);
    }
  };

  const deleteTweet = (id) => {
    let tweets = getTweets();
    tweets = tweets.filter((tweet) => tweet.id !== id);
    saveTweets(tweets);
    loadTweets();
  };

  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tweet = {
      id: Date.now(),
      author: document.getElementById("author").value,
      content: document.getElementById("content").value,
      tags: document
        .getElementById("tags")
        .value.split(",")
        .map((tag) => tag.trim()),
      date: new Date(),
    };

    addTweet(tweet);
    postForm.reset();
  });

  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    const tweets = getTweets().filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(searchValue) ||
        tweet.tags.some((tag) => tag.toLowerCase().includes(searchValue))
    );

    feed.innerHTML = "";
    tweets.forEach((tweet) => {
      const tweetElement = createTweetElement(tweet);
      feed.appendChild(tweetElement);
    });
  });

  loadTweets();
});
