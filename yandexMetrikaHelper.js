/*  
    Нужно обработать следующие события на странице:

    1. Добавить возможность включать дебаг - вывод в консоль название идентификатора цели в момент отправки цели в метрику

    2. Вызов по клику на элемент по его селектору. Элемент может быть динамический

    3. Отправка цели по скроллу
    3.1 При доскралливании страницы на определенное количество пикселей
    3.2 При доскралливании страницы до нужного элемента

    4. При входе на определенную страницу
    4.1 Конкретный урл
    4.2 По вхождению урла - по куску

    5. При уходе с определенную страницу
    5.1 Конкретный урл
    5.2 По вхождению урла

    6. Фокус в инпут/текстарею
*/

class YandexMetrikaHelper {
    constructor (idCounter, testMode = false) {
        this.idCounter = idCounter,
        this.testMode = testMode
    }

    setActionClick(targetSelector, targetId) {
        document.addEventListener('click', (evt) => {
            if (evt.target.closest(targetSelector)) {
                if (this.testMode) {
                    console.log('target click: ', targetSelector);
                    console.log('targetId : ', targetId);
                }
                ym(this.idCounter, 'reachGoal', targetId);
            }
        });
    }

    setActionScrollPx(numberPx, targetId) {
        let targetCompleted = false;
        
        window.addEventListener('scroll', (evt) => {
            if (!targetCompleted && window.scrollY >= numberPx) {
                targetCompleted = true;
                console.log('target scrollpx: ', numberPx);
                console.log('targetId : ', targetId);
                ym(this.idCounter, 'reachGoal', targetId);
            }
        });
    }

    setActionScrollToTarget(targetSelector, targetId) {
        let targetCompleted = false;
        
        const targetElem = document.querySelector(targetSelector);

        window.addEventListener('scroll', (evt) => {
            if (!targetCompleted && ((document.documentElement.clientHeight * 0.7) > targetElem.getBoundingClientRect().top)) {
                targetCompleted = true;
                console.log('target scrollToElem: ', targetId);
                console.log('targetId : ', targetId);
                ym(this.idCounter, 'reachGoal', targetId);
            }
        });
    }

    setActionScrollObserver(targetSelector, targetId) {
        const targetElem = document.querySelector(targetSelector);
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log('observer', entry.target);
                    ym(this.idCounter, 'reachGoal', targetId);
                    observer.unobserve(entry.target);
                }
            })
        }, { threshold: 0.1});

        observer.observe(targetElem);
    }
}


const yaHelper = new YandexMetrikaHelper(88345790, true);
yaHelper.setActionClick('.header__btn', 'click-btn');
yaHelper.setActionScrollPx(1000, 'scroll1000');
yaHelper.setActionScrollToTarget('.text-2', 'scroll1000');
yaHelper.setActionScrollObserver('.text-2', 'scroll1000');