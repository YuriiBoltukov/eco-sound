/**
 * Variable for saving data of content by btns
 * @type {{[key: string]: string[]}}
 */
const data = {
    drozd: [
        './assets/img/drozd.jpg',
        './assets/audio/drozd.mp3',
    ],
    forest: [
        './assets/img/forest.jpg',
        './assets/audio/forest.mp3',
    ],
    javoronok: [
        './assets/img/javoronok.jpg',
        './assets/audio/javoronok.mp3',
    ],
    slavka: [
        './assets/img/slavka.jpg',
        './assets/audio/slavka.mp3',
    ],
    solovey: [
        './assets/img/solovey.jpg',
        './assets/audio/solovey.mp3',
    ],
    zarynka: ['./assets/img/zarynka.jpg',
        './assets/audio/zarynka.mp3',
    ],
};
/**
 * Variable for saving node for audio
 * @type {HTMLAudioElement}
 */
const audio = new Audio(data.drozd[1]);
const soundBtns = Array.from(document.querySelectorAll('.btn'));
const mainImg = document.querySelector('.main__img');
const mainBtn = document.querySelector('.main__btn');
const mainBtnImg = mainBtn.querySelector('img');
const btnDownload = document.createElement('button');
/**
 * Variable for saving node of download btn
 * @type {HTMLElement}
 */
let btnDownloadLink;
/**
 * Variable for saving id of timer - settimeout
 */
let timerId;
/**
 * Variable for saving status of audio
 * @type {boolean}
 */
let isPlay = false;

/**
 * Method for creating dowload btn
 * @param path {string}
 */
function createDownloadBtn(path) {
    btnDownload.classList.add('btn', 'btn-outline-light');
    btnDownload.setAttribute('type','button');
    btnDownload.innerHTML = `
             <a target="_blank" href=${path} download>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
            </a>
        `;
    btnDownloadLink = btnDownload.querySelector('a');
}

/**
 * Method for toggling visible download btn
 * @param currentBtn {HTMLElement}
 * @param otherBtns {HTMLElement[]}
 */
function toggleDowloadBtn(currentBtn, otherBtns) {
    currentBtn.parentNode.appendChild(btnDownload);
    otherBtns.forEach(soundBtn => {
        if (soundBtn.parentNode.contains(btnDownload)) soundBtn.parentNode.removeChild(btnDownload);
    });
    btnDownloadLink.href = data[currentBtn.value][1];
}

/**
 * Method for toggling class of btns
 * @param currentBtn {HTMLElement}
 * @param otherBtns {HTMLElement[]}
 */
function toggleBtnClass(currentBtn, otherBtns) {
    currentBtn.classList.add('active');
    otherBtns.forEach(soundBtn => soundBtn.classList.remove('active'));
}

/**
 * Method for defining current btn and other btns
 * @param value {string}
 * @returns {{currentBtn: null | HTMLElement, otherBtns: HTMLElement[]}}
 */
function defineCurrentBtnAndOtherBtns(value) {
    const otherBtns = [];
    let currentBtn = null;

    for (let btn of soundBtns) {
        if (value === btn.value) currentBtn ??= btn;
        else otherBtns.push(btn);
    }

    return {currentBtn, otherBtns};
}

/**
 * Method for initializing app
 * @param value {string}
 */
function init(value) {
    const soundBtn = soundBtns.find(btn => btn.value === value);
    createDownloadBtn(data[value][1]);
    soundBtn.parentNode.appendChild(btnDownload);
    soundBtn.classList.add('active');
    mainImg.src = data[value][0];
    audio.src = data[value][1];
}

function main() {
    /**
     * Initializing app with data from localstorage
     * @type {string}
     */
    const store = window.localStorage.getItem('currentBtn');
    if (store) init(store);
    else init(soundBtns[0].value);

    /**
     * Subscribe to event click by soundBtns
     */
    soundBtns.forEach(btn => btn.addEventListener('click', (event) => {
        const {currentBtn, otherBtns} = defineCurrentBtnAndOtherBtns(event.target.value);

        window.localStorage.setItem('currentBtn', currentBtn.value);

        toggleBtnClass(currentBtn, otherBtns);
        toggleDowloadBtn(currentBtn, otherBtns);

        mainImg.src = data[currentBtn.value][0];
        audio.src = data[currentBtn.value][1];

        if (isPlay) audio.play();
    }));

    /**
     * Subscribe to event click by mainBtn -btn for toggle audio
     */
    mainBtn.addEventListener('click', async () => {
        if (isPlay) {
            audio.pause();
            mainBtnImg.src = './assets/svg/play.svg';
        } else {
            await audio.play();
            mainBtnImg.src = './assets/svg/pause.svg';
        }
        isPlay = !isPlay;
    });

    /**
     * Subscribe to event mousemove by body for toggling visible control btn
     */
    document.body.addEventListener('mousemove', event => {
        if (timerId) clearTimeout(timerId);
        mainBtn.style.visibility = 'visible';
        timerId = setTimeout(() => {
            mainBtn.style.visibility = 'hidden';
        }, 3000);
    });

    /**
     * Subscribe to event keyup by body for toggling audio
     */
    document.body.addEventListener('keyup', event => {
        event.preventDefault();
        if (event.code === 'Space') {
            mainBtn.style.visibility = 'visible';
            timerId = setTimeout(() => {
                mainBtn.style.visibility = 'hidden';
            }, 3000);
            mainBtn.click();
        }
    });
}

window.addEventListener('load', main);