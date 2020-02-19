    let totalQ = 10;
    let position = JSON.parse(localStorage.getItem('position')) ? JSON.parse(localStorage.getItem('position')) : JSON.parse(localStorage.getItem('position')) === 0 ? 0 : -1;
    let rPosition = JSON.parse(localStorage.getItem('rposition')) ? JSON.parse(localStorage.getItem('rposition')) : JSON.parse(localStorage.getItem('rposition')) === 0 ? 0 : "";
    let userResponses = JSON.parse(localStorage.getItem('responses')) || [];
    let clearID;
    let review;
    let gloss = document.querySelector('#explanation');
    let numQ = document.querySelector('#numQ');
    const qArea = document.querySelector('#qArea');
    const main = document.querySelector('#main');
    const timer = document.querySelector('#timer')
    let timerRunning = false;
    let seconds = 99;
    const timeAlloted = seconds;
    let explanations = [
                        'Pretoria is the administrative capital of South Africa', 
                        'Cameroun won the AFCON in 1984, 1988, 2000, 2002 and recently in 2017', 
                        'With about 1.4 billion people, China is the most populated country', 
                        "Modric is the 2018 FIFA Ballon d'Or holder", 
                        "With recent discoveries, Pluto is no longer classified as a planet",
                        "Yoke is some form of bondage, burden or limiting condition and should not be confused with Yolk the yellow inner part of an egg", 
                        "Illusive: think illusion (imaginery doesn't exist); Elusive: Think elude (Something you can't get)",
                        "Recall BODMAS. So you should perform multiplication before Addition and subtraction. <br> 5 + 48 - 3 = 50",
                        "Area = πr<sup>2</sup> => 154cm<sup>2</sup> = 22/7 * r<sup>2</sup> <br> => r = 7cm, D= 2*r =14cm <br> Perimeter = πD = 22/7 * 14cm = 44cm",
                        "Observe the difference between nth term and n+1 term keeps increasing by 4 i.e. 3-2 = 1, 8-3 = 5, 17-8 = 9, 30-17=13, so the next difference should be 13 + 4 = 17. Hence, x => 30 + 17 = 47" 
                      ]
    
 let questions_temp = [   
                    ["Where is the administrative capital of South Africa?", "Johannesburg","Pretoria","Durban","Cape Town", "B"],
                    ["Which country has won 5 AFCON titles?","Egypt","Ghana","Cameroun","Nigeria","C"],
                    ["Which is the most populated country in the world?","India","Brazil","Russia","China","D"],
                    ["Who was the 2018 Balon d'Or winner?","Messi","Ronaldo","Mbappe","Modric","D"],
                    ["Which is not a planet?","Pluto","Mercury","Saturn","None of the above","A"],
    
                    ["Some _________ are caused by ignorance but with knowledge they can be crushed like egg ________", "yolks, yolks", "yolks, yokes", "yokes, yokes", "yokes, yolks", "D"],
                    ["Efforts made by Science to find God have been __________. Hence, Science concludes that God is __________.", "elusive, illusive", "elusive, elusive","illusive, illusive", "illusive, ellusive", "A"],
                    ["Given this series 2, 3, 8, 17, 30, x. Find x?","43","59","45","47","D"],
                    ["Evaluate 5 + 6 * 8 - 3", "50","85","35","55", "A"],
                    ["Find the perimeter of a circle, if its area is 154cm<sup>2</sup>.","14cm","7cm","44cm","22cm","C"],
                ]         


localStorage.setItem('questions', JSON.stringify(questions_temp));
let questions = JSON.parse(localStorage.getItem('questions'));


window.onload = function displayPage(){
    if(position === -1 && rPosition === ""){
        numQ.innerHTML = `<h3>QUIZ</h3>`                
    
        qArea.innerHTML = `<h2>Instructions:</h2>
                    <li class="instruction">You have <b>${totalQ}</b> questions to answer in <b>${seconds}</b> seconds.</li>
                    <li class="instruction">Answers to this quiz will be provided at the end</li>
                    <li class="instruction">Click Start to begin Test, Good luck!</li>
                        <button id="next">Start</button>`;
    }else{
            seconds = JSON.parse(localStorage.getItem('seconds'));
            timer.style.display = localStorage.getItem('timer-visibility');
            if(position > -1 && rPosition === ""){
            numQ.innerHTML = `<span>Question ${position+1} of ${totalQ}</span>`;
            qArea.innerHTML = displayQuestions(position);
            rememberChoices();
            countDown();

        }else if(position === -1 && rPosition === -1){
            timer.innerHTML = seconds >= 10 ? `<span>${seconds}</span>` : `<span>0${seconds}</span>` ;
            if(seconds <= 30){    
                timer.classList.add('red')
            }      
           
            endExam();
        }else{
            reviewQuestions();
        }
    } 
    
}

function countDown(){
       
        timer.style.display = 'block';
        localStorage.setItem('timer-visibility', 'block');
        timer.innerHTML = `<span>${seconds}</span>`;
        clearID = setInterval(()=>{ 
            if(seconds > 0){
                seconds--;
                localStorage.setItem('seconds', seconds);
                timer.innerHTML = seconds >= 10 ? `<span>${seconds}</span>` : `<span>0${seconds}</span>` ;
            }
            else if(seconds == 0){
                saveResponses(position);
                endExam();
                clearInterval(clearID);
            }
            if(seconds <= 30 && seconds > 0){    
                timer.classList.add('red')
            }      
        },1000)            
    }
    
function saveResponses(position){
    const options = document.querySelectorAll('input[name="options"]')
    let checked = 0
    
    options.forEach((option)=>{
        
        if(option.checked){ 
            checked ++
            userResponses.splice(position, 1, option.value)
        }
    })    

    if(!checked){
        userResponses.splice(position, 1, "")
    }
    localStorage.setItem('responses', JSON.stringify(userResponses))
}


function calcScore(){
    let correct = 0;
    let incorrect = 0;
    let blank = 0;
    for(i=0; i<totalQ; i++){
        if(userResponses[i] === questions[i][5]){
            correct++;
            
        }else{
            if(userResponses[i]){
                incorrect++;
                
            }else{
                blank++;
            }
        }
    }
   
    let score = correct/totalQ * 100;
    let status = score >= 50? "Passed" : "Failed";
    const duration = timeAlloted - seconds;
    
    return [score, status, correct, incorrect, blank, duration];
}
function pageState(){
    let btn;
    if(position === 0){
        btn =  `<button id="next">Next</button>`;
    }else if(position > 0 && position <= 8){
        btn = `<button class="back" id="prev">Prev</button><button id="next">Next</button>`;
    }else{
        btn =  `<button class="back" id="prev">Prev</button><button style="background:orangered; border-color:tomato" class="submit" id="submit">Submit</button>`;
    }

    return btn;
}

function displayQuestions(position){
    let content = `<p style="padding-left:10px; font-weight:bold">${questions[position][0]}</p>
            <ul>
                <li><label><input type="radio" class="option-input radio" name="options" value="A"/>${questions[position][1]}</label></li>
                <li><label><input type="radio" class="option-input radio" name="options" value="B"/>${questions[position][2]}</label></li>
                <li><label><input type="radio" class="option-input radio" name="options" value="C"/>${questions[position][3]}</label></li>
                <li><label><input type="radio" class="option-input radio" name="options" value="D"/>${questions[position][4]}</label></li>
            </ul>
            ${pageState()}`;
    localStorage.setItem('position', JSON.stringify(position))
   
    return content;
}

function reviewQuestions(){

    localStorage.setItem('rposition', JSON.stringify(rPosition))
    if(rPosition <= 9){
        numQ.innerHTML = `<span>Question ${rPosition+1} of ${totalQ}</span>`
        qArea.innerHTML = `<p  style="padding-left:10px; font-weight:bold">${questions[rPosition][0]}</p>
                            <ul>
                                <li><label><input type="radio" class="option-input radio" name="options" value="A"/>${questions[rPosition][1]}</label><span class="icon"></span></li>
                                <li><label><input type="radio" class="option-input radio" name="options" value="B"/>${questions[rPosition][2]}</label><span class="icon"></span></li>
                                <li><label><input type="radio" class="option-input radio" name="options" value="C"/>${questions[rPosition][3]}</label><span class="icon"></span></li>
                                <li><label><input type="radio" class="option-input radio" name="options" value="D"/>${questions[rPosition][4]}</label><span class="icon"></span></li>
                            </ul>`

        if(rPosition == 0){
                        
             qArea.innerHTML +=`<button class="review">Next</button>`
        }
            
        else if(rPosition < 9){
                
             qArea.innerHTML += `<button class="back">Previous</button> <button class="review">Next</button>`}
            
        else if(rPosition == 9){
                
             qArea.innerHTML += `<button class="back">Previous</button><button style="background:lime; border-color:green;" class="retake">Retake</button>`
        }
           
         feedback(rPosition)      
    }
}

function rememberChoices(){
     const options = document.querySelectorAll('input[name="options"]')
      
    options.forEach((option)=>{
        
        if(option.value == userResponses[position]){
            option.checked = true;
        }
    })
}

function displayTranslate(caption){
            let apiKey = "Gget2gDCb2PkSKoQT3wcmvxr0a8lqTIC";

            let endpoint = `https://api.giphy.com/v1/gifs/translate?api_key=Gget2gDCb2PkSKoQT3wcmvxr0a8lqTIC&s=${caption[0]}&weirdness=3`;
            fetch(endpoint)
            .then(response => response.json())
            .then(json => {
               
                let html = `<figure><img class="images" src="${json.data.images.fixed_width_downsampled.url}"  alt="${json.data.title}">
                <figCaption>${caption[1]}</figcaption></figure>`;
                const imageBox = document.querySelector('#imageBox');
                imageBox.innerHTML = html;
            })
            .catch(err=>console.log(err.message))
}

function feedback(rPosition){
        timer.style.display = 'none';
        const options = document.querySelectorAll('input[name="options"]')
        let checked = 0
        options.forEach((option, index)=>{
            
            option.disabled = true;
            if(option.value == questions[rPosition][5]){
                
                option.parentElement.classList.add('answer')
            }
            if(option.value == userResponses[rPosition]){
                option.checked = true;
                
                if(option.value == questions[rPosition][5]){
                    option.parentElement.nextElementSibling.classList.add('hit')
                }else{
                    option.parentElement.classList.add('wrong')
                    option.parentElement.nextElementSibling.classList.add('miss')
                } 
            }
        })    
        gloss.style.display = "block";
        gloss.innerHTML = explanations[rPosition];
}

function endExam(){
        
        clearInterval(clearID);
        let report = calcScore();
        
        numQ.innerHTML = `<h4>Test Report</h4><br> `

         qArea.innerHTML = `<p id="score" class="report-card"><span style="font-weight: bold;font-size: 2em; text-align:center">Score: ${report[0]}%<span>&nbsp[${report[1]}]</span>
                            </span></p>
                            <p id="brk-down" class="report-card"><span>You got <strong style="color:green;">${report[2]}</strong> correct, <strong style="color:red;">${report[3]}</strong> incorrect and 
                            left <strong style="color:blue;">${report[4]}</strong> blank.</span></p> 
                            <p id="test-time" class="report-card"><span>Test completed in <strong>${report[5]}</strong> seconds.</span></p>
                            <div class="report-card" id="imageBox"></div>
                            <button id="review" class="review">Review</button>`
        
        let caption = report[1] === "Passed"? ["applause", "You're smart, welldone!"] : ["failure", "Sorry, better luck next time"]
        displayTranslate(caption)
        position = -1;
        localStorage.setItem('position', JSON.stringify(position));
        rPosition = -1;
        localStorage.setItem('rposition', JSON.stringify(rPosition));
}

main.addEventListener('click', (e)=>{
    if(e.target.id === "next"){
        if(position < 0){countDown();}
        if(position >= 0){saveResponses(position);}
        position++;
        numQ.innerHTML = `<span>Question ${position+1} of ${totalQ}</span>`;
        qArea.innerHTML = displayQuestions(position);
        rememberChoices();
    }

     else if(e.target.id === "prev"){
        position--;
        numQ.innerHTML = `<span>Question ${position+1} of ${totalQ}</span>`;
        qArea.innerHTML = displayQuestions(position);
        rememberChoices();
    }else if(e.target.id === "submit"){
        saveResponses(position);
        endExam();
        
    }

    else if(event.target.className == "review"){
             rPosition++;
            reviewQuestions();
            
    }
    else if(event.target.className == "back"){

        if(rPosition > 0){
            
            rPosition --
            localStorage.setItem('rposition', JSON.stringify(rPosition));
            numQ.innerHTML = `<span>Question ${rPosition+1} of ${totalQ}</span>`
            qArea.innerHTML = `<p  style="padding-left:10px; font-weight:bold">${questions[rPosition][0]}</p>
                <ul>
                    <li><label><input type="radio" class="option-input radio" name="options" value="A"/>${questions[rPosition][1]}</label><span class="icon"></span></li>
                    <li><label><input type="radio" class="option-input radio" name="options" value="B"/>${questions[rPosition][2]}</label><span class="icon"></span></li>
                    <li><label><input type="radio" class="option-input radio" name="options" value="C"/>${questions[rPosition][3]}</label><span class="icon"></span></li>
                    <li><label><input type="radio" class="option-input radio" name="options" value="D"/>${questions[rPosition][4]}</label><span class="icon"></span></li>
                </ul>`
            if(rPosition == 0){
                            
                qArea.innerHTML += `<button class="review">Next</button>`
            }
                            
            else if(rPosition < 9){
                    
                qArea.innerHTML += `<button class="back">Previous</button> <button class="review">Next</button>`
            }
           
            feedback(rPosition)
        }
        
    }
   else if(event.target.className == "retake"){
        localStorage.clear();
        position = -1;
        rPosition = "";
        location.reload()
   }
})
