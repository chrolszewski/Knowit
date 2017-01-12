var KNOWIT = {
    name: 'KNOWIT',
    currentPage: 0,
    maxPage: 0,

    populateTable: function(){ 
        //Found the max value for the page by multiplying 
        //how many rows per page I've set with what page I'm currently on        
        var max = this.currentPage*rowsPerPage,

        //Min value is found by subtracting how many rows per page I want from the max value
        min = max-rowsPerPage,   

        tHTML = '', 

        //Created a new array each time the page changes by slicing the original 
        //repository object from github with the min and max values found earlier                
        pageArr = jsonObj.items.slice(min,max);
        
        //Generating the page's table
        tHTML  = '<thead id="tblHead">';
        tHTML +=    '<tr>',
        tHTML +=        '<th style="width:42px;" class="cellNumbered">#</th>'
        tHTML +=        '<th style="width:225px;">Name</th>'
        tHTML +=        '<th>Description</th>'
        tHTML +=        '<th style="width:75px;" class="cellNumbered">Size</th>'
        tHTML +=        '<th style="width:155px;" class="cellNoBreak cellCentered">Last updated</th>'
        tHTML +=    '</tr>',
        tHTML += '</thead>',
        tHTML += '<tbody>';
 
        for(let i=0;i<pageArr.length;i++){
            var item = pageArr[i],

            //If the repisitory didn't have a home page, I used the github url insted
            link = item.homepage==(null|'')?item.html_url:item.homepage,

            //Changing bytes to kilobytes whereever they are. 
            //Since none of the 100 repositories had larger files than 1024 kB, 
            //I only converted from B to kB
            size = item.size<1024?item.size+' B':Math.ceil(item.size/1024) + ' kB',

            //Changing the date to a more readable format
            upd = new Date(item.updated_at).toLocaleString();

            tHTML += '<tr>',
            tHTML +=    '<td class="cellNumbered">' + (min + i + 1) + '</td>',

            //Made the repository name a link to either its homepage, or its page on github
            tHTML +=    '<td class="cellNoBreak"><a href="' + link + '">' + item.name + '</a></td>',

            //Escapes any html characters and displays them as text
            tHTML +=    '<td>' + this.htmlEscape(item.description) + '</td>',

            tHTML +=    '<td class="cellNoBreak cellNumbered">' + size + '</td>',
            tHTML +=    '<td class="cellNoBreak cellCentered">' + upd + '</td>',
            tHTML += '</tr>';       
        }
        tHTML += '</tbody>';        

        document.getElementById('records_table').innerHTML = tHTML;

        //small jQuery plugin to fix table header
        $('#records_table').tableHeadFixer();

        //Scroll to the top of the page when a new page loads
        var elem = document.getElementById("tblHead");  
        elem.scrollIntoView(true);
    },
    //Jumps to a specific page
    showPage: function(page){ 
        //Do nothing if the page clicked is the current page       
        if(this.currentPage == page)
            return false;
        
        if(this.currentPage > 0)
            $('#page'+this.currentPage).attr('class','normalPage');
        $('#page'+page).attr('class','currentPage');     

        this.currentPage = page;
        
        $('#prevPage').attr('class','normalPage'+(this.currentPage==1?' endPage':''));   
        $('#nextPage').attr('class','normalPage'+(this.currentPage==this.maxPage?' endPage':''));
        
        this.populateTable();
        
    },                
    prevPage: function(){
        //Do nothing if the current page is the first page
        if(this.currentPage==1)
            return false;
        this.showPage(this.currentPage-1);
    },
    nextPage: function(){
        //Do nothing if the current page is the last page
        if(this.currentPage==this.maxPage)
            return false;
        this.showPage(this.currentPage+1);
    },
    //Generating the navigation panel. The panel resides at the bottom of the page.
    showNav: function(){
        var navHTML = '<span class="normalPage" onclick="KNOWIT.showPage(1)" id="firstPage">First</span> | ';
        navHTML += '<span class="normalPage'+(this.currentPage==1?' endPage':'')+'" onclick="KNOWIT.prevPage()" id="prevPage">Previous</span> | ';
        for(let i=1; i<=this.maxPage; i++)
            navHTML += '<span class="'+(i==1?'currentPage':'normalPage')+'" id="page' + i + '" onclick="KNOWIT.showPage('+i+');">'+i+'</span> | ';            
        navHTML += '<span class="normalPage" onclick="KNOWIT.nextPage()" id="nextPage">Next</span> | ',
        navHTML += '<span class="normalPage" onclick="KNOWIT.showPage('+this.maxPage+')" id="lastPage">Last</span>';

        document.getElementById('footer').innerHTML = navHTML;
    },
    //Formating function. Needed it for escaping html characters
    htmlEscape: function(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}