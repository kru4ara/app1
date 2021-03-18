// Переменные:
const data = [] // Массив со всеми данными
const formElement = document.querySelector('.js-form') // Форма
const openFormButtonElement = document.querySelector('.js-open-form') // Кнопка открытия формы
const closeFormButtonElement = document.querySelector('.js-close-form') // Кнопка закрытия формы
const addItemButtonElement = document.querySelector('.js-add-item') // Кнопка добавления елементов в список
const openFilterElement = document.querySelector('.js-open-filter-form') // Кнопка открытия фильтра
const listWrapElement = document.querySelector('.js-list-wrap') // Подложка списка
const inputElement = document.querySelector('.js-input') // Поле ввода имени и фамилии
const selectDischargeElement = document.querySelector('.js-select') // Список разрядов
const inputNumberElement = document.querySelector('.js-input-number') // Поле ввода отработанных часов
const formFilterElement = document.querySelector('.js-form-filter') // Форма-фильтр
const inputSearchElement = document.querySelector('.js-input-search') // Поле поиска
const openFormFilterButtonElement = document.querySelector('.js-open-filter-form') //Кнопна открытия фильтра
const selectSortElement = document.querySelector('.js-select-sort') // Поле сортировки

// Слушатели событий:
openFormButtonElement.addEventListener('click', handleClickOpenFormButton) // Открытие формы
closeFormButtonElement.addEventListener('click', handleClickCloseFormButton) // Закрытие формы
formElement.addEventListener('submit', handleSubmitAddItemButton) // Добавление элементов в массив data[]
inputSearchElement.addEventListener('input', handleInputSearch) // Поиск элемента
openFormFilterButtonElement.addEventListener('click', handleClickToggleFormFilterButton) // Открытие/Закрытие формы-фильтра
selectSortElement.addEventListener('change', handleChangeSelectSort) // Сортировка элементов

// Обработчики событий:
function handleInputSearch({ target }) {
  const { value } = target
  const resultSearch = data.filter((item) => {
    if (item.content.includes(value)) {
      return true
    }
    return false
  })
  if (resultSearch.length) {
    createList(resultSearch)
  } else {
    listWrapElement.innerHTML = '<div class="text-muted">Совпадений не найдено.</div>'
  }
}

function handleChangeSelectSort({ target }) {
  const { value } = target
  const resultSort = data.sort((a, b) => {
    return b[value] - a[value]
  })
  createList(resultSort)
}

function handleClickToggleFormFilterButton() {
  formFilterElement.classList.toggle('island__item_hidden')
}

function handleClickOpenFormButton() {
  formElement.classList.remove('island__item_hidden')
}

function handleClickCloseFormButton() {
  formElement.classList.add('island__item_hidden')
}

function handleSubmitAddItemButton(event) {
  event.preventDefault()
  const content = inputElement.value.trim()
  const date = buildDate()
  const time = buildTime()
  const discharge = selectDischargeElement.value
  const hoursWorked = inputNumberElement.value
  if (content) {
    data.push({ content, hoursWorked, discharge, date, time })
    //inputElement.value = '' // очистить поле
    formElement.reset() // очистка формы
    createList(data)
  } else {
    alert('Заполните Поле!')
  }
}

function handleClickRemoveButton(event) {
  const { target } = event
  if (target.tagName == 'BUTTON') {
    const { index } = target.dataset
    data.splice(index, 1)
    createList(data)
  }
}

// Создание списка
function createListItem({ content, hoursWorked, discharge, date, time }, index) {
  const template = `
  <li class="list__item" data-index="${index}">
    <span class="badge bg-secondary name">${content}</span>
    <span class="badge bg-warning text-dark ms-auto me-4">${hoursWorked} ч.</span>
    <span class="badge bg-primary text-warning me-4">${renderDischarge(discharge)}</span>
    <span class="text-muted me-3">${date}</span>
    <span class="badge rounded-pill bg-dark me-3">${time}</span>
    <button class="btn btn-danger btn-sm" data-index="${index}">&times;</button>
  </li>
  `
  return template
}

function createList(data = []) {
  const listElement = document.createElement('ol')
  listElement.classList.add('list')
  listWrapElement.innerHTML = ''
  data.forEach((item, index) => {
    listElement.innerHTML = listElement.innerHTML + createListItem(item, index)
  })
  listElement.addEventListener('click', handleClickRemoveButton)
  listWrapElement.append(listElement)
}

// Helpers
//Текущая дата
function buildDate() {
  const date = new Date()
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const year = date.getFullYear()
  const dateNow = `${day}.${month}.${year}`
  return dateNow
}

// Текущее время
function buildTime() {
  const date = new Date()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const timeNow = `${hours}:${minutes}:${seconds}`
  return timeNow
}

// Клонирование разрядов 
function renderDischarge(counter) {
  const template = `
    <svg width="1em" height="1em">
      <use xlink:href="#award"></use>
    </svg>
  `
  let result = ''
  for (let i = 0; i < counter; i++) {
    result += template
  }
  return result
}