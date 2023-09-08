export default class Sound {
    constructor({container, soundToggleSelector, soundPath='', audioParams={}}){
        this.container = container;
        this.soundToggleSelector = soundToggleSelector
        this.init(soundPath, audioParams);
    }

    init(soundPath, audioParams) {
        const {name, src, loop} = audioParams;
        this.name = name;
        this.src = src;
        this.loop = loop;

        const audioElem = document.createElement('audio');
        audioElem.setAttribute('src', `${soundPath}${this.src}`);
        audioElem.setAttribute('data-sound', this.name);
        audioElem.loop = this.loop;
        audioElem.muted = false;
        audioElem.display = 'none';

        this.audioElem = audioElem;
        this.container.insertAdjacentElement('beforeend', this.audioElem);
    }

    playWatchingSoundAllowed(soundOwner){
        let soundDuration = this.audioElem.duration * 1000;
        let start;

        const step = (timeStamp) => {
            if (start === undefined) {
                start = timeStamp;
                if (soundOwner) {
                    soundOwner.isActive && this.play();
                } else {
                    this.play();
                }  
            }



            if(!document.querySelector(this.soundToggleSelector).classList.contains('play')) {
                this.mute();
            } else {
                this.unmute();
            }

            if(soundOwner) {
                if(!soundOwner.isActive) {
                    this.stop();
                    return 
                } else {
                    this.loopSound();
                    window.requestAnimationFrame(step);
                }
            } else {
                if ((timeStamp - start) < soundDuration) {
                    window.requestAnimationFrame(step);
                } else {
                    this.stop();
                    return
                }
            }       
        }
        window.requestAnimationFrame(step); 
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

    loopSound() {
        if(this.audioElem.currentTime === this.audioElem.duration) {
            this.audioElem.currentTime = 0;
            this.play();
        }
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

    getDuration(){
        return this.audioElem.duration;
    }

    setCurrentTime(time) {
        this.audioElem.currentTime = time;
    }

    setTime(time) {
        this.audioElem.currentTime = time;
    }
}
