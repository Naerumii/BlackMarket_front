const backend_base_url = "http://127.0.0.1:8000";  //포트번호 변경해주세요
const frontend_base_url = "http://127.0.0.1:5500";  //포트번호 변경해주세요

const urlParams = new URLSearchParams(window.location.search);
const user_id = urlParams.get("id");

// 특정 사용자 정보를 back에서 받아오는 함수
async function getProfile(user_id) {
    const response = await fetch(`${backend_base_url}/users/${user_id}/`, {
      method: "GET",
    });
    response_json = await response.json();
    // 받아온 값을 json화 시키고 콘솔로그 확인
    // getArticleDetail() 안에 article_id 써주고, article_detail.js에도 getArticleDetail(article_id);실행
  
    return response_json;
    //{email, nickname, profile_img, introduce, password}
}

// back에서 받아온 json 데이터 front에 내용 붙이는 함수
async function loadProfile(user_id) {
    now_user = await getProfile(user_id);
    console.log(now_user)
    // articles 
    //프론트엔드에서 태그 id 확인하기
    const image = document.getElementById("image");
    const author = document.getElementById("nickname");
    const content = document.getElementById("introduce");
    const gallery_container = document.getElementById("gallery_container");

    const profile_img = document.createElement("img");
    profile_img.setAttribute("src", `${backend_base_url}${now_user.profile_img}`)
    profile_img.setAttribute("style", "width: 100px; height: 100px;")
    author.innerText = now_user.nickname
    content.innerText = now_user.introduce
    
    //작성 게시글 불러오기
    image.appendChild(profile_img);
    for (let i = 0; i < now_user.article_set.length; i++) {
      const myarticle = document.createElement("div");
      myarticle.classList.add("gallery-item");
      myarticle.setAttribute("tabindex", "0");
    
      const imageFrame = document.createElement("img");
      imageFrame.classList.add("gallery-image");
      imageFrame.setAttribute("src", `${backend_base_url}${now_user.article_set[i].image}`)
      imageFrame.setAttribute("id", now_user.article_set[i].pk);
      imageFrame.setAttribute("onclick", "articleDetail(this.id)")
      
      myarticle.appendChild(imageFrame);
      gallery_container.appendChild(myarticle);
    }
  }
  
  function articleDetail(article_id) {
    console.log(article_id);
    const url = `${frontend_base_url}/templates/detail_page.html?id=${article_id}`;
    location.href = url;
}

  loadProfile(user_id);