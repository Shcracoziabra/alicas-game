export default class AppSound {
    constructor(container, soundPath, audioParams={}){
        this.container = container;
        this.soundPath = soundPath;
        this.init(audioParams);
    }

    init(audioParams) {
        const {name, src, loop} = audioParams;
        this.name = name;
        this.src = src;
        this.loop = loop;

        const audioElem = document.createElement('audio');
        audioElem.setAttribute('src', `${this.soundPath}${this.src}`);
        audioElem.setAttribute('data-sound', this.name);
        audioElem.loop = this.loop;
        audioElem.muted = false;
        audioElem.display = 'none';

        this.audioElem = audioElem;
        this.container.append(this.audioElem);
    }

    play() {
        this.audioElem.play();
    }

    mute() {
        this.audioElem.muted = true;
    }

    unmute() {
        this.audioElem.muted = false;
    }

    stop() {
        this.audioElem.pause();
        this.audioElem.currentTime = 0;
    }

    playAgainIfEnded(timeToStart) {
        if(this.audioElem.ended){
            this.audioElem.currentTime = timeToStart;
            this.audioElem.play();
        }
    }

    getCurrentTime(){
        return this.audioElem.currentTime;
    }

    setCurrentTime(time) {
        this.audioElem.currentTime = time;
    }

    setTime(time) {
        this.audioElem.currentTime = time;
    }
}
