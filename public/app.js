$(document).ready(() => {

    $.getJSON("/articles", data => {
        const articles = $(".accordion");
        for (let i = 0; i < data.length; i++) {
            articles.prepend(`
                <div class="card-header" id="heading${i}>
                    <h2 class="mb-0">
                        <button class="btn btn-link titleCSS" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">${data[i].title}</button>
                    </h2>
                </div>
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        ${data[i].summary}<br><br>
                        <a href='https://www.infoworld.com${data[i].link}'>Article Link</a>
                        <button data-id=${data[i]._id} class="add-notes">Comments</button><br>
                    </div>    
                </div>
            `);
        }
    }).catch(err => console.log(err));

    $(document).on("click", ".scraped", (event) => {
        $(".accordion").empty();
        $.ajax('/scrape', {
            type: "GET",
        }).then((result) => {

        }).catch(err => console.log(err));

        $.getJSON("/articles", data => {
            const articles = $(".accordion");
            for (let i = 0; i < data.length; i++) {
                articles.prepend(`
                <div class="card-header" id="heading${i}>
                    <h2 class="mb-0">
                        <button class="btn btn-link titleCSS" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">${data[i].title}</button>
                    </h2>
                </div>
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        ${data[i].summary}<br><br>
                        <a href='https://www.infoworld.com${data[i].link}'>Article Link</a>
                        <button data-id=${data[i]._id} class="add-notes">Comments</button><br>
                    </div>    
                </div>
            `);
            }
        }).catch(err => console.log(err));
    });

    $(document).on("click", `.titleCSS`, (event) => {
        $(".note").empty();
    });

    $(document).on("click", `.add-notes`, (event) => {
        $(".note").empty();
        const thisID = $(event.target)[0].dataset.id;
        const noteDiv = $(".note");
        noteDiv.append(`
        <form class="saveNote" data-id="${thisID}">                
            <div class="form-group">
                <label for="title-input">Title:</label>
                <input type="text" class="form-control" id="title-input">
            </div>
            <div class="form-group">
                <label for="note-input">Comment:</label>
                <textarea class="form-control" rows="5" id="note-input"></textarea>
            </div>
            <button type="submit"  value="Submit">Submit</button>
        </form>
        <br>
        <div class="note-body">All Notes<br><br></div>
        `);
        $.ajax({
            method: "GET",
            url: "/articles/" + thisID
        }).then(data => getNotesData(data))
            .catch(err => console.log(err));

        const getNotesData = (data) => {

            data = data.note.map(response => {
                return {
                    title: response.title,
                    body: response.body
                }
            });
            data.forEach(dataComment => {
                $(".note-body").append(`
                Title: ${dataComment.title}<br> 
                Comment: ${dataComment.body}<br><br>
                `);
            });
        }
    });

    $(document).on("submit", `.saveNote`, (event) => {
        const thisID = $(event.target)[0].dataset.id;
        $.ajax({
            method: "POST",
            url: "/articles/" + thisID,
            data: {
                title: $("#title-input").val(),
                body: $("#note-input").val()
            }
        }).then(data => {
        }).catch(err => console.log(err));
    });
});