export default class Block {
    constructor({
        name, 
        wrapper = {
            tag:'div', 
            classes:[], 
            attributes:[]
        }, 
        innerElems = [], 
        correctionsToBeTarget = {
            left:0,
            top:0,
            right: 0,
            bottom: 0
        },
    }){
        this.name = name;
        this.correctionsToBeTarget = correctionsToBeTarget;
        this.disappearsSoon = false;
        this.init(wrapper, innerElems);
    }

    init(wrapper, innerElems) {
        function createElem(tag='div', classes=[], attributes=[]) {
            const elem = document.createElement(tag);
            classes.forEach(className => elem.classList.add(className));
            attributes.forEach(attribute => elem.setAttribute(attribute.name, attribute.value));
            return elem;    
        }

        const {tag, classes, attributes} = wrapper;

        this.block = createElem(tag, classes, attributes);
        
        innerElems.forEach(({name, tag, classes, attributes}) => {
            const elem = createElem(tag, classes, attributes);
            elem.setAttribute('data-part', name);

            this.block.append(elem);
        })
    }

    addTo(container) {
        this.container = container;
        this.container.append(this.block)
        this.setCoordsAttachedToMouse = this.setCoordsAttachedToMouse.bind(this);
        this.setCoordsAttachedToMouse();
        window.addEventListener('resize', this.setCoordsAttachedToMouse);
    }

    setCoordsAttachedToMouse(){
        this.setViewPortCoords();
        this.setCorrectionMouseCoords();
    }

    remove(){
        window.removeEventListener('resize', this.setCoordsAttachedToMouse);
        this.block.remove();

    }

    setAttribute(attribute, value) {
        this.block.setAttribute(attribute, value)
    }

    async hide(elem, delay=0) {
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                elem.style.display = 'none';
                resolve();
            }, delay);
        })
    }

    async show(elem, delay=0) {
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                elem.style.display = '';
                resolve();
            }, delay);
        })
    }

    getPart(name) {
        return this.block.querySelector(`[data-part=${name}]`)
    }

    changeStyleValueGradually(elem, msAnimationTime, callbackToStyleElem, maxValue){
        return new Promise((resolve, reject) => {
            let start, previousTimeStamp;
            let done = false;
            const msCoefficient = maxValue / msAnimationTime;

            function step(timeStamp) {
                if (start === undefined) {
                    start = timeStamp;
                }
                const elapsed = timeStamp - start;

                if (previousTimeStamp !== timeStamp) {
                    const count = Math.min(msCoefficient * elapsed, maxValue);
                    callbackToStyleElem(elem, count)
                    //element.style.transform = `translateX(${count}px)`;
                    if (count === maxValue) {
                        done = true;
                        resolve();
                    }
                }

                if (elapsed < msAnimationTime) {
                    // Stop the animation after 2 seconds
                    previousTimeStamp = timeStamp;
                    if (!done) {
                    window.requestAnimationFrame(step);
                    }
                }
            }
            window.requestAnimationFrame(step);
        })   
    }

    async graduallyDisappear(time, elem) {
        this.block.style.opacity = 1;
        await this.changeStyleValueGradually(elem, time, (elem, value) => elem.style.opacity = 1 - value, 1);
    }

    async graduallyAppear(time, elem) {
        this.block.style.opacity = 0;
        await this.changeStyleValueGradually(elem, time, (elem, value) => elem.style.opacity = value, 1);
    }

    async place({params={top: 0, left: 0}, delay = 0}) {
        this.block.style.position = 'absolute';
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                for (let param of Object.keys(params)) {
                    this.block.style[param] = params[param];
                };
                resolve();
            }, delay)
        });   
    }

    setViewPortCoords() {
        const {left, top, right, bottom} = this.block.getBoundingClientRect();
        this.viewportCoords = {
            left: left,
            top: top, 
            right: right,
            bottom: bottom
        };
    }

    setCorrectionMouseCoords() {
        this.viewPortMouseCorrection = {
            left: this.viewportCoords.left - this.block.offsetLeft,
            top: this.viewportCoords.top - this.block.offsetTop
        }
    }
 
    setTextParagraphes(textArray=[]) {
        this.block.innerHTML = '';
            for (let text of textArray) {
                const paragraph = document.createElement('p');
                paragraph.textContent = text;
                this.block.append(paragraph);
            }
    }

    setTextInPart(name, text) {
        if(this.getPart(name)) {
            this.getPart(name).innerText = text;
        }
    }

    isTarget(e) {
        const left = this.viewportCoords.left + this.correctionsToBeTarget.left;
        const top = this.viewportCoords.top + this.correctionsToBeTarget.top;
        const right = this.viewportCoords.right + this.correctionsToBeTarget.right;
        const bottom = this.viewportCoords.bottom + this.correctionsToBeTarget.bottom;

        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {
            return true;
        }
    }
}