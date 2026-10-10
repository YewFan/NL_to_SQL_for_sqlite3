const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const btn5 = document.getElementById("btn5");
const btn6 = document.getElementById("btn6");
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
btn1.onclick = () => {
    alert(abc.version);
}

btn2.onclick = () => {
    abc.saveSQL(input1.value);

}

btn3.onclick = () => {
    abc.saveDBpath(input2.value);
}

btn4.onclick = async () => {
   let x = await abc.NL_to_SQL();
   alert(x);
}


btn5.onclick = async () => {
   let x = await abc.readFile();
alert(x);
}

btn6.onclick = async () => {
   let x = await abc.show_db_operation();
alert(x);
}
