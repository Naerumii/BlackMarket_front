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
    input_title.innerText = title.innerHTML; // 안하면 공란처리됨
  
    const input_content = document.createElement("textarea"); // 수정할 수 있는 입력창만들기 title,content 둘다 해줘야함. 안그러면 안생김
    input_content.setAttribute("id", "input_content");
    input_content.innerText = content.innerHTML; // 안하면 공란처리됨
    input_content.rows = 3;

    const input_price = document.createElement("textarea"); // 수정할 수 있는 입력창만들기
    input_price.setAttribute("id", "input_price");
    input_price.innerText = price.innerHTML; // 안하면 공란처리됨
  
    const body = document.getElementById("body_cont");;
    body.insertBefore(input_title, title);
    body.insertBefore(input_content, content);
    body.insertBefore(input_price, price);
  
    const update_button = document.getElementById("update_button"); //업데이트 버튼 요소 가져오기
    update_button.setAttribute("onclick", "updateArticle()");  //클릭시 updateArticle 함수 실행
}

// 게시글 수정한 내용을 back에 보내는 함수
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
  
    const title = document.getElementById("title"); // 35.36코드에 title.style.visibility = "hidden" 없애놨으니까
    const content = document.getElementById("content"); // 불러서
    title.style.visibility = "visible"; // 다시 보이게 !
    content.style.visibility = "visible";
  
    update_button.setAttribute("onclick", "updateMode()"); // 다시 클릭하면 위의 코드 38 부분이 실행됨
  
    loadDetailArticles(article_id); // 다시 한 번. 맨 위의 함수 실행
  }

  async function removeArticle() {
    await deleteArticle(article_id);
  }

  loadDetailArticles(article_id);