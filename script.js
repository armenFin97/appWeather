let result = [];

fetch('https://api.openweathermap.org/data/2.5/forecast?q=Yerevan&units=metric&appid=cc58ecca9dfe8a636d4fb882abe01e93')
    .then(response => {
        if (response.ok) {
            return response.json()
        }
    })
    .then(data => {

        // Create the +5 day functionallity for sorting data
        let city = data.city.name
        let list = data.list
        let days = [];
        const date = new Date();
        let currentDay = date.getUTCDate();
        for (let i = 0; i <= 5; i++) {
            days.push(currentDay + i);
        }
        let dateObj

        // created the sorted object and add to result array
        for (const day of days) {
            dateObj = {
                city: city,
                time: [],
                temp: [],
                icon: [],
                row: [],
                description: []
            }

            // get data
            for (const obj of list) {
                const dayFromApi = Number(obj.dt_txt.split("-")[2].split(" ")[0])
                if (dayFromApi === day) {
                    dateObj.day = day
                    dateObj.time.push(obj.dt_txt)
                    dateObj.temp.push(obj.main.temp)
                    dateObj.icon.push(obj.weather[0].icon)
                    dateObj.description.push(obj.weather[0].description)
                    dateObj.row.push({
                        time: obj.dt_txt,
                        temp: obj.main.temp,
                        icon: obj.weather[0].icon
                    })
                }
            }
            result.push(dateObj)
        }

        // create the daily content html structure using the create element
        let dailyContent = document.querySelector('#contentDaily');
        for (const obj of result) {
            let divDailyBlock = document.createElement('div');
            let pDay = document.createElement('p');
            let divDailyWrapper = document.createElement('div');
            let pTemp = document.createElement('p');
            let imgI = document.createElement('img');

            divDailyBlock.setAttribute('onclick', `updateDate(this, ${obj.day})`)
            divDailyBlock.setAttribute('class', `content__daily-block`)

            if (obj.day === currentDay) {
                divDailyBlock.classList.add('active-block');
                let contentWeather = document.querySelector('#contentWeather');

                let divContentMain = document.createElement('div');
                let pCityMain = document.createElement('p');
                let pTempMain = document.createElement('p');
                let pDescriptionMain = document.createElement('p');
                let divWrapperMain = document.createElement('div');
                let imgIconMain = document.createElement('img');


                divContentMain.setAttribute('class', 'content__current');
                divContentMain.setAttribute('id', 'contentCurrent');
                pCityMain.setAttribute('class', 'city');
                pTempMain.setAttribute('class', 'temp');
                pDescriptionMain.setAttribute('class', 'description');
                divWrapperMain.setAttribute('class', 'icon-wrapper');
                imgIconMain.setAttribute('class', 'currenticon');

                pCityMain.textContent = city;
                pTempMain.textContent = Math.round(obj.temp[0]) + ' °C';
                pDescriptionMain.textContent = obj.description[0];
                imgIconMain.src = `https://openweathermap.org/img/wn/${obj.icon[0]}.png`;


                contentWeather.prepend(divContentMain);
                divContentMain.appendChild(pCityMain);
                divContentMain.appendChild(pTempMain);
                divContentMain.appendChild(divWrapperMain);
                divWrapperMain.appendChild(imgIconMain);
                divContentMain.appendChild(pDescriptionMain);
            }


            divDailyWrapper.setAttribute('class', `content__daily-wrapper`)
            pTemp.textContent = Math.round(obj.temp[0]) + ' °C';
            pDay.textContent = obj.day;
            imgI.src = `https://openweathermap.org/img/wn/${obj.icon[0]}.png`;

            dailyContent.appendChild(divDailyBlock);
            divDailyBlock.appendChild(pDay);
            divDailyBlock.appendChild(divDailyWrapper);
            divDailyWrapper.appendChild(pTemp);
            divDailyWrapper.appendChild(imgI);
        }

        // create the hourly content html structure using the innerHtml
        let myCurrentObj = result.find(item => item.day === currentDay);
        let contentHourly = document.querySelector('#contentHourly');
        contentHourly.innerHTML = '';
        for (const data of myCurrentObj.row) {
            contentHourly.innerHTML += `
            <div class="hourly-wrapper"><p>${data.time.split(" ")[1]}</p><p>${Math.round(data.temp)}°C</p><img src="https://openweathermap.org/img/wn/${data.icon}.png"></p></div>
        `
        }
    })
    .catch(error => {
    });


// Function for updating the data
function updateDate(el, id) {
    let dailyBlocks = document.querySelectorAll('.content__daily-block');
    for (block of dailyBlocks) {
        if (block.className.includes('active-block')) {
            block.classList.remove('active-block');
        }
    }
    el.classList.add('active-block')
    let myCurrentObj = result.find(item => item.day === id)
    let contentHourly = document.querySelector('#contentHourly');
    contentHourly.innerHTML = '';
    for (const data of myCurrentObj.row) {
        contentHourly.innerHTML += `
            <div class="hourly-wrapper"><p>${data.time.split(" ")[1]}</p><p>${Math.round(data.temp)}°C</p><img src="https://openweathermap.org/img/wn/${data.icon}.png"></p></div>
        `
    }

    let contentCurrent = document.querySelector('#contentCurrent');
    contentCurrent.innerHTML = '';
    contentCurrent.innerHTML = `
        <div class="content__current">
            <p class="city">${myCurrentObj.city}</p>
            <p class="temp">${Math.round(myCurrentObj.temp[0])} °C</p>
            <div class="icon-wrapper">
                <img class="currenticon" src="https://openweathermap.org/img/wn/${myCurrentObj.icon[0]}.png">
            </div>
            <p class="description">${myCurrentObj.description[0]}</p>
        </div>
    `;
}



