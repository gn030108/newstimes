const apiKey = '15f44710f8f94a479eac1a09c8e02d4c';
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));

let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`);

let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5


const getNews=async()=>{
  try{
    url.searchParams.set("page",page)//&page=page
    url.searchParams.set("pageSize",pageSize)//&pageSize=pageSize
    const response = await fetch(url);
    
    const data = await response.json();
    if (response.status===200){
      if(data.articles.length===0){
        throw new Error("No result fot this search")
      }
      newsList = data.articles;
      totalResults = data.totalResults
      render();
      pageNationRender()
    }
    else{
      throw new Error(data.message)
    }
    newsList = data.articles;
    render();
  }
  catch(error){
    errorRender(error.message)
  }

  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
}

const getLatestNews = async ()=>{
  const url = new URL (
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`
  )
  getNews()
}

const getNewsByCategory = async (event) =>{
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${apiKey}`)
  getNews()
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL( `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${apiKey}`);
  getNews()
}

const render = ()=>{
  const newsHTML = newsList.map(news => `<div class="row news">
  <div class="col-lg-4">
    <img class="news-img-size" src=${news.urlToImage} alt="">
  </div>
  <div class="col-lg-8">
    <h2>${news.title}</h2>
    <p>${news.description}</p>
    <div>${news.source.name} * ${news.publishedAt}</div>
  </div>
</div>`).join('');
  
  document.getElementById("news-board").innerHTML= newsHTML;
}

const errorRender = (errorMessage)=>{
  const errorHTML=`<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`

  document.getElementById("news-board").innerHTML = errorHTML;
}

const pageNationRender = ()=>{
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;

  if(lastPage > totalPages){
    lastPage = totalPages;
  }

  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : firstPage = lastPage - (groupSize - 1);

  let pageNationHTML=``

  if (firstPage >= 6) {
    pageNationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link">&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page - 1})">
                        <a class="page-link">&lt;</a>
                      </li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    pageNationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" onclick="moveToPage(${i})" >${i}</a>
                      </li>`;
  }

  if (lastPage < totalPages) {
    pageNationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${totalPage})">
                        <a class="page-link" >&gt;&gt;</a>
                      </li>`;
  }


  document.querySelector(".pagination").innerHTML=pageNationHTML
};


const moveToPage=(pageNumber)=>{
  console.log(pageNumber)
  page=pageNumber
  getNews()
}


getLatestNews()