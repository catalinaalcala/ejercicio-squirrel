const fetchPromise = fetch("https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json");
fetchPromise.then (response => response.json()).then(diary => {
    html = "";
    html2 = "";
        
    let correlations = [];

    for (let i=0; i<diary.length; i++) {
        let day = diary[i];
        let events= day.events;
        let squirrel = day.squirrel;

        if(squirrel) html = html + "<tr class='bg-danger'>\n<th scope='row'>" + (i + 1) + "</th>\n";
        else html = html + "<tr>\n<th scope='row'>" + (i + 1) + "</th>\n";
        let eventsList="";
        for (let j=0; j<events.length; j++) {
            eventsList = eventsList + events[j];
            eventsList = j==events.length - 1? eventsList: eventsList + ", ";
            let encontrado=false;
            for(let k=0; k<correlations.length && !encontrado; k++) {
                if (correlations[k].event === events[j]) encontrado = true;
            }
            if(!encontrado) {
                correlations.push({event:events[j], mcc:NaN});
            }
        }
        html = html + "<td>" + eventsList +"</td>\n";
        html = html + "<td>" + squirrel + "</td>\n</tr>\n";
    }

    for (let i=0; i<correlations.length; i++) {
        let tn=0;
        let fn=0;
        let fp=0;
        let tp=0;
        for (let j=0; j<diary.length; j++) {
            let day = diary[j];
            let events= day.events;
            let squirrel = day.squirrel;
            let encontrado=false;
            for (let k=0; k<events.length && !encontrado; k++) {
                if (correlations[i].event === events[k]) encontrado = true;
            }
            if(!squirrel && !encontrado) tn++;
            else if(!squirrel && encontrado) fn++;
            else if(squirrel && !encontrado) fp++;
            else if(squirrel && encontrado) tp++;
        }
        console.log(tp + "-" + tn + "-" + fp + "-" + fn);
        let mcc = (tp*tn - fp*fn)/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn));
        correlations[i].mcc=mcc;
    }

    correlations.sort(function(a,b){return a.mcc < b.mcc});

    for (let i=0; i<correlations.length; i++) {
        let id=i+1;
        let event=correlations[i].event;
        let mcc=correlations[i].mcc;
        html2 = html2 + "<tr>\n<th scope='row'>"+ id +
        "</th>\n<td>"+ event +"</td>\n<td>"+ mcc +"</td>\n</tr>\n"; 
    }

    document.getElementById("list").innerHTML=html;
    document.getElementById("correlation").innerHTML=html2;
});