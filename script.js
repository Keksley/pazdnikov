const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
document.addEventListener('DOMContentLoaded', async () => {
  let data;
  try {
    data = await getData(params.userId);
    render(getTables(data));
    setFilter();
  } catch (e) {
    console.error(e);
    render(null);
    // document.location.href = 'https://ya.ru';
    document.querySelector('#app').insertAdjacentHTML('beforeend', `
    <div class="alert alert-danger mt-4" role="alert">
      Ошибка: ${e}
    </div>
    `)
  }
});

const eventLocationEnum = {
  1: 'Павильон 3 (пленарный зал, 500 мест)',
  2: 'Большой конференц-зал (90 мест)',
  3: 'Малый конференц-зал (30 мест)',
  4: 'Конференц-зал № 3 В Гранд Холле (65 мест)',
  5: 'Зал заседаний (40 мест)',
  6: 'Амфитеатр (240 мест)',
};

let currentTableId = 0;
function getTableId() {
  return 'table-' + currentTableId++;
}

const format = Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format;

function render(tables) {
  const app = document.getElementById('app');
  if (!tables) {
    app.insertAdjacentHTML(
      'afterbegin',
      `<div class="alert alert-danger mt-4" role="alert">
    Не удалось загрузить мероприятия
  </div>`
    );
    return;
  }
  const accordion = document.createElement('div');
  accordion.classList.add('accordion');

  Object.keys(tables).sort().forEach((eventStartDateTime, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    const table = getTableElement(tables[eventStartDateTime]);
    const tableId = getTableId();
    const accordionContent = document.createElement('div');
    accordionContent.id = tableId;
    accordionContent.classList.add('accordion-collapse', 'collapse');
    accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    addLegend(accordionBody);
    const header = getHeaderElement(eventStartDateTime, tableId);
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
  const header = document.createElement('h4');
  header.classList.add('accordion-header');
  const [dd, mm, yy] = eventStartDateTime.split('.');
  const formatedDateForContructor = [mm, dd, yy].join('/');
  header.innerHTML = `
  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="true" aria-controls="collapseOne">
    ${format(new Date(formatedDateForContructor))}
  </button>`;
  return header;
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

function addLegend(parent) {
  parent.insertAdjacentHTML('afterbegin', `
      <div class="row legend">
        <div class="col-2 mb-1">Обозначения: </div>
        <div class="col-5">
          <table class="legend table">
            <td class="region">Международный парковый форум</td>
            <td class="table-success">Выбранное мероприятие</td>
            <td class="other">Другое</td>
          </table>
      </div>
  </div>
  `)
}

function getSubmitBtnElement(app) {
  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-success', 'mt-4');
  btn.innerHTML = `Записаться на выбранные мероприятия
  <div class="spinner-border text-light"" role="status" style="width: 1rem; height: 1rem; display: none;"></div>`;
  const postURL = 'https://forum1.krasgorpark.ru/saveUserEvent';
  btn.addEventListener('click', async () => {
    btn.classList.add('disabled');
    btn.querySelector('.spinner-border').style.display = 'inline-block';
    const selectedIds = [...app.querySelectorAll('td.table-success')].map(
      (td) => td.dataset.eventGuidId
    );
    const request = {
      userId: params.userId,
      selectedEventGuidIds: selectedIds,
    };
    app.querySelectorAll('.alert').forEach((alertEl) => alertEl.remove());
    let response;
    try {
      response = await fetch(postURL, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request), // body data type must match "Content-Type" header
      })
      btn.classList.remove('disabled');
      btn.querySelector('.spinner-border').style.display = 'none';
      if (response.status === 200) {
        btn.insertAdjacentHTML(
          'afterend',
          `<div class="alert alert-success mt-4" role="alert">
            Вы успешно записаны на выбранные мероприятия
          </div>`
        );
      } else {
        btn.insertAdjacentHTML(
          'afterend',
          `<div class="alert alert-danger mt-4" role="alert">
            Что-то пошло не так, пожалуйста, повторите попытку позже.
          </div>`
        );  
      }
    } catch {
      btn.classList.remove('disabled');
      btn.querySelector('.spinner-border').style.display = 'none';
      btn.insertAdjacentHTML(
        'afterend',
        `<div class="alert alert-danger mt-4" role="alert">
      Что-то пошло не так, пожалуйста, повторите попытку позже.
    </div>`
      );
    }
  });
  return btn;
}

function getTHeadElement() {
  const tableHeader = document.createElement('thead');
  const tableHeaderRow = document.createElement('tr');
  [0, 1, 2, 3, 4, 5, 6].forEach((eventLocationId) => {
    const th = document.createElement('th');
    th.textContent = eventLocationEnum[eventLocationId]
      ? eventLocationEnum[eventLocationId]
      : '';
    tableHeaderRow.appendChild(th);
  });
  tableHeader.appendChild(tableHeaderRow);
  return tableHeader;
}

function getTableElement(data) {
  const table = document.createElement('table');
  table.classList.add('table', 'table-bordered');

  const thead = getTHeadElement();
  table.appendChild(thead);
  const tbody = getTbodyElement(data);
  table.appendChild(tbody);

  return table;
}

function getTbodyElement(rows) {
  const tbody = document.createElement('tbody');

  Object.keys(rows).sort().forEach((key) => {
    const row = rows[key];
    const rowData = [];
    // Сортируем и вставляем пустые ячейки если события в этом месте нет
    const eventLocationsCount = 7;
    for (let i = 1; i <= eventLocationsCount; i++) {
      const currentEl = row.find((el) => el.eventLocation === i);
      if (currentEl) {
        rowData.push(currentEl);
      } else {
        rowData.push(null);
      }
    }
    const tr = document.createElement('tr');
    const timeTD = document.createElement('td');
    timeTD.classList.add('text-nowrap', 'empty');
    timeTD.textContent = `${key} - ${row[0].eventEndDateTime.slice(-5)}`;
    tr.appendChild(timeTD);
    const bigEvent = rowData.find(event => event && event.eventLocation === 7);

    if (bigEvent) {
      const td = document.createElement('td');
      td.colSpan = 6;
      if (bigEvent.isSelected) {
        td.classList.add('table-success');
      }
      if (bigEvent.isRegion) {
        td.classList.add('region')
      }
      td.dataset.eventGuidId = bigEvent.eventGuidId;
      td.textContent = bigEvent.eventName;
      tr.appendChild(td);
    } else {
      rowData.forEach((eventData, index) => {
        if (index === 6) {
          return;
        }
        const td = document.createElement('td');
        if (eventData) {
          if (eventData.isSelected) {
            td.classList.add('table-success');
          }
          if (eventData.isRegion) {
            td.classList.add('region')
          }
          td.dataset.eventGuidId = eventData.eventGuidId;
          td.textContent = eventData.eventName;
        } else {
          td.classList.add('empty');
        }
  
        tr.appendChild(td);
      });
    }
    const selected = tr.querySelector('.table-success');
    if (selected) {
      selected.classList.add('table-success');
    }
    tr.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('empty')) {
        return;
      }
      if (target.tagName === 'TD') {
        if (target.classList.contains('table-success')) {
          tr.childNodes.forEach((td) => td.classList.remove('table-success'));
        } else {
          tr.childNodes.forEach((td) => td.classList.remove('table-success'));
          target.classList.add('table-success');
        }
      }
    });
    tbody.appendChild(tr);
  });
  return tbody;
}

function getTables(data) {
  const tables = {};

  data.forEach((el) => {
    // Берём дату без времени за ключ и генерируем объект таблицы
    const eventStartDateTime = el.eventStartDateTime.slice(0, 10);
    if (tables[eventStartDateTime]) {
      tables[eventStartDateTime].push(el);
    } else {
      tables[eventStartDateTime] = [el];
    }
  });
  // Берём время без даты за ключ и генерируем объекты строк таблицы
  const keys = Object.keys(tables);
  keys.forEach((key) => {
    const rows = {};
    const tableData = tables[key];
    tableData.forEach((el) => {
      const time = el.eventStartDateTime.slice(-5);
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

async function getData(userId) {
  return new Promise(async (res, rej) => {
    try {
      const response = await fetch(
        `https://forum1.krasgorpark.ru/getAllEvents?userId=${userId}`
      );
      if (response.status !== 200) {
        rej(Error('Не удалось получить данные'));
      }
      const json = await response.json();
      res(json);
    } catch {
      rej(Error('Не удалось получить данные'));
    }
  });
}

function switchFilter(btn, filteredSelector) {
  const table = document.querySelector('.accordion .table:not(.legend)');

  if (!btn.classList.contains('btn-primary')) {
    table.querySelectorAll('td.filtered').forEach(td => {
      td.classList.remove('empty', 'filtered');
    })
    if (filteredSelector) {
      table.querySelectorAll(filteredSelector).forEach(td => {
        td.classList.add('empty', 'filtered');
      }) 
    }
  }
}

function setFilter() {
  const all = document.getElementById('filter-all');
  const region = document.getElementById('filter-region');
  const other = document.getElementById('filter-other');
  
  const switchBtns = (btn) => {
    [all, region, other].forEach(curBtn => curBtn.classList.remove('btn-primary'));
    btn.classList.add('btn-primary');
  } 

  region.addEventListener('click', () => {
    switchFilter(region, 'td:not(.region):not(.empty)');
    switchBtns(region);
  })
  all.addEventListener('click', () => {
    switchFilter(all);
    switchBtns(all);
  })
  other.addEventListener('click', () => {
    switchFilter(other, 'td.region:not(.empty)')
    switchBtns(other);
  })
}