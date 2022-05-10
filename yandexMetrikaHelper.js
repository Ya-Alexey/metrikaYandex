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

    5. При уходе с определенной страницы
    5.1 Конкретный урл
    5.2 По вхождению урла

    6. Фокус в инпут/текстарею
*/

class YandexMetrikaHelper {
    constructor (idCounter, testMode = false) {
        this.idCounter = idCounter,
        this.testMode = testMode
    }

    //Вызов по клику на элемент по его селектору. Элемент может быть динамический
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

    //При доскралливании страницы на определенное количество пикселей
    setActionScrollPx(numberPx, targetId) {
        let targetCompleted = false;
        
        window.addEventListener('scroll', (evt) => {
            if (!targetCompleted && window.scrollY >= numberPx) {
                targetCompleted = true;
                if (this.testMode) {
                    console.log('target scrollpx: ', numberPx);
                    console.log('targetId : ', targetId);
                }
                ym(this.idCounter, 'reachGoal', targetId);
            }
        });
    }

    //При доскралливании страницы до нужного элемента
    setActionScrollToTarget(targetSelector, targetId) {
        let targetCompleted = false;
    
        const targetElem = document.querySelector(targetSelector);

        if (targetElem) {
            window.addEventListener('scroll', (evt) => {
                if (!targetCompleted && ((document.documentElement.clientHeight * 0.7) > targetElem.getBoundingClientRect().top)) {
                    targetCompleted = true;
                    if (this.testMode) {
                        console.log('target scrollToElem: ', targetSelector);
                        console.log('targetId : ', targetId);
                    }
                    ym(this.idCounter, 'reachGoal', targetId);
                }
            });
        }
    }

    //При доскралливании страницы до нужного элемента
    //вариант с использованием IntersectionObserver
    setActionScrollObserver(targetSelector, targetId) {
        const targetElem = document.querySelector(targetSelector);
        if (targetElem) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (this.testMode) {
                            console.log('target scrollToElem: ', targetSelector);
                            console.log('targetId : ', targetId);
                        }
                        ym(this.idCounter, 'reachGoal', targetId);
                        observer.unobserve(entry.target);
                    }
                })
            }, { threshold: 0.1});
    
            observer.observe(targetElem);
        }
    }

    // При входе на определенную страницу
    // Конкретный урл
    setActionMatchUrl(fullUrlName, targetId) {
        const url = document.location.href;

        if (fullUrlName == url) {
            if (this.testMode) {
                console.log('target matchUrl: ', fullUrlName);
                console.log('targetId : ', targetId);
            }
            ym(this.idCounter, 'reachGoal', targetId);
        }
    }

    // При входе на определенную страницу
    // По вхождению урла - по куску
    setActionMatchUrlPart(urlPart, targetId) {
        const url = document.location.href; 
    
        if (url.indexOf(urlPart) != -1) {
            if (this.testMode) {
                console.log('target matchUrlPart: ', urlPart);
                console.log('targetId : ', targetId);
            }
            ym(this.idCounter, 'reachGoal', targetId);
        }
    }

    // При уходе с определенной страницы
    // Конкретный урл
    setActionLeaveUrl(fullUrlName, targetId) {
        const url = document.location.href;

        if (fullUrlName == url) {
            window.addEventListener('unload', (evt) => {
                ym(this.idCounter, 'reachGoal', targetId);
            });
        }
    }

    // При уходе с определенной страницы
    // По вхождению урла
    setActionLeaveUrlPart(urlPart, targetId) {
        const url = document.location.href;

        if (url.indexOf(urlPart) != -1) {
            window.addEventListener('unload', (evt) => {
                ym(this.idCounter, 'reachGoal', targetId);
            });
        }
    }

    // Фокус в инпут/текстарею
    setActionFocusInput(targetSelector, targetId) {
        const targetElem = document.querySelector(targetSelector);

        if (targetElem) {
            targetElem.addEventListener('focus', (evt) => {
                if (this.testMode) {
                    console.log('target focusInput: ', targetSelector);
                    console.log('targetId : ', targetId);
                }
                ym(this.idCounter, 'reachGoal', targetId);
            });
        }
    }
}


const yaHelper = new YandexMetrikaHelper(88345790, true);
yaHelper.setActionClick('.feedback-form__btn', 'click-btn');
yaHelper.setActionScrollPx(1000, 'scroll1000'); 
yaHelper.setActionScrollToTarget('.service', 'scrollToBlock'); 
yaHelper.setActionScrollObserver('.last-work', 'scrollToBlock'); 
yaHelper.setActionMatchUrl('http://z920860z.beget.tech/project7/about.html', 'matchUrl'); 
yaHelper.setActionMatchUrlPart('about', 'matchUrlPart'); 
yaHelper.setActionLeaveUrl('http://z920860z.beget.tech/project7/index.html', 'leaveUrl'); 
yaHelper.setActionLeaveUrlPart('about', 'leaveUrlPart'); 
yaHelper.setActionFocusInput('#header-tel', 'focusInput'); 
yaHelper.setActionFocusInput('#header-message', 'focusInput'); 