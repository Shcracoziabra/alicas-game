export default class Basket {
    constructor(name, top, left) {
        this.name = name;
        this.top = top;
        this.left = left;
        this.width = 100;
        this.height = 100;
        this.filledRight = false;

    }

    init() {
        const basket = document.createElement('div');
        
        basket.setAttribute('data-drop', true);
        basket.style.top = `${this.top}px`;
        basket.style.left = `${this.left}px`;
        basket.style.height = `${this.height}px`;
        basket.style.width = `${this.width}px`;

        const fruitTitle = document.createElement('div');
        fruitTitle.classList.add('drop-title');
        fruitTitle.innerText = this.name;
        basket.append(fruitTitle);

        this.elem = basket;
    }

    onDragOver(e){
        e.preventDefault();
    }

    onDrop(e, dragged){
        e.stopPropagation();
        if (e.target.matches('[data-drop]') && !e.target.querySelector('[data-fruit]')) {
            e.target.insertAdjacentElement('afterBegin', dragged);
            this.setFilledRight(dragged.getAttribute('data-fruit'));
        }
    }

    setFilledRight(name){
        if (name === this.name) {
            this.filledRight = true;
        } else {
            this.filledRight = false;
        }
    }

}