/* Nga ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   Copyright (c) 2008 - 2016, Charles Childers
   Copyright (c) 2009 - 2010, Luke Parrish
   Copyright (c) 2010,        Marc Simpson
   Copyright (c) 2010,        Jay Skeer
   Copyright (c) 2011,        Kenneth Keating
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var   IMAGE_SIZE    = 524288*4;       /* Amount of simulated RAM    */
var   DATA_DEPTH    =   8192;         /* Depth of data stack        */
var   ADDRESS_DEPTH =  32768;         /* Depth of the stacks        */
function Stack(size)
{
  this.sp    = 0;
  this.data  = new Array(size);
  this.push  = function(n) { this.sp++; this.data[this.sp] = n; }
  this.pop   = function()  { return this.data[this.sp--]; }
  this.depth = function()  { return this.sp; }
  this.tos   = function()  { return this.data[this.sp]; }
  this.nos   = function()  { return this.data[this.sp - 1]; }
  this.dup   = function()  { this.push(this.tos()); }
  this.drop  = function()  { this.sp--; }
  this.swap  = function()  { var a = this.nos();
                             this.data[this.sp - 1] = this.tos();
                             this.data[this.sp] = a;
                           }
  this.inc   = function()  { this.data[this.sp]++; }
  this.dec   = function()  { this.data[this.sp]--; }
  this.reset = function()  { this.sp = 0; }
}
function Opcodes()
{
  this.NOP = 0;       this.LIT = 1;
  this.DUP = 2;       this.DROP = 3;
  this.SWAP = 4;      this.PUSH = 5;
  this.POP = 6;       this.JUMP = 7;
  this.CALL = 8;      this.CCALL = 9;
  this.RETURN = 10;   this.EQ = 11;
  this.NEQ = 12;      this.LT = 13;
  this.GT = 14;       this.FETCH = 15;
  this.STORE = 16;    this.ADD = 17;
  this.SUB = 18;      this.MUL = 19;
  this.DIVMOD = 20;   this.AND = 21;
  this.OR = 22;       this.XOR = 23;
  this.SHIFT = 24;    this.ZERO_EXIT = 25;
  this.END = 26;
}
var ip = 0;
var data    = new Stack(DATA_DEPTH);
var address = new Stack(ADDRESS_DEPTH);
var image   = new Array(IMAGE_SIZE);
var vm = new Opcodes();
var instructions = new Array(vm.END);
function rxPrepareVM()
{
  ip = 0;
  data.reset();
  address.reset();
}
instructions[vm.NOP] = function() { }
instructions[vm.LIT] = function()
{
  ip++;
  data.push(image[ip]);
}
instructions[vm.DUP] = function()
{
  data.dup();
}
instructions[vm.DROP] = function()
{
  data.drop();
}
instructions[vm.SWAP] = function()
{
  data.swap();
}
instructions[vm.PUSH] = function()
{
  address.push(data.pop());
}
instructions[vm.POP] = function()
{
  data.push(address.pop())
}
instructions[vm.JUMP] = function()
{
  ip = data.pop() - 1;
}
instructions[vm.CALL] = function()
{
  address.push(ip);
  ip = data.pop() - 1;
}
instructions[vm.CCALL] = function()
{
  var a, b;
  a = data.pop();
  b = data.pop();
  if (b != 0) {
    address.push(ip);
    ip = a - 1;
  }
}
instructions[vm.RETURN] = function()
{
  ip = address.pop();
}
instructions[vm.EQ] = function()
{
  var a, b;
  a = data.pop();
  b = data.pop();
  if (b == a)
    data.push(-1);
  else
    data.push(0);
}
instructions[vm.NEQ] = function()
{
  var a, b;
  a = data.pop();
  b = data.pop();
  if (b != a)
    data.push(-1);
  else
    data.push(0);
}
instructions[vm.LT] = function()
{
  var a, b;
  a = data.pop();
  b = data.pop();
  if (b < a)
    data.push(-1);
  else
    data.push(0);
}
instructions[vm.GT] = function()
{
  var a, b;
  a = data.pop();
  b = data.pop();
  if (b > a)
    data.push(-1);
  else
    data.push(0);
}
instructions[vm.FETCH] = function()
{
  x = data.pop();
  if (x == -1)
    data.push(data.sp);
  else if (x == -2)
    data.push(address.sp);
  else if (x == -3)
    data.push(IMAGE_SIZE);
  else
    data.push(image[x]);
}
instructions[vm.STORE] = function()
{
  image[data.tos()] = data.nos();
  data.drop();
  data.drop();
}
instructions[vm.ADD] = function()
{
  var x = data.pop();
  var y = data.pop();
  data.push(x + y);
}
instructions[vm.SUB] = function()
{
  var x = data.pop();
  var y = data.pop();
  data.push(y - x);
}
instructions[vm.MUL] = function()
{
  var x = data.pop();
  var y = data.pop();
  data.push(y * x);
}
instructions[vm.DIVMOD] = function()
{
  var b = data.pop();
  var a = data.pop();
  if (b == 0)
  {
    ip = 0;
    data.sp = 0;
    address.sp = 0;
  }
  else
  {
    var x = Math.abs(b);
    var y = Math.abs(a);
    var q = Math.floor(y / x);
    var r = y % x;
    if (a < 0 && b < 0)
      r = r * -1;
    if (a > 0 && b < 0)
      q = q * -1;
    if (a < 0 && b > 0)
    {
      r = r * -1;
      q = q * -1;
    }
    data.push(r);
    data.push(q);
  }
}
instructions[vm.AND] = function()
{
  var x = data.pop();
  var y = data.pop();
  data.push(x & y);
}
instructions[vm.OR] = function()
{
  var x = data.pop();
  var y = data.pop();
  data.push(x | y);
}
instructions[vm.XOR] = function()
{
  var x = data.pop();
  var y = data.pop();
  data.push(x ^ y);
}
instructions[vm.SHIFT] = function()
{
  var x = data.pop();
  var y = data.pop();
  if (x < 0)
    data.push(y << (x * -1));
  else
    data.push(y >>= x);
}
instructions[vm.ZERO_EXIT] = function()
{
  if (data.tos() == 0)
  {
    data.drop();
    ip = address.pop();
  }
}
instructions[vm.END] = function()
{
  ip = IMAGE_SIZE;
}
window.addEventListener('load', function(e) {
  rxPrepareVM();
}, false);
function processOpcode(opcode)
{
  instructions[opcode]();
  checkStack();
}
function validatePackedOpcodes(opcode) {
  var raw = opcode;
  var current;
  var valid = -1;
  var i = 0;
  while (i < 4) {
    current = raw & 0xFF;
    if (!current >= 0 && current <= 26)
      valid = 0;
    raw = raw >> 8;
    i++;
  }
}
function ngaProcessPackedOpcodes(opcode) {
  var raw = opcode;
  ops = new Array(3);
  ops[0]= raw & (255);
  raw = raw >> 8;
  ops[1]= raw & (255);
  raw = raw >> 8;
  ops[2]= raw & (255);
  raw = raw >> 8;
  ops[3]= raw & (255);
  processOpcode(ops[0]);
  processOpcode(ops[1]);
  processOpcode(ops[2]);
  processOpcode(ops[3]);
}
