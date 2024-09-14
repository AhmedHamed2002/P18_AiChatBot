let Name =  prompt("Enter your name") ;  
document.querySelector('.yourName').innerHTML = Name ; 

let send  =  document.querySelector('.send') ; 
let input =  document.querySelector('.formInput');  
let chatList =  document.querySelector('.chatList') ; 
let  Api_key  =  "AIzaSyDSfzLlq7f6TWjiQ8VjQ3xhG3g5qT9eN3g"  ; 
let  Api_url =  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${Api_key}`; 
let showTypingEffect= (apiData , result)=>{
    const words =  apiData.split(" ") ; 
    let currentWordIndex =0  ;  
    const typingInterval = setInterval(()=>{
        result.innerHTML += (currentWordIndex === 0 ? "" :" ") + words[currentWordIndex++]; 
        if(currentWordIndex === words.length)
        {
            clearInterval(typingInterval); 
        }
        window.scrollTo(0 , chatList.scrollHeight); 
    },40);
}

let apiResponse = async (message)=> {
    let result = message.querySelector('.Ai_text') ;   

    try{
        let response =  await fetch(Api_url , {
            method: "POST"  ,  
            headers:{"content-Type":"application/json"},  
            body:JSON.stringify({
                contents:[{
                    role:"user" ,  
                    parts:[{text: inputText}]
                }]
            })
        })
        const data = await  response.json() ;  
        const  apiData  =  data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g ,'$1') ; 
        message.classList.add('Done') ;
        showTypingEffect(apiData , result) ;  
    }
    catch(error){
        console.error(error);
        
    }
}

let copy = (t)=>{
    let textCopy = t.parentElement.querySelector(".Ai_text").innerText ;  
    navigator.clipboard.writeText(textCopy); 
    t.innerText ="Done"; 
    setTimeout(()=> t.innerText = "content_copy" , 1000) 
}

let showloading =  () =>  {
    let html  =  
                `
                    <div class="Ai_message">
                    <div class="image">
                        <img src="image/Ai.png" alt="Ai image">
                    </div>
                    <div class="Ai_text">
                    
                    </div> 
                    <div class="loading">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <span onClick="copy(this)" class="material-symbols-outlined">content_copy</span>
                ` ; 
        let message = document.createElement('div');
        message.classList.add('message') ; 
        message.innerHTML =  html;   
        chatList.appendChild(message); 
        window.scrollTo(0 , chatList.scrollHeight); 
        apiResponse(message) ; 
}

function display(){
    inputText  =  input.value ; 
    send.reset() ; 
    if(inputText != "")
    {     
        let  html = 
                    `
                        <div class="user_message">
                            <div class="image">
                                <img src="image/user.jpeg" alt="user image">
                            </div>
                            <div class="user_text">
                                ${inputText}
                            </div>
                        </div>
                    ` ;
        let message = document.createElement('div');
        message.classList.add('message') ; 
        message.innerHTML =  html;   
        chatList.appendChild(message); 
        window.scrollTo(0 , chatList.scrollHeight); 
        setTimeout( showloading , 500) ;  
    }
}


send.addEventListener('submit' , (e) => {
    e.preventDefault();   
    display() ;  
})