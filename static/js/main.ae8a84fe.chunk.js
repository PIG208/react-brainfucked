(this["webpackJsonpreact-brainfucked"]=this["webpackJsonpreact-brainfucked"]||[]).push([[0],{383:function(e,t,r){},384:function(e,t,r){},385:function(e,t,r){},386:function(e,t,r){},387:function(e,t,r){"use strict";r.r(t);var n=r(1),o=r.n(n),i=r(61),a=r.n(i),c=r(2),s=r(15),l=r(62),d=r.n(l),u=r(18),b=function(e){return Object(s.a)(Object(s.a)({},e),{},{buffer:e.buffer.slice(0),readBuffer:e.readBuffer.slice(0)})},h=function(e){return{buffer:[],size:e,pointer:0,readPointer:0,readBuffer:[],pendingSize:0}},p=function(e,t){switch(t.type){case"read":return function(e,t){var r=b(e);return r.pendingSize>0||r.buffer.length<=r.readPointer?(r.pendingSize+=t,r):(r.readBuffer=r.buffer.slice(r.readPointer,r.readPointer+t),r.readPointer=r.readPointer+r.readBuffer.length,r.readBuffer.length<t&&(r.pendingSize+=t-r.readBuffer.length),r)}(e,t.data);case"write":return function(e,t){"number"==typeof t&&(t=[t]);var r=b(e);return r.buffer=r.buffer.slice(0,r.pointer).concat(t),r.pointer+=t.length,r.pendingSize>0&&(r.pendingSize=Math.max(r.pendingSize-t.length,0)),r}(e,t.data);case"seek":return function(e,t){var r=b(e);return r.pointer=t,r.readPointer=t,r}(e,t.data)}},j=new Set(["<",">",",",".","[","]","+","-"]),f=function(e){return Object(s.a)(Object(s.a)({},e),{},{breakpoints:e.breakpoints.slice(0)})},m=function(e){return e.memory.query(e.dataPointer)},O=function(e,t){return e.memory=e.memory.update(e.dataPointer,t)},g=function(e){return e.program[e.programCounter]},x=function(e){return e.programCounter===e.program.length},y=function(e){return e.programCounter>0||e.blocked},k=function(e){return"breakpoint"===e.blockType&&e.blocked},v=function(e){var t;if(e.startsWith("[")){for(var r=1,n=1;r>0;){if("["===e[n]&&r++,"]"===e[n]&&r--,n>3e4)return{program:[],loopForward:Object(u.a)(),loopBackward:Object(u.a)()};n++}e=e.slice(n+1)}t=e.split("").filter((function(e){return j.has(e)}));for(var o=0,i=[],a=new Map,c=new Map;o<t.length;o++)if("["===t[o])i.push(o);else if("]"===t[o]){var s=i.pop();if(void 0===s)break;a.set(s,o),c.set(o,s)}return(i.length>0||o<t.length)&&console.error("Unbalanced loops"),{program:t,loopForward:Object(u.a)(a),loopBackward:Object(u.a)(c)}},C=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(x(e)||e.blocked)return e;var r=f(e);if(d()(r.breakpoints,r.programCounter)>=0&&!t)return r.blocked=!0,r.blockType="breakpoint",r;var n=g(r),o=!1;switch(n){case">":r.dataPointer++;break;case"<":r.dataPointer--;break;case"+":O(r,m(r)+1);break;case"-":O(r,(m(r)-1+256)%256);break;case",":if(r.stdin=p(r.stdin,{type:"read",data:1}),r.stdin.pendingSize>0)return r.blocked=!0,r.blockType="io",r;if(O(r,r.stdin.readBuffer[0]),void 0===r.stdin.readBuffer[0])throw new Error("invalid write ".concat(r.stdin));break;case".":r.stdout=p(r.stdout,{type:"write",data:m(r)});break;case"[":if(0===m(r)){var i=r.loopForward.get(r.programCounter);if(void 0===i)throw new Error("Cannot find the corresponding ]");r.programCounter=i+1,o=!0}break;case"]":if(0!==m(r)){var a=r.loopBackward.get(r.programCounter);if(void 0===a)throw new Error("Cannot find the corresponding ]");r.programCounter=a+1,o=!0}}return o||r.programCounter++,r},w=function(e,t){switch(t.type){case"next":return C(e);case"write":return function(e,t){var r=f(e);return r.stdin=p(r.stdin,{type:"write",data:t}),0===r.stdin.pendingSize&&"io"===r.blockType&&(r.blocked=!1,r.blockType="none"),r}(e,t.data);case"continue":return C(function(e){var t=f(e);return t.blocked&&"breakpoint"===t.blockType&&(t.blocked=!1,t.blockType="none"),t}(e),!0);case"breakpoint":return function(e,t){for(var r=f(e),n=0;n<=r.breakpoints.length;n++){if(r.breakpoints[n]===t)return r.breakpoints=r.breakpoints.slice(0,n).concat(r.breakpoints.slice(n+1,r.breakpoints.length)),r;if(n===r.breakpoints.length||r.breakpoints[n]>t)return r.breakpoints=r.breakpoints.slice(0,n).concat([t],r.breakpoints.slice(n,r.breakpoints.length)),r}return r}(e,t.data);case"refresh-io":return function(e,t){var r=f(e);return e.stdin=t.input,e.stdout=t.output,r}(e,t.data)}},S='[ This program prints "Hello World!" and a newline to the screen, its\nlength is 106 active command characters. [It is not the shortest.]\n\nThis loop is an "initial comment loop", a simple way of adding a comment\nto a BF program such that you don\'t have to worry about any command\ncharacters. Any ".", ",", "+", "-", "<" and ">" characters are simply\nignored, the "[" and "]" characters just have to be balanced. This\nloop and the commands it contains are ignored because the current cell\ndefaults to a value of 0; the 0 value causes this loop to be skipped.\n]\n++++++++               Set Cell #0 to 8\n[\n  >++++               Add 4 to Cell #1; this will always set Cell #1 to 4\n  [                   as the cell will be cleared by the loop\n      >++             Add 2 to Cell #2\n      >+++            Add 3 to Cell #3\n      >+++            Add 3 to Cell #4\n      >+              Add 1 to Cell #5\n      <<<<-           Decrement the loop counter in Cell #1\n  ]                   Loop until Cell #1 is zero; number of iterations is 4\n  >+                  Add 1 to Cell #2\n  >+                  Add 1 to Cell #3\n  >-                  Subtract 1 from Cell #4\n  >>+                 Add 1 to Cell #6\n  [<]                 Move back to the first zero cell you find; this will\n                      be Cell #1 which was cleared by the previous loop\n  <-                  Decrement the loop Counter in Cell #0\n]                       Loop until Cell #0 is zero; number of iterations is 8\n\nThe result of this is:\nCell no :   0   1   2   3   4   5   6\nContents:   0   0  72 104  88  32   8\nPointer :   ^\n\n>>.                     Cell #2 has value 72 which is \'H\'\n>---.                   Subtract 3 from Cell #3 to get 101 which is \'e\'\n+++++++..+++.           Likewise for \'llo\' from Cell #3\n>>.                     Cell #5 is 32 for the space\n<-.                     Subtract 1 from Cell #4 for 87 to give a \'W\'\n<.                      Cell #3 was set to \'o\' from the end of \'Hello\'\n+++.------.--------.    Cell #3 for \'rl\' and \'d\'\n>>+.                    Add 1 to Cell #5 gives us an exclamation point\n>++.                    And finally a newline from Cell #6',z=r(4),N=r(14),B=function e(t,r,n){var o,i;if(r>n)throw new Error("Cannot parse an empty array");var a=r+Math.floor((n-r)/2),c=r<a?e(t,r,a-1):void 0,s=n>a?e(t,a+1,n):void 0;return{size:(null!==(o=null===c||void 0===c?void 0:c.size)&&void 0!==o?o:0)+(null!==(i=null===s||void 0===s?void 0:s.size)&&void 0!==i?i:0)+1,key:a,value:t[a],left:c,right:s}},A=function e(t,r){if(!r)throw new Error("List index out of bounds");return r.key===t?r.value:r.key>t?e(t,r.left):e(t,r.right)},P=function e(t,r,n){if(!n)throw new Error("List index out of bounds");var o=Object.assign({},n);return o.key===t?(o.value=r,o):(o.key>t?o.left=e(t,r,o.left):o.right=e(t,r,o.right),o)},L=function e(t,r,n,o){if(!o)throw new Error("List index out of range");o.left&&e(t,r,n,o.left),o.key>=r&&o.key<n&&t.push(o.value),o.right&&e(t,r,n,o.right)},M=function(){function e(t){Object(z.a)(this,e),this.root=void 0,t.fromArray?this.root=B(t.array,0,t.array.length-1):this.root=t.root}return Object(N.a)(e,[{key:"query",value:function(e){return A(e,this.root)}},{key:"update",value:function(t,r){return new e({fromArray:!1,root:P(t,r,this.root)})}},{key:"slice",value:function(e,t){var r=[];return L(r,e,t,this.root),r}},{key:"size",value:function(){return this.root.size}}]),e}(),T=function(e){return new M({fromArray:!0,array:e})},E=2<<16,I=function(e,t,r){return{programCounter:0,dataPointer:0,memory:T(Array(3e4).fill(0)),program:e.program,breakpoints:[],blocked:!1,blockType:"none",loopForward:e.loopForward,loopBackward:e.loopBackward,stdin:t,stdout:r}},D=function(e){for(var t=0;!x(e)&&++t<E&&!(e=w(e,{type:"next"})).blocked;);return t!==E||x(e)||console.error("Time limit exceed"),{finalState:e,numCycles:t,ended:x(e)}},F=r(7),H=function(e){return String.fromCharCode.apply(String,Object(F.a)(e))},W=function(e){return Array.from(e).map((function(e){return e.charCodeAt(0)}))},U=function(e){var t=Object(n.useState)(h(e)),r=Object(c.a)(t,2),o=r[0],i=r[1],a=Object(n.useCallback)((function(t){"reset"!==t.type?i((function(e){return p(e,t)})):i(h(e))}),[i,e]);return[o,a]},q=2048,R=function(e,t,r){return I(e,t,r)},J=(r(74),r(75),r(0)),G=function(e){var t=e.programState,r=e.dispatch,o=Object(n.useState)(""),i=Object(c.a)(o,2),a=i[0],s=i[1],l=Object(n.useMemo)((function(){return{output:H(t.stdout.buffer),input:H(t.stdin.buffer),inputBuffer:'"'.concat(H(t.stdin.readBuffer),'"')}}),[t]);return Object(J.jsxs)("div",{children:[Object(J.jsx)("h2",{children:"Output"}),Object(J.jsx)("div",{className:"console",children:Object(J.jsx)("div",{className:"console-text",children:Object(J.jsx)("pre",{children:l.output})})}),Object(J.jsx)("h2",{children:"Input"}),Object(J.jsxs)("div",{children:["Last read:"," ",'""'!==l.inputBuffer?Object(J.jsxs)(J.Fragment,{children:[Object(J.jsx)("span",{children:l.inputBuffer}),"\xa0 at ",t.stdin.readPointer]}):"(empty)"]}),Object(J.jsxs)("div",{className:"console with-input",children:[Object(J.jsx)("div",{className:"console-text",children:Object(J.jsx)("pre",{children:l.input})}),Object(J.jsx)("div",{className:"console-input",children:Object(J.jsx)("input",{placeholder:"This is the console",value:a,onKeyUp:function(e){"Enter"===e.key&&(r({type:"write",data:a}),s(""))},onChange:function(e){return s(e.target.value+"\n")}})})]})]})},V=(r(77),function(e){var t=e.programState,r=e.setCode,n=e.dispatch;return Object(J.jsxs)("div",{children:[Object(J.jsxs)("h2",{children:["Control Panel"," ",0===t.program.length&&Object(J.jsx)("span",{className:"note",children:"(enter any bf program to get started)"})]}),Object(J.jsxs)("p",{children:["Status:"," ",y(t)?x(t)?"ended":t.blocked?"blocked".concat("breakpoint"===t.blockType?" (breakpoint)":"io"===t.blockType?" (input required)":""):"running":"not started"]}),Object(J.jsxs)("ul",{className:"panel",children:[Object(J.jsx)("li",{children:Object(J.jsx)("button",{className:"btn",onClick:function(){k(t)&&n({type:"continue"}),n({type:"run"})},disabled:0===t.program.length||x(t)||t.blocked&&!k(t),children:y(t)?"Continue":"Run"})}),Object(J.jsx)("li",{children:Object(J.jsx)("button",{className:"btn",onClick:function(){k(t)?n({type:"continue"}):n({type:"next"})},disabled:x(t)||t.blocked&&!k(t),children:y(t)?"Step":"Start"})}),Object(J.jsx)("li",{children:Object(J.jsxs)("button",{className:"btn",onClick:function(){y(t)||n({type:"reset-io"}),n({type:"reset"})},disabled:0===t.program.length,children:["Reset"," ",!y(t)&&(t.stdin.pointer>0||t.stdout.pointer>0)?"IO":""]})}),Object(J.jsx)("li",{children:Object(J.jsx)("button",{className:"btn",onClick:function(){return r(S)},children:"Hello World!"})})]})]})}),Z=r(68),_=function(e){var t=e.code,r=e.setCode,n=e.enabled;return Object(J.jsxs)("div",{children:[Object(J.jsx)("h2",{children:"Editor"}),Object(J.jsx)(Z.a,{value:t,language:"brainfuck",placeholder:"brainfuck program here",onChange:function(e){return r(e.target.value)},padding:10,style:{border:"1px solid black",borderRadius:"var(--border-radius)"},disabled:!n})]})},K=function(){return Object(J.jsx)("div",{dangerouslySetInnerHTML:{__html:'<a href="https://github.com/PIG208/react-brainfucked" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>'}})},Y=(r(383),function(){return Object(J.jsxs)("div",{children:[Object(J.jsx)("h2",{children:"User Manual"}),Object(J.jsx)("p",{children:"A BF program has 8 different instructions"}),Object(J.jsxs)("table",{className:"manual-table",children:[Object(J.jsx)("thead",{children:Object(J.jsxs)("tr",{children:[Object(J.jsx)("th",{children:"Instruction"}),Object(J.jsx)("th",{children:"Description"})]})}),Object(J.jsxs)("tbody",{children:[Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:">"}),Object(J.jsx)("td",{children:"Move the data pointer to the right"})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:"<"}),Object(J.jsx)("td",{children:"Move the data pointer to the left"})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:"+"}),Object(J.jsx)("td",{children:"Increment the current memory cell"})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:"-"}),Object(J.jsx)("td",{children:"Decrement the current memory cell"})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:","}),Object(J.jsx)("td",{children:"Take one input from the stdin"})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:"."}),Object(J.jsx)("td",{children:"Print the current memory (decoded as ASCII)"})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:"["}),Object(J.jsxs)("td",{children:["Do nothing when the current memory cell is 0, otherwise jump to corresponding"," ",Object(J.jsx)("code",{children:"]"})]})]}),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:"]"}),Object(J.jsxs)("td",{children:["Do nothing when the current memory cell is 0, otherwise jump to corresponding"," ",Object(J.jsx)("code",{children:"["})]})]})]})]}),Object(J.jsxs)("p",{children:["Enter your program in the ",Object(J.jsx)("span",{className:"bordered-text",children:"Editor"}),". If it is nonempty, you should be able to click on ",Object(J.jsx)("span",{className:"bordered-text",children:"Run"})," to run it."]}),Object(J.jsxs)("p",{children:["You can also step through the program one cycle by one cycle after pressing the"," ",Object(J.jsx)("span",{className:"bordered-text",children:"Start"})," button."]}),Object(J.jsxs)("p",{children:["The ",Object(J.jsx)("span",{className:"bordered-text",children:"Last read"})," section indicates what the program has just read from the user input."]}),Object(J.jsx)("p",{children:"To add an breakpoint, just click on the instruction to pause at in the parsed program block."})]})}),Q=(r(384),r(385),function(e){var t=e.index,r=e.value,n=e.highlighted;return Object(J.jsxs)("div",{className:"memory-block".concat(n?" memory-block-highlighted":""),children:[Object(J.jsx)("div",{children:t}),Object(J.jsxs)("div",{children:[r,"|",r.toString(16),"|",JSON.stringify(String.fromCharCode(r)).slice(1,-1)]})]})}),X=function(e){var t=e.programState,r=e.memoryLower,n=e.memoryUpper;return Object(J.jsxs)("div",{className:"memory-field",children:[t.memory.slice(r,n).map((function(e,n){var o=n+r;return Object(J.jsx)(Q,{index:o,value:e,highlighted:t.dataPointer===o},o)})),Object(J.jsxs)("p",{className:"memory-size",children:["Showing ",n-r," of ",t.memory.size()," memory blocks."]})]})},$=function(e){var t=e.programState,r=e.dispatch,o=e.memoryDisplayCount,i=Math.max(0,t.dataPointer-Math.floor(o/2)),a=Math.min(i+o,t.memory.size()),c=Object(n.useMemo)((function(){var e=0;return t.program.map((function(r,n){return n===t.breakpoints[e]&&(e++,!0)}))}),[t.program,t.breakpoints]);return Object(J.jsxs)("div",{children:[Object(J.jsx)("h2",{children:"Visualization"}),Object(J.jsxs)("div",{className:"visualization",children:[Object(J.jsxs)("div",{className:"program-field",children:[t.program.map((function(e,n){return Object(J.jsx)("span",{className:(y(t)&&(o=n,!t.blocked&&(o===t.programCounter-1||0===o&&0===t.programCounter)||t.blocked&&o===t.programCounter)?"highlighted":"").concat(c[n]?" breakpoint":""),onClick:function(){return r({type:"breakpoint",data:n})},children:e},n);var o})),Object(J.jsx)("p",{children:"parsed program"})]}),Object(J.jsxs)("div",{children:[Object(J.jsxs)("p",{children:["program counter: ",t.programCounter,t.blocked?" (waiting for input)":""]}),Object(J.jsxs)("p",{children:["data pointer: ",t.dataPointer]}),Object(J.jsxs)("p",{children:["current data: ",t.memory.query(t.dataPointer)]})]})]}),Object(J.jsx)("p",{children:"Memory Cells"}),Object(J.jsx)(X,{programState:t,memoryLower:i,memoryUpper:a})]})},ee=function(e){return e>=2560?64:e>=1920?42:e>=1463?35:e>=1024?24:e>=768?15:12};var te=function(){var e=Object(n.useState)(""),t=Object(c.a)(e,2),r=t[0],o=t[1],i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=Object(n.useState)(e),r=Object(c.a)(t,2),o=r[0],i=r[1],a=Object(n.useMemo)((function(){return v(o)}),[o]),s=U(q),l=Object(c.a)(s,2),d=l[0],u=l[1],b=U(q),h=Object(c.a)(b,2),p=h[0],j=h[1],f=Object(n.useState)(R(a,d,p)),m=Object(c.a)(f,2),O=m[0],g=m[1];Object(n.useEffect)((function(){g((function(e){return w(e,{type:"refresh-io",data:{input:d,output:p}})}))}),[d,p]);var x=Object(n.useCallback)((function(e){switch(e.type){case"load":i(e.data);break;case"next":g((function(e){return w(e,{type:"next"})}));break;case"run":g((function(e){return D(e).finalState}));break;case"reset":g((function(e){return R(a,e.stdin,e.stdout)}));break;case"reset-io":u({type:"reset"}),j({type:"reset"});break;case"write":g((function(t){return w(t,{type:"write",data:W(e.data)})}));break;case"breakpoint":g((function(t){return w(t,{type:"breakpoint",data:e.data})}));break;case"continue":g((function(e){return w(e,{type:"continue"})}))}}),[i,g,a,u,j]);return[O,x]}(r),a=Object(c.a)(i,2),s=a[0],l=a[1],d=Object(n.useState)(!0),u=Object(c.a)(d,1)[0],b=Object(n.useState)(ee(window.innerWidth)),h=Object(c.a)(b,2),p=h[0],j=h[1];return Object(n.useEffect)((function(){function e(){j(ee(window.innerWidth))}return window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[]),Object(n.useEffect)((function(){l({type:"load",data:r}),l({type:"reset"})}),[r,l]),Object(J.jsxs)("div",{className:"App",children:[Object(J.jsx)("h1",{id:"center",children:"react-brainfucked"}),Object(J.jsxs)("main",{className:"App-main",children:[Object(J.jsxs)("div",{children:[Object(J.jsx)(_,{code:r,setCode:o,enabled:u}),Object(J.jsx)($,{programState:s,dispatch:l,memoryDisplayCount:p})]}),Object(J.jsxs)("div",{children:[Object(J.jsx)(V,{programState:s,setCode:o,dispatch:l}),Object(J.jsx)(G,{programState:s,dispatch:l}),Object(J.jsx)(Y,{})]})]}),Object(J.jsx)(K,{})]})};r(386);a.a.render(Object(J.jsx)(o.a.StrictMode,{children:Object(J.jsx)(te,{})}),document.getElementById("root"))},74:function(e,t,r){},75:function(e,t,r){},77:function(e,t,r){}},[[387,1,2]]]);
//# sourceMappingURL=main.ae8a84fe.chunk.js.map