import dates from 'date-and-time';

export const datetimeformat=(datetime)=>
{

    // var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var showtime=datetime;
    var today = new Date();
    // alert(JSON.stringify(datetime.getMonth() ))
    if(today.getFullYear()===datetime.getFullYear())
    {
        if(today.getMonth()===datetime.getMonth())
        {
            if(today.getDate()===datetime.getDate())
            {
                showtime=dates.format(datetime, 'hh:mm');
            }
            else
            {
                showtime= dates.format(datetime, 'ddd,DD MMM');
            }
        }
        else
        {
            showtime= dates.format(datetime, 'ddd,DD MMM');
        }
    }
    else
    {
        showtime= dates.format(datetime, 'ddd,DD MMM YYYY'); 
    }
    return showtime;
}

export const nowtime=()=>{
    // var date = dates.format(today, 'DD/MM/YYYY');
    var today = new Date();
    var time=dates.format(today, 'hh:mm');
    const t=""+time+"";
    // alert(JSON.stringify(time))
    // var currentDate = today.toGMTString();
    //  date = today.toLocaleString();
    // var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var time = today.getHours() + ":" + today.getMinutes() ;
    // var dateTime = date+' '+time;
     return t;
}


export const nowdate=()=>{
    // var today = new Date();
    // var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var today = new Date();
    var date=dates.format(today, 'ddd, DD-MMM ');  
    return date;
}
