'use strict';

window.addEventListener('load', getData);

function getData() {
  let http = new XMLHttpRequest();
  http.open("GET", 'http://localhost:3000/attractions', true);
  http.onload = (e) => {
    let payload = JSON.parse(http.responseText);
    //delete column
    payload.forEach(element => {
      delete element.id;      
    });  

    //parameters: form method and action
    headAndForm(getHeaders(payload[0]), 'POST', '/add');
    fillTable(payload);
    //parameter: set type of button
    //id of buttons one to payload.length top to bottom
    buttonColumn(payload, "button");
  }
  http.send();
}

function getHeaders(data) {
  let headers = [];
  //prettify headers
  for (const key in data) {
    headers.push(key.charAt(0).toUpperCase() + key.replace('_', ' ').slice(1));
  }
  for (let index = 0; index < headers.length; index++) {
      headers[index] = headers[index].replace('Attr name', 'Name');
  }
  return headers;
}

function headAndForm(data, method, action) {
  let table = document.createElement('table');
  document.querySelector('body').appendChild(table);
  let tr = document.createElement('tr');
  table.appendChild(tr);

  let form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', action);
  document.querySelector('body').appendChild(form);
  for (let index = 0; index < data.length; index++) {
    let th = document.createElement('th');
    th.innerHTML = data[index];
    tr.appendChild(th);

    let label = document.createElement('label');
    label.innerHTML = data[index] + ': ';
    label.setAttribute('for', data[index]);
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', data[index]);
    input.setAttribute('value', '');
    input.setAttribute('required', true);
    let br = document.createElement('br');

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(br);
  }
  let button = document.createElement('button');
  button.setAttribute('type', 'Submit');
  button.innerHTML = 'Submit';
  form.appendChild(button);
}

function fillTable(data) {
  for (let index = 0; index < data.length; index++) {
    let table = document.querySelector('table');
    let newRow = document.createElement('tr');
    let values = Object.values(data[index]);
    table.appendChild(newRow);
    for (let index = 0; index < values.length; index++) {
      let td = document.createElement('td');
      td.innerHTML = values[index];
      newRow.appendChild(td);
    }
  }
}

function buttonColumn(data, type) {
  let first = document.querySelectorAll('tr')[0];
  let blank = document.createElement('td');
  blank.innerHTML = '';
  first.appendChild(blank);

  for (let index = 0; index < data.length; index++) {
    let row = document.querySelectorAll('tr')[index + 1];
    let td = document.createElement('td');
    td.innerHTML = `<button type=${type} >Edit</button>`;
    td.setAttribute('id', index);
    row.appendChild(td);
  }
}

window.addEventListener('load', getData);