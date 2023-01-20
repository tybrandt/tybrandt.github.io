$(document).ready(function () {

    $('.btn').click(function () {
        $(this).toggleClass('button2')
        $(this).toggleClass('button3')
        if ($(this).val() == "Yes") {
            $(this).prop("value", "No");
        }
        else {
            $(this).prop("value", "Yes");
        }
    })

    $("#CAP").click(function(){
        alert("Warning: You are leaving our page, but your data will be saved.");
    });

});

function addRow() {
    let table = document.querySelector('table');

    let nameInput = document.querySelector('#name');
    let timeInput = document.querySelector('#time');
    let notesInput = document.querySelector('#notes');
    let takenInput = document.querySelector('#taken');

    let button = `<input type="button" value="No" class="button button3 btn" onclick="button()">`
    if (takenInput.value == "T" || takenInput.value == "Taken") {
        button = `<input type="button" value="Yes" class="button button2 btn" onclick="button()">`;
    }

    deletebutton = `<input type="button" value="delete?" class="button button1" onclick="deleteRow(this)">`

    let template = `
    <tr>
    <td>💊 ${nameInput.value}</td>
    <td>${timeInput.value}</td>
    <td>${notesInput.value}</td>
    <td>${button}</td>
    <td>${deletebutton}</td>
    </tr>`;

    table.innerHTML += template;

};

function deleteRow(r) {
    if (confirm("Are you sure you want to delete this medication?")) {
        var i = r.parentNode.parentNode.rowIndex;
        document.querySelector('table').deleteRow(i);
    }
};