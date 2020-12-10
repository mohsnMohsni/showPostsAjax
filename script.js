function getDataFromApi(url) {
  let promise = new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        var data = response;
        resolve(data);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
  return promise;
}

function fetchData() {
  allData = {};
  let promise = new Promise((resolve, reject) => {
    let posts = getDataFromApi("https://jsonplaceholder.ir/posts");
    posts
      .then((data) => {
        allData["posts"] = data;
        let users = getDataFromApi("https://jsonplaceholder.ir/users");
        users
          .then((data) => {
            allData["users"] = data;
            let comments = getDataFromApi(
              "https://jsonplaceholder.ir/comments"
            );
            comments
              .then((data) => {
                allData["comments"] = data;
                resolve(allData);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return promise;
}

function handleData() {
  fetchData()
    .then((response) => {
      makeData(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

function makeData(obj) {
  post_cards = [];
  for (p of obj.posts) {
    for (u of obj.users) {
      if (u.id == p.userId) {
        user = { name: u.name, email: u.email, avatar: u.avatar };
      }
    }
    var c = [];
    for (com of obj.comments) {
      if (com.postId == p.id) {
        c.push({ username: com.name, content: com.body });
      }
    }
    post_cards.push({
      id: p.id,
      title: p.title,
      body: p.body,
      user: user,
      comment: c,
    });
  }
  makePost(post_cards)
}

function makePost(listView) {
  for (card of listView) {
    $("#card-group").append(`
      <div class="card border-secondary m-3" style="min-width: 18rem;">
        <div class="card-header">${card.user.name} <img src="${card.user.avatar}"/>${card.user.email}</div>
        <div class="card-body text-secondary">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${card.body}</p>
        </div>
        <p class="px-2">
          <button class="btn btn-primary" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#collapseExample${card.id}" aria-expanded="false" 
                  aria-controls="collapseExample${card.id}">
                  Comments
          </button>
        </p>
        <div class="" id="collapseExample${card.id}">
          <div class="card card-body">
          <h6>${card.comment[0].username}</h6>
          <p>${card.comment[0].content}</p>
          </div>
        </div>
      </div>
    `);
  }
}

handleData();
