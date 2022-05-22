"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

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
var YandexMetrikaHelper = /*#__PURE__*/function () {
  function YandexMetrikaHelper(idCounter) {
    var testMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, YandexMetrikaHelper);

    this.idCounter = idCounter, this.testMode = testMode;
  } //Вызов по клику на элемент по его селектору. Элемент может быть динамический


  _createClass(YandexMetrikaHelper, [{
    key: "setActionClick",
    value: function setActionClick(targetSelector, targetId) {
      var _this = this;

      document.addEventListener('click', function (evt) {
        if (evt.target.closest(targetSelector)) {
          if (_this.testMode) {
            console.log('target click: ', targetSelector);
            console.log('targetId : ', targetId);
          }

          ym(_this.idCounter, 'reachGoal', targetId);
        }
      });
    } //При доскралливании страницы на определенное количество пикселей

  }, {
    key: "setActionScrollPx",
    value: function setActionScrollPx(numberPx, targetId) {
      var _this2 = this;

      var targetCompleted = false;
      window.addEventListener('scroll', function (evt) {
        if (!targetCompleted && window.scrollY >= numberPx) {
          targetCompleted = true;

          if (_this2.testMode) {
            console.log('target scrollpx: ', numberPx);
            console.log('targetId : ', targetId);
          }

          ym(_this2.idCounter, 'reachGoal', targetId);
        }
      });
    } //При доскралливании страницы до нужного элемента

  }, {
    key: "setActionScrollToTarget",
    value: function setActionScrollToTarget(targetSelector, targetId) {
      var _this3 = this;

      var targetCompleted = false;
      var targetElem = document.querySelector(targetSelector);

      if (targetElem) {
        window.addEventListener('scroll', function (evt) {
          if (!targetCompleted && document.documentElement.clientHeight * 0.7 > targetElem.getBoundingClientRect().top) {
            targetCompleted = true;

            if (_this3.testMode) {
              console.log('target scrollToElem: ', targetSelector);
              console.log('targetId : ', targetId);
            }

            ym(_this3.idCounter, 'reachGoal', targetId);
          }
        });
      }
    } //При доскралливании страницы до нужного элемента
    //вариант с использованием IntersectionObserver

  }, {
    key: "setActionScrollObserver",
    value: function setActionScrollObserver(targetSelector, targetId) {
      var _this4 = this;

      var targetElem = document.querySelector(targetSelector);

      if (targetElem) {
        var observer = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (_this4.testMode) {
                console.log('target scrollToElem: ', targetSelector);
                console.log('targetId : ', targetId);
              }

              ym(_this4.idCounter, 'reachGoal', targetId);
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1
        });
        observer.observe(targetElem);
      }
    } // При входе на определенную страницу
    // Конкретный урл

  }, {
    key: "setActionMatchUrl",
    value: function setActionMatchUrl(fullUrlName, targetId) {
      var url = document.location.href;

      if (fullUrlName == url) {
        if (this.testMode) {
          console.log('target matchUrl: ', fullUrlName);
          console.log('targetId : ', targetId);
        }

        ym(this.idCounter, 'reachGoal', targetId);
      }
    } // При входе на определенную страницу
    // По вхождению урла - по куску

  }, {
    key: "setActionMatchUrlPart",
    value: function setActionMatchUrlPart(urlPart, targetId) {
      var url = document.location.href;

      if (url.indexOf(urlPart) != -1) {
        if (this.testMode) {
          console.log('target matchUrlPart: ', urlPart);
          console.log('targetId : ', targetId);
        }

        ym(this.idCounter, 'reachGoal', targetId);
      }
    } // При уходе с определенной страницы
    // Конкретный урл

  }, {
    key: "setActionLeaveUrl",
    value: function setActionLeaveUrl(fullUrlName, targetId) {
      var _this5 = this;

      var url = document.location.href;

      if (fullUrlName == url) {
        window.addEventListener('unload', function (evt) {
          ym(_this5.idCounter, 'reachGoal', targetId);
        });
      }
    } // При уходе с определенной страницы
    // По вхождению урла

  }, {
    key: "setActionLeaveUrlPart",
    value: function setActionLeaveUrlPart(urlPart, targetId) {
      var _this6 = this;

      var url = document.location.href;

      if (url.indexOf(urlPart) != -1) {
        window.addEventListener('unload', function (evt) {
          ym(_this6.idCounter, 'reachGoal', targetId);
        });
      }
    } // Фокус в инпут/текстарею

  }, {
    key: "setActionFocusInput",
    value: function setActionFocusInput(targetSelector, targetId) {
      var _this7 = this;

      var targetElem = document.querySelector(targetSelector);

      if (targetElem) {
        targetElem.addEventListener('focus', function (evt) {
          if (_this7.testMode) {
            console.log('target focusInput: ', targetSelector);
            console.log('targetId : ', targetId);
          }

          ym(_this7.idCounter, 'reachGoal', targetId);
        });
      }
    }
  }]);

  return YandexMetrikaHelper;
}();

var yaHelper = new YandexMetrikaHelper(88345790, true);
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