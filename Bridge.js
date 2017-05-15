/* Nga - Retro - JavaScript Interface ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   Copyright (c) 2008 - 2016, Charles Childers
   Copyright (c) 2009 - 2010, Luke Parrish
   Copyright (c) 2010,        Marc Simpson
   Copyright (c) 2010,        Jay Skeer
   Copyright (c) 2011,        Kenneth Keating
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function loadInitialImage() {
  image = ngaImage.slice();
}

function execute(offset) {
  var opcode;
  address.sp = 1;
  ip = offset;
  var notfound = d_xt_for("err:notfound");
  while (ip < IMAGE_SIZE) {
    opcode = image[ip];
    if (ip == notfound) {
      document.getElementById('console').value += "<p>err:notfound : " + string_extract(1471) + "<br>";
      console.log("err:notfound");
      console.log(" - __" + string_extract(1471) + "__");
    }
    if (validatePackedOpcodes(opcode) != 0) {
      if (opcode == 1000) {
        var s = String.fromCharCode(data.pop());
        document.getElementById('console').value += s;
      } else {
        ngaProcessPackedOpcodes(opcode);
      }
    } else {
      console.log("Invalid instruction!");
      console.log("At " + ip + ", opcode " + opcode);
    }
    if (address.sp == 0)
      ip = IMAGE_SIZE;
    ip++;
  }
}

function checkStack()
{
  var depth  = data.depth();
  var adepth = address.depth();
  var flag = 0;
  if (depth < 0 || adepth < 0)
  {
    flag = -1;
  }
  if (depth > DATA_DEPTH || adepth > DATA_DEPTH)
  {
    flag = -1;
  }
  if (flag == -1)
  {
    ip = 0;
    data.sp = 0;
    address.sp = 0;
  }
}

function string_inject(str, buffer) {
  var m = str.length;
  var i = 0;
  while (m > 0) {
    image[buffer + i] = str[i].charCodeAt(0);
    image[buffer + i + 1] = 0;
    m--; i++;
  }
}
function string_extract(at) {
  string_data = "";
  var starting = at;
  var i = 0;
  while (image[starting] != 0)
    string_data += String.fromCharCode(image[starting++]);
  return string_data;
}

function d_link(dt) {
  return dt + 0;
}

function d_xt(dt) {
  return dt + 1;
}

function d_class(dt) {
  return dt + 2;
}

function d_name(dt) {
  return dt + 3;
}

function d_count_entries() {
  var c = 0;
  var i = image[2];
  while (image[i] != 0) {
    c++;
    i = image[i];
  }
  return c;
}

function d_lookup(name) {
  var dt = 0;
  var i = image[2];
  var dname;
  while (image[i] != 0 && i != 0) {
    dname = string_extract(d_name(i));
    if (dname == name) {
      dt = i;
      i = 0;
    } else {
      i = image[i];
    }
  }
  return dt;
}

function d_xt_for(name) {
  return image[d_xt(d_lookup(name))];
}

function d_class_for(name) {
  return image[d_class(d_lookup(name))];
}

function evaluate(s) {
  if (s.length == 0)
    return;
  var i = d_xt_for("interpret");
  string_inject(s, 1471);
  data.push(1471);
  execute(i);
}

function cls() {
  document.getElementById('console').value = "";
}

function unu(src) {
  raw = src.split("\n");
  var i = raw.length;
  var lines = new Array();
  var j = 0;
  var code = 0;
  while (j < i) {
    if (code == 1 && raw[j] == "````") {
      code = 0;
    } else if (code == 0 && raw[j] == "````") {
      code = 1;
    } else if (code == 1) {
      lines.push(raw[j]);
    }
    j++;
  }
  return lines.join(" ");
}

function main() {
  rxPrepareVM();
  loadInitialImage();
}

function go() {
  rxPrepareVM();
  loadInitialImage();
  src = document.getElementById("input").value;
  tokens = unu(src).match(/\S+/g);
  var i = tokens.length;
  var j = 0;
  while (j < i) {
    evaluate(tokens[j]);
    j++;
  }
  s = "";
  i = data.depth();
  j = 1;
  while (j <= i) {
    s = s + data.data[j] + " ";
    j++;
  }
  document.getElementById("console").value += "\n";
}

function save() {
  src = document.getElementById("input").value;
  console.log('saving ' + src);
  localStorage.setItem("Usercode", src);
}

function load() {
  src = localStorage.getItem("Usercode");
  document.getElementById("input").value = src;
  main();
}


function saveSnapshot() {
  src = document.getElementById("input").value;
  console.log('saving ' + src);
  localStorage.setItem("Snapshot", src);
}

function loadSnapshot() {
  src = localStorage.getItem("Snapshot");
  document.getElementById("input").value = src;
}

function handleListener(e) {
  if (e.keyCode == 13 || e.keyCode == 10) {
  src = document.getElementById("listener").value;
  tokens = src.match(/\S+/g);
  var i = tokens.length;
  var j = 0;
  while (j < i) {
    evaluate(tokens[j]);
    j++;
  }
  s = "";
  i = data.depth();
  j = 1;
  while (j <= i) {
    s = s + data.data[j] + " ";
    j++;
  }
  document.getElementById("listener").value = "";
  document.getElementById("console").value += "\n";
      return false;
  }
}
