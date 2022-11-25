const backend_base_url = "http://127.0.0.1:8000";  //포트번호 변경해주세요
const frontend_base_url = "http://127.0.0.1:5500";  //포트번호 변경해주세요

// 자동 함수 실행
// 게시물 로드하기
$(document).ready(async function loadArticles() {
    articles = await getArticles();
    console.log(articles);
    const article_list = document.getElementById("article_container");
  
    articles.forEach((article) => {
        console.log(article)
        const newArticle = document.createElement("div");
        newArticle.classList.add("slider__item");
        newArticle.setAttribute("id", article.pk);
        console.log(article.pk);
        
        const articleImage = document.createElement("img");
        articleImage.classList.add("slider__image");

        const bodyArticle = document.createElement("div");
        bodyArticle.classList.add("slider__info");

        const bodyTitle = document.createElement("h2");
        const bodyPrice = document.createElement("h3");

        const articleBtn = document.createElement("button");
        articleBtn.classList.add("btn", "btn-outline-secondary");

        articleBtn.innerText = "view";
        articleBtn.setAttribute("type", "button");
        articleBtn.setAttribute("onclick", "articleDetail(this.id)");

        bodyPrice.innerText = article.price;
        bodyTitle.innerText = article.title;

        articleImage.setAttribute("src", `${backend_base_url}${article.image}`);

        bodyArticle.appendChild(bodyTitle);
        bodyArticle.appendChild(bodyPrice);
        bodyArticle.appendChild(articleBtn);
        newArticle.appendChild(articleImage);
        newArticle.appendChild(bodyArticle)
        article_list.appendChild(newArticle);
    });
});

//게시글 생성
async function createArticle() {
    const payload = localStorage.getItem("payload");
    const parsed_payload = await JSON.parse(payload);
    console.log(parsed_payload);

    title = document.getElementById("title").value;
    price = document.getElementById("price").value;
    content = document.getElementById("content").value;
    image = document.getElementById("file-uploader").files[0];
    console.log(title, price, content, image)

    const formData = new FormData();

    formData.append("article_title", title);
    formData.append("article_price", price);
    formData.append("article_content", content);
    formData.append("article_image", image);

    console.log(formData.get("article_content"))

    //테스트할 때 포트번호 변경
    const response = await fetch("http://127.0.0.1:8000/articles/", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
        },
        method: "POST",
        body: formData,
    });

    if (response.status == 200) {
        alert("게시물 등록");
        window.location.replace("http://127.0.0.1:5500/templates/main.html");
    } else {
        alert(response.status)
    }
}

//게시물 가져오기(전부)
async function getArticles() {
    const response = await fetch("http://127.0.0.1:8000/articles/", {
        method: "GET",
    });
    response_json = await response.json();
    return response_json;
}

//특정 게시물 가져오기(상세 페이지)
function articleDetail(article_id) {
    console.log(article_id);
    const url = `${frontend_base_url}/templates/detail_page.html?id=${article_id}`;
    location.href = url;
}

//게시글 수정하기
async function patchArticle(article_id, title, content, price) {
    const articleData = {
        title: title,
        content: content,
        price: price,
    };
    
    const response = await fetch(`${backend_base_url}/articles/${article_id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
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

//게시글 삭제하기
async function deleteArticle() {
    const response = await fetch(`${backend_base_url}/articles/${article_id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
        method: "DELETE",
    });
        
    if (response.status == 200) {
        window.location.replace(`${frontend_base_url}/`); // 삭제가 되고나면 인덱스로 다시 이동하게함
    } else {
        alert(response.status);
    }
}