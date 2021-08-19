const a=false;


    function PostCall(){
    
        const receiverEmail=document.getElementById('email').value;
        const mailContent=document.getElementById('mailContent').value;
        const sDate=document.getElementById('sDate').value;
        const sTime=document.getElementById('sTime').value;
        console.log("Email->"+receiverEmail+"<-mailContent->"+mailContent+"<-sDate->"+sDate+"<-sTime->"+sTime);
       
        
       const given=new Date(sDate+" "+sTime); 
       const current= new Date();

       if(receiverEmail===""||mailContent===""||sDate===""||sTime===""){
        M.toast({html: 'please fill all the fields'});
        return;
       }
       if(current>given){
        M.toast({html: 'please enter valid schedule date'});
           return;
       }
       else{
        toggledipla();
        makeservercall(receiverEmail,mailContent,given.toUTCString(),sTime);
        M.toast({html: 'Mail Reminder Scheduled successfully'});
         setInterval(() => {
             const a=new Date();
             const timeRemaining=timeDiffCalc(given,a);
              const timeElement=document.getElementById("changetime");
              timeElement.innerText=timeRemaining;
            }, 100);    
    }
}


function toggledipla(){ 
    const form= document.getElementById("form");
    form.classList.toggle("hide");
    const displ=document.getElementById("displ");
    displ.classList.toggle("hide");
    if(!(displ.classList.contains("hide"))) {
      console.log("entered");
      loadFromLocal();
    }
}
function loadFromLocal(){
  const elem=document.getElementById("root");
  const localData=localStorage.getItem("reminder");
  const prev=document.getElementById("predetails");
  if(localData){
   const arr=JSON.parse(localData);
   console.log("before"+Object.keys(arr.schedules).length);
    const size=Object.keys(arr.schedules).length-1;
    if(size==0){
      prev.classList.toggle("hide");
     }
   const c= document.createElement("li");
     c.innerText="Email:-"+arr.schedules[size].rEmail+" Content:-"+arr.schedules[size].mailContent+" Date&Time:-"+arr.schedules[size].scheduledDate+"::"+arr.schedules[size].scheduledTime
     c.className="card-title";
     elem.appendChild(c);
     const sepeat=document.createElement("div");
     sepeat.className="card-action";
     c.appendChild(sepeat);
    }
   else{
    prev.classList.toggle("hide");
     return
   }
}


function timeDiffCalc(dateFuture, dateNow) {
    var diffInSeconds = Math.floor(dateFuture - dateNow) / 1000;
    // calculate days\
    var days = Math.floor(parseInt(diffInSeconds / 86400));
    diffInSeconds -= days * 86400;
   //console.log("calculated days"+ days);

    // calculate hours
    var hours = Math.floor(diffInSeconds / 3600) % 24;
    diffInSeconds -= hours * 3600;
  //  console.log('calculated hours', hours);

    // calculate minutes
    var minutes = Math.floor(diffInSeconds / 60) % 60;
     diffInSeconds -= minutes * 60;
   // console.log('minutes', minutes);

   
    var difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    }

    difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

    difference += (minutes === 0 || minutes === 1) ? `${minutes} minute, ` : `${minutes} minutes, `;
    difference+= (diffInSeconds === 0 || diffInSeconds === 1) ? `${Math.round(diffInSeconds)} second` : `${Math.round(diffInSeconds)} seconds`;

   return difference;
  }

  function makeservercall(receiverEmail,mailContent,givenDate,givenTime){
    var obj = new Object();
    obj.rEmail = receiverEmail;
    obj.mailContent  = mailContent;
    obj.scheduledDate = givenDate;
    obj.scheduledTime=givenTime;
//  //   console.log(givenDate+"--"+givenTime);
//     var bodyjson=JSON.parse({
//       "rEmail:"+receiverEmail,
//       "mailContent": mailContent,
//       "scheduledDate": givenDate,
//       "scheduledTime":givenTime
//   });
const arr=[];
   if(localStorage.getItem("reminder")==null){
//console.log("first time");
var mainobj = new Object();
arr.push(obj);
mainobj.schedules=arr;
localStorage.setItem("reminder",JSON.stringify(mainobj));
   }
   else{
     const farray=[];
     var a=localStorage.getItem("reminder")
     const arr=JSON.parse(a);
    // console.log(+JSON.stringify(arr));
     console.log(arr.schedules[0]);
     console.log(Object.keys(arr.schedules).length)
     for(let i=0;i<Object.keys(arr.schedules).length;i++){
     const ob=arr.schedules[i];
     farray.push(ob);
     }
     farray.push(obj);
     var mobj = new Object();
     mobj.schedules=farray;
    localStorage.removeItem("reminder");
     localStorage.setItem("reminder",JSON.stringify(mobj));
   }
    fetch("https://emailreminder.cleverapps.io/scheduleMail", {
      method: "POST",
      body:JSON.stringify(obj),
      headers: {
          "Content-type": "application/json",
      }
  })
  .then(response => response.json())
  .then(json => console.log(json)).catch(err=>{
    console.log("Server not accepting api call");
  })


  }
