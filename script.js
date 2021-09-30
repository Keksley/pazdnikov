"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var urlSearchParams = new URLSearchParams(window.location.search);
var params = Object.fromEntries(urlSearchParams.entries());
document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var data;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return getData(params.userId);

        case 3:
          data = _context.sent;
          render(getTables(data));
          _context.next = 13;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          render(null);
          document.location.href = 'https://ya.ru';
          document.querySelector('#app').insertAdjacentHTML('beforeend', "\n    <div class=\"alert alert-danger mt-4\" role=\"alert\">\n      \u041E\u0448\u0438\u0431\u043A\u0430: ".concat(_context.t0, "\n    </div>\n    "));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[0, 7]]);
})));
var eventLocationEnum = {
  1: 'Павильон 3 (пленарный зал, 500 мест)',
  2: 'Большой конференц-зал (90 мест)',
  3: 'Малый конференц-зал (30 мест)',
  4: 'Конференц-зал № 3 В Гранд Холле (65 мест)',
  5: 'Зал заседаний (40 мест)',
  6: 'Амфитеатр (240 мест)'
};
var currentTableId = 0;

function getTableId() {
  return 'table-' + currentTableId++;
}

var format = Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format;

function render(tables) {
  var app = document.getElementById('app');

  if (!tables) {
    app.insertAdjacentHTML('afterbegin', "<div class=\"alert alert-danger mt-4\" role=\"alert\">\n    \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F\n  </div>");
    return;
  }

  addLegend(app);
  var accordion = document.createElement('div');
  accordion.classList.add('accordion');
  Object.keys(tables).forEach(function (eventStartDateTime, index) {
    var accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    var table = getTableElement(tables[eventStartDateTime]);
    var tableId = getTableId();
    var accordionContent = document.createElement('div');
    accordionContent.id = tableId;
    accordionContent.classList.add('accordion-collapse', 'collapse');
    accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    var header = getHeaderElement(eventStartDateTime, tableId);
    accordionItem.appendChild(header);
    accordionItem.appendChild(accordionContent);
    accordionContent.appendChild(accordionBody);
    accordionBody.appendChild(table);
    accordion.appendChild(accordionItem);

    if (index > 0) {
      header.querySelector('.accordion-button').classList.add('collapsed');
    } else {
      accordionContent.classList.add('show');
    }

    app.appendChild(accordion);
  });
  app.appendChild(getSubmitBtnElement(app));
}

function getHeaderElement(eventStartDateTime, id) {
  var header = document.createElement('h4');
  header.classList.add('accordion-header');

  var _eventStartDateTime$s = eventStartDateTime.split('.'),
      _eventStartDateTime$s2 = _slicedToArray(_eventStartDateTime$s, 3),
      dd = _eventStartDateTime$s2[0],
      mm = _eventStartDateTime$s2[1],
      yy = _eventStartDateTime$s2[2];

  var formatedDateForContructor = [mm, dd, yy].join('/');
  header.innerHTML = "\n  <button class=\"accordion-button\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#".concat(id, "\" aria-expanded=\"true\" aria-controls=\"collapseOne\">\n    ").concat(format(new Date(formatedDateForContructor)), "\n  </button>");
  return header;
}

function postData() {
  return _postData.apply(this, arguments);
}

function _postData() {
  _postData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var url,
        data,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';
            data = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            _context3.next = 4;
            return fetch(url, {
              method: 'POST',
              // *GET, POST, PUT, DELETE, etc.
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data) // body data type must match "Content-Type" header

            });

          case 4:
            response = _context3.sent;
            _context3.next = 7;
            return response.json();

          case 7:
            return _context3.abrupt("return", _context3.sent);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _postData.apply(this, arguments);
}

function addLegend(app) {
  app.insertAdjacentHTML('afterend', "\n    <div class=\"container mt-4\">\n    <div class=\"col-2 mb-1\">\u041E\u0431\u043E\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F: </div>\n    <div class=\"col-5\">\n      <table class=\"legend table\">\n        <td class=\"region\">\u0420\u0435\u0433\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u0435</td>\n        <td class=\"table-success\">\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u0435</td>\n      </table>\n    </div>\n  </div>\n  ");
}

function getSubmitBtnElement(app) {
  var btn = document.createElement('button');
  btn.classList.add('btn', 'btn-success', 'mt-4');
  btn.textContent = 'Записаться на выбранные мероприятия';
  var postURL = 'https://forum1.krasgorpark.ru/saveUserEvent';
  btn.addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var selectedIds, request, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            btn.classList.add('disabled');
            selectedIds = _toConsumableArray(app.querySelectorAll('td.table-success')).map(function (td) {
              return td.dataset.eventGuidId;
            });
            request = {
              userId: params.userId,
              selectedEventGuidIds: selectedIds
            };
            app.querySelectorAll('.alert').forEach(function (alertEl) {
              return alertEl.remove();
            });
            _context2.prev = 4;
            btn.classList.remove('disabled');
            _context2.next = 8;
            return fetch(postURL, {
              method: 'POST',
              // *GET, POST, PUT, DELETE, etc.
              // headers: {
              //   'Content-Type': 'application/json',
              // },
              body: JSON.stringify(request) // body data type must match "Content-Type" header

            });

          case 8:
            response = _context2.sent;

            if (response.status === 200) {
              btn.insertAdjacentHTML('afterend', "<div class=\"alert alert-success mt-4\" role=\"alert\">\n            \u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u044B \u043D\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F\n          </div>");
            } else {
              btn.insertAdjacentHTML('afterend', "<div class=\"alert alert-danger mt-4\" role=\"alert\">\n            \u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u043F\u043E\u0437\u0436\u0435.\n          </div>");
            }

            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](4);
            btn.insertAdjacentHTML('afterend', "<div class=\"alert alert-danger mt-4\" role=\"alert\">\n      \u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u043F\u043E\u0437\u0436\u0435.\n    </div>");

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 12]]);
  })));
  return btn;
}

function getTHeadElement() {
  var tableHeader = document.createElement('thead');
  var tableHeaderRow = document.createElement('tr');
  [0, 1, 2, 3, 4, 5, 6].forEach(function (eventLocationId) {
    var th = document.createElement('th');
    th.textContent = eventLocationEnum[eventLocationId] ? eventLocationEnum[eventLocationId] : '';
    tableHeaderRow.appendChild(th);
  });
  tableHeader.appendChild(tableHeaderRow);
  return tableHeader;
}

function getTableElement(data) {
  var table = document.createElement('table');
  table.classList.add('table', 'table-bordered');
  var thead = getTHeadElement();
  table.appendChild(thead);
  var tbody = getTbodyElement(data);
  table.appendChild(tbody);
  return table;
}

function getTbodyElement(rows) {
  var tbody = document.createElement('tbody');
  Object.keys(rows).sort().forEach(function (key) {
    var row = rows[key];
    var rowData = []; // Сортируем и вставляем пустые ячейки если события в этом месте нет

    var eventLocationsCount = 7;

    var _loop = function _loop(i) {
      var currentEl = row.find(function (el) {
        return el.eventLocation === i;
      });

      if (currentEl) {
        rowData.push(currentEl);
      } else {
        rowData.push(null);
      }
    };

    for (var i = 1; i <= eventLocationsCount; i++) {
      _loop(i);
    }

    var tr = document.createElement('tr');
    var timeTD = document.createElement('td');
    timeTD.classList.add('text-nowrap', 'empty');
    timeTD.textContent = "".concat(key, " - ").concat(row[0].eventEndDateTime.slice(-5));
    tr.appendChild(timeTD);
    var bigEvent = rowData.find(function (event) {
      return event && event.eventLocation === 7;
    });

    if (bigEvent) {
      var td = document.createElement('td');
      td.colSpan = 6;

      if (bigEvent.isSelected) {
        td.classList.add('table-success');
      }

      if (bigEvent.isRegion) {
        td.classList.add('region');
      }

      td.dataset.eventGuidId = bigEvent.eventGuidId;
      td.textContent = bigEvent.eventName;
      tr.appendChild(td);
    } else {
      rowData.forEach(function (eventData, index) {
        if (index === 6) {
          return;
        }

        var td = document.createElement('td');

        if (eventData) {
          if (eventData.isSelected) {
            td.classList.add('table-success');
          }

          if (eventData.isRegion) {
            td.classList.add('region');
          }

          td.dataset.eventGuidId = eventData.eventGuidId;
          td.textContent = eventData.eventName;
        } else {
          td.classList.add('empty');
        }

        tr.appendChild(td);
      });
    }

    var selected = tr.querySelector('.table-success');

    if (selected) {
      selected.classList.add('table-success');
      tr.childNodes.forEach(function (td) {
        return td.classList.add('table-light');
      });
      selected.classList.remove('table-light');
    }

    tr.addEventListener('click', function (e) {
      var target = e.target;

      if (target.classList.contains('empty')) {
        return;
      }

      if (target.tagName === 'TD') {
        if (target.classList.contains('table-success')) {
          tr.childNodes.forEach(function (td) {
            return td.classList.remove('table-light');
          });
          tr.childNodes.forEach(function (td) {
            return td.classList.remove('table-success');
          });
        } else {
          tr.childNodes.forEach(function (td) {
            return td.classList.remove('table-success');
          });
          target.classList.add('table-success');
          tr.childNodes.forEach(function (td) {
            return td.classList.add('table-light');
          });
          target.classList.remove('table-light');
        }
      }
    });
    tbody.appendChild(tr);
  });
  return tbody;
}

function getTables(data) {
  var tables = {};
  data.forEach(function (el) {
    // Берём дату без времени за ключ и генерируем объект таблицы
    var eventStartDateTime = el.eventStartDateTime.slice(0, 10);

    if (tables[eventStartDateTime]) {
      tables[eventStartDateTime].push(el);
    } else {
      tables[eventStartDateTime] = [el];
    }
  }); // Берём время без даты за ключ и генерируем объекты строк таблицы

  Object.keys(tables).forEach(function (key) {
    var rows = {};
    var tableData = tables[key];
    tableData.forEach(function (el) {
      var time = el.eventStartDateTime.slice(-5);

      if (rows[time]) {
        rows[time].push(el);
      } else {
        rows[time] = [el];
      }
    });
    tables[key] = rows;
  });
  return tables;
}

function getData(_x) {
  return _getData.apply(this, arguments);
}

function _getData() {
  _getData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(userId) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(res, rej) {
                var response, json;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return fetch("https://forum1.krasgorpark.ru/getAllEvents?userId=".concat(userId));

                      case 3:
                        response = _context4.sent;

                        if (response.status !== 200) {
                          rej(Error('Не удалось получить данные'));
                        }

                        _context4.next = 7;
                        return response.json();

                      case 7:
                        json = _context4.sent;
                        res(json);
                        _context4.next = 14;
                        break;

                      case 11:
                        _context4.prev = 11;
                        _context4.t0 = _context4["catch"](0);
                        rej(Error('Не удалось получить данные'));

                      case 14:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, null, [[0, 11]]);
              }));

              return function (_x2, _x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getData.apply(this, arguments);
}