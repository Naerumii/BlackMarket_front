const backend_base_url = "http://127.0.0.1:8000";  //포트번호 변경해주세요
const frontend_base_url = "http://127.0.0.1:5500";  //포트번호 변경해주세요

const urlParams = new URLSearchParams(window.location.search);
const article_id = urlParams.get("id");

// 특정 게시물 back에서 받아오는 함수
async function getArticleDetail(article_id) {
    const response = await fetch(`${backend_base_url}/articles/${article_id}/`, {
      method: "GET",
    });
    response_json = await response.json();
    console.log(response_json);
    // 받아온 값을 json화 시키고 콘솔로그 확인
    // getArticleDetail() 안에 article_id 써주고, article_detail.js에도 getArticleDetail(article_id);실행
  
    return response_json;
}

// back에서 받아온 json 데이터 front에 내용 붙이는 함수
async function loadDetailArticles(article_id) {
    article = await getArticleDetail(article_id);
  
    //프론트엔드에서 태그 id 확인하기
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const image = document.getElementById("image");
    const content = document.getElementById("content");
    const price = document.getElementById("price");
    const time = document.getElementById("time");
  
    title.innerText = article.title;
    author.innerText = article.user;
    image.setAttribute("src", `${backend_base_url}${article.image}`);
    content.innerText = article.content;
    price.innerText = article.price;
    time.innerText = article.created_at;
  
    const comment_section = document.getElementById("comment_section");
    comment_section.innerHTML = "";
  
    for (let i = 0; i < article.comment_set.length; i++) {
      const old_comment = document.createElement("span");
      const new_comment = document.createElement("p");
      old_comment.innerText = article.comment_set[i].user;
      new_comment.innerText = article.comment_set[i].content;
      comment_section.appendChild(new_comment);
      comment_section.appendChild(old_comment);
    }
  
    // const update_button = document.getElementById("update_button");
    // const delete_button = document.getElementById("delete_button");
    // update_button.style.visibility = "";
    // delete_button.style.visibility = "";
  }

// 게시글 수정하기 버튼 클릭 시 동작하는 함수
function updateMode() {
    const title = document.getElementById("title");
    const content = document.getElementById("content");
    const price = document.getElementById("price");
    title.style.visibility = "hidden";
    content.style.visibility = "hidden";
    price.style.visibility = "hidden";
  
    const input_title = document.createElement("textarea"); // 수정할 수 있는 입력창만들기
    input_title.setAttribute("id", "input_title");
    input_title.classList.add("input_title_style"); // title 수정 입력창의 class -> detail.page.css에서 꾸미면 됨
    input_title.innerText = title.innerHTML; // 원래 있던 값 일단 보여주기, 안하면 공란처리됨
  
    const input_content = document.createElement("textarea"); // 수정할 수 있는 입력창만들기 title,content 둘다 해줘야함. 안그러면 안생김
    input_content.setAttribute("id", "input_content");
    input_content.classList.add("input_content_style"); // content 수정 입력창의 class -> detail.page.css에서 꾸미면 됨
    input_content.innerText = content.innerHTML; // 안하면 공란처리됨
    input_content.rows = 3;

    const input_price = document.createElement("textarea"); // 수정할 수 있는 입력창만들기
    input_price.setAttribute("id", "input_price");
    input_price.classList.add("input_price_style"); // price 수정 입력창의 class -> detail.page.css에서 꾸미면 됨
    input_price.innerText = price.innerHTML; // 안하면 공란처리됨
  
    const body1 = document.getElementById("container1");
    const body2 = document.getElementById("container2");
    const body3 = document.getElementById("container3");
    body1.insertBefore(input_title, title); //기존 부분을 입력란으로 교체
    body3.insertBefore(input_content, content);
    body2.insertBefore(input_price, price);
  
    const update_button = document.getElementById("update_button"); //업데이트 버튼 요소 가져오기
    update_button.setAttribute("onclick", "updateArticle()");  //클릭시 updateArticle 함수 실행
}

// 게시글 수정한 내용을 다시 front에 붙여주는 함수
async function updateArticle() {
    let input_title = document.getElementById("input_title");
    let input_content = document.getElementById("input_content");
    let input_price = document.getElementById("input_price");
    console.log(input_title.value, input_content.value, input_price.value);
  
    const re_article = await patchArticle(
      article_id,
      input_title.value,
      input_content.value,
      input_price.value
    );
  
    input_title.remove();
    input_content.remove(); // 수정하기 눌러서 기존 내용없애주기.
    input_price.remove();
  
    const title = document.getElementById("title"); // 35.36코드에 title.style.visibility = "hidden" 없애놨으니까
    const content = document.getElementById("content"); // 불러서
    const price = document.getElementById("price");
    title.style.visibility = "visible"; // 다시 보이게 !
    content.style.visibility = "visible";
    price.style.visibility = "visible";
  
    update_button.setAttribute("onclick", "updateMode()"); // 다시 클릭하면 위의 코드 38 부분이 실행됨
  
    loadDetailArticles(article_id); // 다시 한 번. 맨 위의 함수 실행
  }

//게시글 수정 내용 back에 보내 저장하는 메서드
async function patchArticle(article_id, title, content, price) {
  const articleData = {
    title: title,
    content: content,
    price: price,
  };
  console.log(article_id);
  const response = await fetch(`${backend_base_url}/articles/${article_id}/`, {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "PATCH",
    body: JSON.stringify(articleData),
  });

  if (response.status == 200) {
    response_json = await response.json();
    return response_json;
  } else {
    alert(response.status);
  }
}

// 게시글 삭제 버튼 클릭 시 실행되는 함수
async function removeArticle() {
  await deleteArticle(article_id);
}

async function deleteArticle() {
  const response = await fetch(`${backend_base_url}/articles/${article_id}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "DELETE",
  });

  if (response.status == 204) {
    window.location.replace(`${frontend_base_url}/templates/main.html`); // 삭제가 되고나면 인덱스로 다시 이동하게함
  } else {
    alert(response.status);
  }
}

loadDetailArticles(article_id);